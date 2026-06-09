import { MarkdownContent } from './MarkdownContent'
import { getTextDirection } from '../lib/textDirection'
import type { ChatMessage } from '../types/chat'

interface MessageBubbleProps {
  message: ChatMessage
  onSuggestionClick?: (question: string) => void
}

export function MessageBubble({
  message,
  onSuggestionClick,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const dir = getTextDirection(message.content)

  return (
    <div
      className={`message-row animate-fade-up ${isUser ? 'message-row--user' : 'message-row--assistant'}`}
    >
      <div
        className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}
        dir={isUser ? 'ltr' : dir}
      >
        {!isUser && (
          <div className="message-bubble-head">
            <span className="message-bubble-badge">AI</span>
            <span className="message-bubble-brand">Adalat AI</span>
          </div>
        )}

        {isUser ? (
          <p className="message-text" dir={dir}>
            {message.content}
          </p>
        ) : (
          <MarkdownContent content={message.content} />
        )}

        {!isUser &&
          message.suggestedQuestions &&
          message.suggestedQuestions.length > 0 &&
          onSuggestionClick && (
            <div className="message-suggestions" dir={dir}>
              <p className="message-suggestions-label">Suggested next questions</p>
              <div className="message-suggestions-list">
                {message.suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onSuggestionClick(q)}
                    className="message-suggestion-btn"
                    dir={getTextDirection(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
