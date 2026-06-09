import type { ChatMessage, SavedChat } from '../types/chat'

const STORAGE_KEY = 'adalat-ai-chats-v1'
const MAX_CHATS = 50

export function loadChats(): SavedChat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedChat[]
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.updatedAt - a.updatedAt)
      : []
  } catch {
    return []
  }
}

export function saveChats(chats: SavedChat[]): void {
  const trimmed = chats
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_CHATS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function createChatTitle(firstMessage: string): string {
  const clean = firstMessage.replace(/\s+/g, ' ').trim()
  if (clean.length <= 48) return clean
  return `${clean.slice(0, 48)}…`
}

export function createEmptyChat(): SavedChat {
  const id = crypto.randomUUID()
  return {
    id,
    title: 'New conversation',
    messages: [],
    sessionId: id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function upsertChat(chats: SavedChat[], chat: SavedChat): SavedChat[] {
  const index = chats.findIndex((c) => c.id === chat.id)
  if (index === -1) return [chat, ...chats]
  const next = [...chats]
  next[index] = chat
  return next
}

export function mergeMessages(
  existing: ChatMessage[],
  incoming: ChatMessage[],
): ChatMessage[] {
  const byId = new Map(existing.map((m) => [m.id, m]))
  for (const msg of incoming) {
    byId.set(msg.id, msg)
  }
  return [...byId.values()].sort((a, b) => a.createdAt - b.createdAt)
}
