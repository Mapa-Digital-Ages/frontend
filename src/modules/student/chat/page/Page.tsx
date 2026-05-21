import { Box } from '@mui/material'
import { useState } from 'react'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import ChatEmptyState from '@/modules/student/chat/components/ChatEmptyState'
import ChatHistoryMenu from '@/modules/student/chat/components/ChatHistoryMenu'
import ChatMessageHistory from '@/modules/student/chat/components/ChatMessageHistory'
import ChatSelectPrompt from '@/modules/student/chat/components/ChatSelectPrompt'
import type { ChatSession } from '@/modules/student/chat/types/types'

const INITIAL_CHATS: ChatSession[] = [
  {
    id: '1',
    title: 'Equações do 1º grau',
    subject: 'Matemática',
    createdAt: '2026-05-18T09:30:00',
    lastMessageAt: '2026-05-18T09:30:00',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Como resolvo uma equação do primeiro grau?',
        timestamp: '2026-05-18T09:30:00',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Para resolver uma equação do primeiro grau (ax + b = 0), basta isolar o x:\n\n1. Passe o termo b para o outro lado: ax = -b\n2. Divida ambos os lados por a: x = -b/a\n\nPor exemplo, em 2x + 6 = 0:\n• 2x = -6\n• x = -3',
        timestamp: '2026-05-18T09:31:00',
      },
    ],
  },
  {
    id: '2',
    title: 'Estrutura de redação',
    subject: 'Português',
    createdAt: '2026-05-17T20:12:00',
    lastMessageAt: '2026-05-17T20:12:00',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'Qual a estrutura de uma redação dissertativa-argumentativa?',
        timestamp: '2026-05-17T20:12:00',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'A redação dissertativa-argumentativa segue a estrutura:\n\n1. Introdução — apresente o tema e sua tese\n2. Desenvolvimento (2 parágrafos) — argumente com dados e exemplos\n3. Conclusão — retome a tese e proponha uma intervenção\n\nLembre-se de manter a coesão entre os parágrafos usando conectivos.',
        timestamp: '2026-05-17T20:14:00',
      },
    ],
  },
  {
    id: '3',
    title: 'Plano de estudos da semana',
    subject: 'Planejamento semanal',
    createdAt: '2026-05-12T18:40:00',
    lastMessageAt: '2026-05-12T18:40:00',
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: 'Me ajude a montar um plano de estudos para esta semana.',
        timestamp: '2026-05-12T18:40:00',
      },
      {
        id: 'm6',
        role: 'assistant',
        content:
          'Vamos montar seu plano! Com base nas suas matérias, sugiro:\n\n• Segunda — Matemática (2h) + Português (1h)\n• Terça — Ciências (2h) + História (1h)\n• Quarta — Revisão geral + exercícios\n• Quinta — Geografia (2h) + Inglês (1h)\n• Sexta — Simulado e correção\n\nLembre de fazer pausas de 10 min a cada 50 min de estudo.',
        timestamp: '2026-05-12T18:42:00',
      },
      {
        id: 'm7',
        role: 'user',
        content: 'Posso trocar terça por biologia?',
        timestamp: '2026-05-12T18:45:00',
      },
      {
        id: 'm8',
        role: 'assistant',
        content:
          'Claro! Podemos ajustar a terça para:\n\n• Terça — Biologia (2h) + História (1h)\n\nE mover Ciências para a quarta junto com a revisão. Assim você mantém o equilíbrio entre as matérias.',
        timestamp: '2026-05-12T18:46:00',
      },
    ],
  },
]

export default function Page() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [chats] = useState<ChatSession[]>(INITIAL_CHATS)

  const selectedChat = chats.find(chat => chat.id === selectedChatId) ?? null

  if (chats.length === 0) {
    return (
      <AppPageContainer className="gap-4">
        <OrdinaryHeader
          title="Chat Inteligente"
          subtitle="Tire dúvidas e acompanhe o histórico das conversas criadas durante as atividades."
        />
        <ChatEmptyState />
      </AppPageContainer>
    )
  }

  return (
    <AppPageContainer className="gap-4">
      <OrdinaryHeader
        title="Chat Inteligente"
        subtitle="Tire dúvidas e acompanhe o histórico das conversas criadas durante as atividades."
      />
      <Box
        className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-[370px_minmax(0,1fr)] lg:items-stretch"
        sx={{
          height: { lg: 'calc(100vh - 200px)' },
        }}
      >
        <ChatHistoryMenu
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        {selectedChat ? (
          <ChatMessageHistory chat={selectedChat} />
        ) : (
          <ChatSelectPrompt />
        )}
      </Box>
    </AppPageContainer>
  )
}
