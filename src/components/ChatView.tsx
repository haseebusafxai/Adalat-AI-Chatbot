import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { ChatMessage } from '../types/chat'

interface ChatViewProps {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  onFollowUp: (query: string) => void
}

export function ChatView({
  messages,
  isLoading,
  error,
  onFollowUp,
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, error])

  return (
    <div className="chat-thread">
      <div className="chat-thread-inner">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSuggestionClick={
              message.role === 'assistant' && !isLoading ? onFollowUp : undefined
            }
          />
        ))}

        {isLoading && (
          <div className="message-row message-row--assistant animate-fade-up">
            <div className="message-bubble message-bubble--assistant message-bubble--loading">
              <div className="typing-indicator">
                <span />
                <span />
                <span />
                <p>Adalat AI is reviewing Pakistani law…</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="chat-error">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
