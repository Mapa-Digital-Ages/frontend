import { useEffect, useRef } from 'react'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import { formatRelativeDate } from '@/shared/utils/date'
import type { ChatSession } from '@/modules/student/chat/types/types'

interface ChatMessageHistoryProps {
  chat: ChatSession
}

function ChatMessageHistory({ chat }: ChatMessageHistoryProps) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chat.messages])

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
      </Box>

      <Box
        ref={scrollRef}
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
