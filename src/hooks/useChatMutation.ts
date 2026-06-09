import { useMutation } from '@tanstack/react-query'
import { sendChatMessage } from '../api/chatApi'
import type { ChatMessage } from '../types/chat'

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface UseChatMutationOptions {
  onUserMessage: (message: ChatMessage) => void
  onAssistantMessage: (message: ChatMessage) => void
  onError: (error: Error, userMessageId: string) => void
}

export function useChatMutation({
  onUserMessage,
  onAssistantMessage,
  onError,
}: UseChatMutationOptions) {
  return useMutation({
    mutationFn: sendChatMessage,
    onMutate: async (chatInput) => {
      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content: chatInput,
        createdAt: Date.now(),
      }
      onUserMessage(userMessage)
      return { userMessageId: userMessage.id }
    },
    onSuccess: (result) => {
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: result.content,
        suggestedQuestions: result.suggestedQuestions,
        createdAt: Date.now(),
      }
      onAssistantMessage(assistantMessage)
    },
    onError: (error, _input, context) => {
      if (context?.userMessageId) {
        onError(
          error instanceof Error ? error : new Error('Something went wrong.'),
          context.userMessageId,
        )
      }
    },
  })
}
