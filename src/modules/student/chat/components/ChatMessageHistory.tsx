import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
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
  const isDarkMode = theme.palette.mode === 'dark'
  const suggestionChipBackgroundColor = isDarkMode
    ? 'var(--app-role-action-selected-bg)'
    : 'var(--app-role-current-soft, rgba(66,165,245,0.12))'
  const suggestionChipTextColor = isDarkMode
    ? theme.palette.primary.main
    : 'var(--app-role-current-primary)'

  return (
    <Box
      className="flex min-h-0 flex-col rounded-2xl"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'none',
        height: { xs: 'calc(100vh - 200px)', lg: '100%' },
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'background.border',
          flexShrink: 0,
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
                  backgroundColor: suggestionChipBackgroundColor,
                  color: suggestionChipTextColor,
                  border: '1px solid',
                  borderColor: isDarkMode
                    ? 'var(--app-role-action-selected-border)'
                    : 'transparent',
                  borderRadius: '13px',
                  '&:hover': {
                    backgroundColor: 'var(--app-role-action-hover-bg)',
                    borderColor: 'var(--app-role-action-hover-border)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box
        className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-5 py-4"
        data-testid="chat-message-scroll"
        sx={{ overscrollBehavior: 'contain' }}
      >
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
                    : isDarkMode
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
                    : isDarkMode
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
    </Box>
  )
}

export default ChatMessageHistory
