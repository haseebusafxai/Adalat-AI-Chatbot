export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  suggestedQuestions?: string[]
  createdAt: number
}

export interface ChatRequest {
  chatInput: string
  sessionId: string
}

export interface SavedChat {
  id: string
  title: string
  messages: ChatMessage[]
  sessionId: string
  createdAt: number
  updatedAt: number
}
