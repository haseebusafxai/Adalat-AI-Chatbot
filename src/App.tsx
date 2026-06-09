import { useCallback, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/AppShell'
import { WelcomePage } from './components/WelcomePage'
import { ChatView } from './components/ChatView'
import { ChatFooter } from './components/ChatFooter'
import { useChatMutation } from './hooks/useChatMutation'
import { useChatHistory } from './hooks/useChatHistory'
import type { ChatMessage } from './types/chat'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: 0 },
  },
})

function ChatApp() {
  const [view, setView] = useState<'welcome' | 'chat'>('welcome')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const {
    chats,
    activeChatId,
    startNewChat,
    openChat,
    deleteChat,
    ensureChatForMessage,
    syncChatMessages,
  } = useChatHistory()

  const mutation = useChatMutation({
    onUserMessage: (message) => {
      setMessages((prev) => [...prev, message])
      setError(null)
    },
    onAssistantMessage: (message) => {
      setMessages((prev) => [...prev, message])
      setInput('')
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const submitQuery = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (!trimmed || mutation.isPending) return

      const chat = ensureChatForMessage(trimmed)
      setView('chat')
      setInput('')
      setError(null)
      setMessages((prev) => (prev.length > 0 ? prev : chat.messages))

      mutation.mutate(trimmed)
    },
    [mutation, ensureChatForMessage],
  )

  const handleSubmit = () => submitQuery(input)

  const handleExampleSelect = (query: string) => {
    setInput(query)
    submitQuery(query)
  }

  const handleNewChat = () => {
    setMessages([])
    setInput('')
    setError(null)
    setView('welcome')
    startNewChat()
    mutation.reset()
  }

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    if (!chat) return
    openChat(chatId)
    setMessages(chat.messages)
    setInput('')
    setError(null)
    setView('chat')
    mutation.reset()
  }

  const handleDeleteChat = (chatId: string) => {
    const wasActive = activeChatId === chatId
    deleteChat(chatId)
    if (wasActive) {
      setMessages([])
      setInput('')
      setError(null)
      setView('welcome')
      mutation.reset()
    }
  }

  useEffect(() => {
    if (!activeChatId || messages.length === 0) return
    syncChatMessages(activeChatId, messages)
  }, [messages, activeChatId, syncChatMessages])

  const showSidebar = view === 'chat' || chats.length > 0

  return (
    <AppShell
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={handleSelectChat}
      onDeleteChat={handleDeleteChat}
      onNewChat={handleNewChat}
      showSidebar={showSidebar}
      showAppHeader={view === 'chat'}
      footer={
        view === 'chat' ? (
          <ChatFooter
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            disabled={mutation.isPending}
          />
        ) : undefined
      }
    >
      {view === 'welcome' ? (
        <WelcomePage
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onExampleSelect={handleExampleSelect}
          isLoading={mutation.isPending}
        />
      ) : (
        <ChatView
          messages={messages}
          isLoading={mutation.isPending}
          error={error}
          onFollowUp={submitQuery}
        />
      )}
    </AppShell>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatApp />
    </QueryClientProvider>
  )
}
