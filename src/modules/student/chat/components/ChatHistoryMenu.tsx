import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import {
  Box,
  Chip,
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
  onNewChat: () => void
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
  onNewChat,
}: ChatHistoryMenuProps) {
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      className="flex flex-col rounded-2xl"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'none',
        height: 'calc(100vh - 200px)',
      }}
    >
      <Box className="flex items-center justify-between px-5 pt-5 pb-2">
        <Box className="flex items-center gap-1.5">
          <AccessTimeRoundedIcon
            sx={{ fontSize: 18, color: theme.palette.text.primary }}
          />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
            Histórico
          </Typography>
        </Box>
        <Chip
          icon={<AddRoundedIcon sx={{ fontSize: '14px !important' }} />}
          label="Nova"
          size="small"
          onClick={onNewChat}
          data-testid="new-chat-button"
          sx={{
            height: 28,
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor:
              'var(--app-role-current-soft, rgba(66,165,245,0.12))',
            color: 'var(--app-role-current-primary)',
            border: 'none',
            cursor: 'pointer',
            '& .MuiChip-icon': {
              color: 'var(--app-role-current-primary)',
              marginLeft: '6px',
              marginRight: '-2px',
            },
            '&:hover': {
              backgroundColor: 'var(--app-role-action-hover-bg)',
            },
          }}
        />
      </Box>

      <Box className="px-4 pb-3">
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

      <List className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
        {filteredChats.map(chat => {
          const isSelected = chat.id === selectedChatId

          return (
            <ListItemButton
              key={chat.id}
              data-testid={`chat-item-${chat.id}`}
              selected={isSelected}
              onClick={() => onSelectChat(chat.id)}
              className="mb-1"
              sx={{
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'background.border',
                transition: 'all 0.2s ease',
                px: 2,
                py: 0.8,
                '&.Mui-selected': {
                  backgroundColor:
                    'var(--app-role-current-soft, rgba(66,165,245,0.10))',
                  borderColor: 'background.border',
                },
                '&.Mui-selected:hover': {
                  backgroundColor:
                    'var(--app-role-current-soft, rgba(66,165,245,0.10))',
                },
                '&:hover': {
                  backgroundColor:
                    'var(--app-role-current-soft, rgba(66,165,245,0.06))',
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
