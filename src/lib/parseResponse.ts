const SUGGESTED_MARKERS = [
  /suggested\s+next\s+questions?\s*:?\s*/i,
  /اگلے\s+سوالات?\s*:?\s*/,
  /تجویز\s+کردہ\s+سوالات?\s*:?\s*/,
]

export function extractSuggestedQuestions(text: string): {
  body: string
  suggestions: string[]
} {
  let splitIndex = -1
  let markerLength = 0

  for (const marker of SUGGESTED_MARKERS) {
    const match = text.match(marker)
    if (match && match.index !== undefined) {
      if (splitIndex === -1 || match.index < splitIndex) {
        splitIndex = match.index
        markerLength = match[0].length
      }
    }
  }

  if (splitIndex === -1) {
    return { body: text.trim(), suggestions: [] }
  }

  const body = text.slice(0, splitIndex).trim()
  const tail = text.slice(splitIndex + markerLength).trim()
  const suggestions = tail
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/^[\d]+[.)]\s*/, '')
        .replace(/^[-•*]\s*/, '')
        .replace(/^[""]|[""]$/g, '')
        .trim(),
    )
    .filter((line) => line.length > 8 && line.length < 220)
    .slice(0, 3)

  return { body, suggestions }
}

export function parseWebhookPayload(data: unknown): string {
  if (typeof data === 'string') return data

  if (data === null || data === undefined) {
    throw new Error('Empty response from Adalat AI.')
  }

  if (typeof data !== 'object') {
    return String(data)
  }

  const record = data as Record<string, unknown>

  if (
    typeof record.message === 'string' &&
    record.code !== undefined &&
    Number(record.code) !== 0
  ) {
    throw new Error(record.message)
  }

  if (
    typeof record.message === 'string' &&
    record.code === 0 &&
    !record.output &&
    !record.text
  ) {
    throw new Error(record.message)
  }

  const candidates = [
    record.output,
    record.text,
    record.response,
    record.answer,
    record.reply,
    record.message,
    record.result,
  ]

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value
  }

  if (Array.isArray(data)) {
    const first = data[0] as Record<string, unknown> | undefined
    if (first?.json) return parseWebhookPayload(first.json)
    if (first?.output) return parseWebhookPayload(first.output)
  }

  if (record.data && typeof record.data === 'object') {
    return parseWebhookPayload(record.data)
  }

  throw new Error(
    'Could not read the assistant reply. Ensure your n8n workflow uses "Respond to Webhook" with the agent output.',
  )
}
