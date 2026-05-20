import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import dayjs from 'dayjs'
import AppInput from '@/shared/ui/AppInput'
import type { ChatSession } from '@/modules/student/chat/types/types'

interface ChatHistoryMenuProps {
  chats: ChatSession[]
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
}

function formatRelativeDate(dateString: string) {
  const date = dayjs(dateString)
  const now = dayjs()
  const time = date.format('HH:mm')

  if (date.isSame(now, 'day')) {
    return `Hoje · ${time}`
  }

  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `Ontem · ${time}`
  }

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  if (date.isAfter(now.subtract(7, 'day'))) {
    return `${weekdays[date.day()]} · ${time}`
  }

  return date.format('DD/MM/YYYY · HH:mm')
}

function ChatHistoryMenu({
  chats,
  selectedChatId,
  onSelectChat,
}: ChatHistoryMenuProps) {
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      className="flex flex-col gap-4 rounded-2xl"
      sx={{
        p: '15px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'none',
        height: { xs: 'calc(100vh - 200px)', lg: '100%' },
        minHeight: 0,
      }}
    >
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-1.5">
          <AccessTimeRoundedIcon
            sx={{ fontSize: 18, color: theme.palette.text.primary }}
          />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
            Histórico
          </Typography>
        </Box>
      </Box>

      <Box>
        <AppInput
          type="search"
          placeholder="Buscar conversa"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          inputSize="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              height: 38,
              minHeight: 38,
              backgroundColor: 'background.default',
            },
          }}
        />
      </Box>

      <List className="min-h-0 flex-1 overflow-y-auto p-0 m-0">
        {filteredChats.map(chat => {
          const isSelected = chat.id === selectedChatId

          return (
            <ListItemButton
              key={chat.id}
              data-testid={`chat-item-${chat.id}`}
              selected={isSelected}
              onClick={() => onSelectChat(chat.id)}
              sx={{
                mb: '8px',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'background.border',
                transition: 'all 0.2s ease',
                px: 2,
                py: 0.8,
                '&.Mui-selected': {
                  backgroundColor: 'var(--app-role-action-selected-bg)',
                  borderColor: 'var(--app-role-action-selected-border)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'var(--app-role-action-selected-bg)',
                  borderColor: 'var(--app-role-action-selected-border)',
                },
                '&:hover': {
                  backgroundColor: 'var(--app-role-action-hover-bg)',
                  borderColor: 'var(--app-role-action-hover-border)',
                },
              }}
            >
              <ListItemText
                primary={chat.title}
                secondary={
                  <>
                    {`Atividade de ${chat.subject}`}
                    <br />
                    {formatRelativeDate(chat.lastMessageAt)}
                  </>
                }
                slotProps={{
                  primary: {
                    noWrap: true,
                    sx: {
                      fontWeight: isSelected ? 600 : 500,
                      color: theme.palette.text.primary,
                      fontSize: '0.82rem',
                    },
                  },
                  secondary: {
                    sx: {
                      fontSize: '0.7rem',
                      color: theme.palette.text.secondary,
                      lineHeight: 1.4,
                      mt: 0.2,
                    },
                  },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

export default ChatHistoryMenu
