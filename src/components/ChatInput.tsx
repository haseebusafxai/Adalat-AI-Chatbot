import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  variant?: 'welcome' | 'chat'
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Ask about bail, FIR, arrest rights, or the Constitution…',
  autoFocus = false,
  variant = 'welcome',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const speech = useSpeechRecognition(onChange, value)

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  useEffect(() => () => speech.stop(), [speech.stop])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    speech.stop()
    onSubmit()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!value.trim() || disabled) return
      speech.stop()
      onSubmit()
    }
  }

  const isWelcome = variant === 'welcome'

  return (
    <form
      onSubmit={handleSubmit}
      className={isWelcome ? 'welcome-input-form' : 'chat-input-form'}
    >
      {speech.error && (
        <p className="chat-speech-error" role="alert">
          {speech.error}
          <button
            type="button"
            className="chat-speech-error-dismiss"
            onClick={speech.clearError}
          >
            Dismiss
          </button>
        </p>
      )}

      <div
        className={
          isWelcome
            ? 'welcome-input-box'
            : 'chat-input-box flex w-full items-end gap-2 rounded-xl border border-adalat-green/15 p-2 shadow-sm'
        }
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || speech.listening}
          rows={1}
          placeholder={placeholder}
          aria-label="Legal question"
          className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[0.95rem] text-adalat-ink outline-none placeholder:text-adalat-muted/70 disabled:opacity-60"
        />

        {speech.isSupported && (
          <button
            type="button"
            disabled={disabled}
            onClick={speech.toggle}
            className={`chat-input-mic ${speech.listening ? 'chat-input-mic--active' : ''}`}
            aria-label={
              speech.listening
                ? 'Stop voice input'
                : 'Voice input — speak in English, Urdu, or Pashto'
            }
            title="Voice input (English, Urdu, Pashto)"
          >
            {speech.listening ? (
              <span className="chat-input-mic-pulse" aria-hidden />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
              </svg>
            )}
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || !value.trim() || speech.listening}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-adalat-green text-white transition hover:bg-adalat-green-light disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send question"
        >
          {disabled ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {isWelcome && (
        <p className="welcome-input-hint">
          Enter to send · Shift+Enter for new line
          {speech.isSupported && ' · Mic for English, Urdu, or Pashto'}
        </p>
      )}
    </form>
  )
}
