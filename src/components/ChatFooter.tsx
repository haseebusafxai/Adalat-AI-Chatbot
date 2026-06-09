import { ChatInput } from './ChatInput'

interface ChatFooterProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function ChatFooter({
  input,
  onInputChange,
  onSubmit,
  disabled,
}: ChatFooterProps) {
  return (
    <div className="chat-footer-inner">
      <ChatInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSubmit}
        disabled={disabled}
        variant="chat"
        placeholder="Ask about bail, FIR, arrest rights, or the Constitution…"
      />
      <p className="chat-footer-disclaimer">
        Adalat AI provides general legal information only — not formal legal advice.
        Consult a licensed advocate for your case. Chats are saved locally on this device.
        Use the mic to dictate in English, Urdu, or Pashto.
      </p>
    </div>
  )
}
