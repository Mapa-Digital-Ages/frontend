export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  title: string
  subject: string
  createdAt: string
  lastMessageAt: string
  suggestions: string[]
  messages: ChatMessage[]
}
