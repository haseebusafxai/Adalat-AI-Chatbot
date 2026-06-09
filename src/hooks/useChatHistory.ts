import { useCallback, useEffect, useState } from 'react'
import {
  createChatTitle,
  createEmptyChat,
  loadChats,
  saveChats,
  upsertChat,
} from '../lib/chatStorage'
import { setActiveSessionId, clearActiveSessionId } from '../lib/session'
import type { ChatMessage, SavedChat } from '../types/chat'

export function useChatHistory() {
  const [chats, setChats] = useState<SavedChat[]>(() => loadChats())
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  useEffect(() => {
    saveChats(chats)
  }, [chats])

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  const persistChat = useCallback((chat: SavedChat) => {
    setChats((prev) => upsertChat(prev, { ...chat, updatedAt: Date.now() }))
  }, [])

  const startNewChat = useCallback(() => {
    setActiveChatId(null)
    clearActiveSessionId()
  }, [])

  const openChat = useCallback((chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    if (!chat) return
    setActiveChatId(chatId)
    setActiveSessionId(chat.sessionId)
  }, [chats])

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId))
      if (activeChatId === chatId) {
        setActiveChatId(null)
        clearActiveSessionId()
      }
    },
    [activeChatId],
  )

  const ensureChatForMessage = useCallback(
    (firstUserText: string): SavedChat => {
      if (activeChatId) {
        const existing = chats.find((c) => c.id === activeChatId)
        if (existing) {
          setActiveSessionId(existing.sessionId)
          return existing
        }
      }

      const chat = createEmptyChat()
      chat.title = createChatTitle(firstUserText)
      setChats((prev) => [chat, ...prev])
      setActiveChatId(chat.id)
      setActiveSessionId(chat.sessionId)
      return chat
    },
    [activeChatId, chats],
  )

  const syncChatMessages = useCallback(
    (chatId: string, messages: ChatMessage[]) => {
      setChats((prev) => {
        const chat = prev.find((c) => c.id === chatId)
        if (!chat) return prev

        const firstUser = messages.find((m) => m.role === 'user')
        const title =
          chat.title === 'New conversation' && firstUser
            ? createChatTitle(firstUser.content)
            : chat.title

        return upsertChat(prev, {
          ...chat,
          title,
          messages,
          updatedAt: Date.now(),
        })
      })
    },
    [],
  )

  return {
    chats,
    activeChat,
    activeChatId,
    startNewChat,
    openChat,
    deleteChat,
    ensureChatForMessage,
    syncChatMessages,
    persistChat,
  }
}
