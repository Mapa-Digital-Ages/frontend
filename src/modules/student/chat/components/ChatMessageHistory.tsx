import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import { Box, Chip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import type { ChatSession } from '@/modules/student/chat/types/types'

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

interface ChatMessageHistoryProps {
  chat: ChatSession
}

function ChatMessageHistory({ chat }: ChatMessageHistoryProps) {
  const theme = useTheme()

  return (
    <Box
      className="flex flex-col rounded-2xl h-full"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'none',
        minHeight: 400,
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'background.border',
          px: 2.5,
          pt: 2.5,
          pb: 2,
        }}
      >
        <Box className="flex items-start justify-between gap-4">
          <Box className="min-w-0">
            <Typography
              sx={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3 }}
            >
              {chat.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.3, fontSize: '0.78rem' }}
            >
              Atividade de {chat.subject}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              mt: 0.3,
            }}
          >
            {formatRelativeDate(chat.lastMessageAt)}
          </Typography>
        </Box>

        {chat.suggestions.length > 0 && (
          <Box className="flex flex-wrap gap-1.5 mt-2">
            {chat.suggestions.map(suggestion => (
              <Chip
                key={suggestion}
                label={suggestion}
                size="small"
                sx={{
                  height: 26,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  backgroundColor:
                    'var(--app-role-current-soft, rgba(66,165,245,0.12))',
                  color: 'var(--app-role-current-primary)',
                  border: 'none',
                  borderRadius: '13px',
                  '&:hover': {
                    backgroundColor:
                      'var(--app-role-action-hover-bg, rgba(66,165,245,0.18))',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {chat.messages.length === 0 ? (
        <Box className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <Box className="grid size-14 place-items-center rounded-full bg-black/5 dark:bg-white/10">
            <ChatBubbleOutlineRoundedIcon color="action" />
          </Box>
          <Typography variant="h6">Nova conversa</Typography>
          <Typography color="text.secondary" className="max-w-sm">
            Esta conversa ainda não possui mensagens. Inicie uma nova interação
            com o assistente durante uma atividade.
          </Typography>
        </Box>
      ) : (
        <Box className="flex-1 overflow-y-auto px-5 py-4 grid gap-4 content-start">
          {chat.messages.map(message => {
            const isUser = message.role === 'user'

            return (
              <Box
                key={message.id}
                data-testid={`message-${message.id}`}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <Box
                  className="grid size-9 shrink-0 place-items-center rounded-full"
                  sx={{
                    backgroundColor: isUser
                      ? 'var(--app-role-current-primary)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.06)',
                  }}
                >
                  {isUser ? (
                    <PersonRoundedIcon
                      fontSize="small"
                      sx={{ color: 'var(--app-role-current-contrast)' }}
                    />
                  ) : (
                    <SmartToyRoundedIcon
                      fontSize="small"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  )}
                </Box>

                <Box
                  className="rounded-2xl px-4 py-3 max-w-[75%]"
                  sx={{
                    backgroundColor: isUser
                      ? 'var(--app-role-current-primary)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: isUser
                        ? 'var(--app-role-current-contrast)'
                        : theme.palette.text.primary,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}
                  >
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="mt-1 block text-right"
                    sx={{
                      color: isUser
                        ? 'rgba(255,255,255,0.7)'
                        : theme.palette.text.secondary,
                      fontSize: '0.65rem',
                    }}
                  >
                    {dayjs(message.timestamp).format('HH:mm')}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default ChatMessageHistory
