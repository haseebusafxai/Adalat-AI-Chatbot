import { getSessionId } from '../lib/session'
import { extractSuggestedQuestions, parseWebhookPayload } from '../lib/parseResponse'
import type { ChatRequest } from '../types/chat'

const WEBHOOK_PATH =
  import.meta.env.VITE_WEBHOOK_PATH ??
  '/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37'

const baseUrl = import.meta.env.DEV
  ? `/api/n8n${WEBHOOK_PATH}`
  : `http://localhost:5678${WEBHOOK_PATH}`

export interface ChatApiResult {
  content: string
  suggestedQuestions: string[]
}

async function requestWebhook(
  payload: ChatRequest,
  method: 'GET' | 'POST',
): Promise<unknown> {
  if (method === 'GET') {
    const params = new URLSearchParams({
      chatInput: payload.chatInput,
      sessionId: payload.sessionId,
    })
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    return handleResponse(response)
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

async function handleResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data: unknown = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

function methodNotAllowed(message: string, method: 'GET' | 'POST'): boolean {
  if (method === 'POST') {
    return (
      message.includes('not registered for POST') ||
      message.includes('Did you mean to make a GET')
    )
  }
  return (
    message.includes('not registered for GET') ||
    message.includes('Did you mean to make a POST')
  )
}

export async function sendChatMessage(chatInput: string): Promise<ChatApiResult> {
  const payload: ChatRequest = {
    chatInput: chatInput.trim(),
    sessionId: getSessionId(),
  }

  if (!payload.chatInput) {
    throw new Error('Please enter a legal question.')
  }

  const methods: Array<'POST' | 'GET'> = ['POST', 'GET']
  let lastError: Error | null = null

  for (const method of methods) {
    try {
      const data = await requestWebhook(payload, method)
      const raw = parseWebhookPayload(data)
      const { body, suggestions } = extractSuggestedQuestions(raw)
      return { content: body, suggestedQuestions: suggestions }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Something went wrong.')
      lastError = err

      const fallback = method === 'POST' ? 'GET' : 'POST'
      if (!methodNotAllowed(err.message, method)) {
        throw err
      }

      const otherAllowed = methods.includes(fallback)
      if (!otherAllowed) throw err
    }
  }

  throw lastError ?? new Error('Could not reach Adalat AI. Is n8n running?')
}
