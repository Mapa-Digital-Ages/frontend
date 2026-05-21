import { httpClient } from '@/shared/lib/http/client'
import type { ChatSession } from '@/modules/student/chat/types/types'

export const chatService = {
  async getChats(): Promise<ChatSession[]> {
    const response = await httpClient.get<ChatSession[]>('student/chats')
    return response.data
  },

  async getChatById(chatId: string): Promise<ChatSession> {
    const response = await httpClient.get<ChatSession>(
      `student/chats/${encodeURIComponent(chatId)}`
    )
    return response.data
  },
}
