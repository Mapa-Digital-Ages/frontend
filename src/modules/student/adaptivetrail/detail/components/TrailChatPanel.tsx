import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import type { TagTheme } from '@/shared/utils/themes'
import type { ChatMessage } from '@/modules/student/chat/types/types'
import dayjs from 'dayjs'

const MOCK_RESPONSES = [
  'Boa pergunta! Vou te ajudar a entender melhor esse conceito.',
  'Claro! Esse é um ponto importante da trilha. Pense desta forma...',
  'Exatamente! Você está no caminho certo. Quer que eu explique mais um pouco?',
  'Ótima dúvida! Muitos alunos têm dificuldade com isso. Vamos destrinchar juntos.',
]

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function mockReply(): ChatMessage {
  return {
    id: nextId(),
    role: 'assistant',
    content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
    timestamp: new Date().toISOString(),
  }
}

interface TrailChatPanelProps {
  subjectTheme: TagTheme
  subjectLabel: string
}

export default function TrailChatPanel({
  subjectTheme,
  subjectLabel,
}: TrailChatPanelProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function handleSend() {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, mockReply()])
    }, 1200)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const accentColor = subjectTheme.color

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: alpha(accentColor, isDark ? 0.35 : 0.22),
        borderRadius: 'var(--app-radius-card)',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: isDark
            ? alpha(accentColor, 0.18)
            : alpha(accentColor, 0.08),
          borderBottom: '1px solid',
          borderColor: alpha(accentColor, isDark ? 0.3 : 0.18),
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SmartToyRoundedIcon sx={{ fontSize: 17, color: '#fff' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: accentColor,
              lineHeight: 1.2,
            }}
          >
            Chat da trilha
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.1 }}>
            {subjectLabel}
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overscrollBehavior: 'contain',
        }}
      >
        {messages.length === 0 && !isTyping && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1.5,
              py: 6,
              opacity: 0.7,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '16px',
                backgroundColor: subjectTheme.badge.backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SmartToyRoundedIcon sx={{ color: accentColor, fontSize: 24 }} />
            </Box>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}
            >
              Nova sessão de chat
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: 'text.secondary', maxWidth: 220 }}
            >
              Tire dúvidas sobre a trilha de {subjectLabel} com o assistente.
            </Typography>
          </Box>
        )}

        {messages.map(msg => {
          const isUser = msg.role === 'user'
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                gap: 1.25,
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isUser
                    ? accentColor
                    : isDark
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.06)',
                }}
              >
                {isUser ? (
                  <PersonRoundedIcon sx={{ fontSize: 15, color: '#fff' }} />
                ) : (
                  <SmartToyRoundedIcon
                    sx={{ fontSize: 15, color: 'text.secondary' }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  maxWidth: '78%',
                  px: 2,
                  py: 1.25,
                  borderRadius: isUser
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  backgroundColor: isUser
                    ? accentColor
                    : isDark
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.04)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: isUser ? '#fff' : 'text.primary',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    mt: 0.5,
                    color: isUser ? 'rgba(255,255,255,0.6)' : 'text.disabled',
                    textAlign: 'right',
                  }}
                >
                  {dayjs(msg.timestamp).format('HH:mm')}
                </Typography>
              </Box>
            </Box>
          )
        })}

        {isTyping && (
          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-end' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              }}
            >
              <SmartToyRoundedIcon
                sx={{ fontSize: 15, color: 'text.secondary' }}
              />
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: '16px 16px 16px 4px',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <CircularProgress size={12} sx={{ color: accentColor }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                digitando…
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'background.border',
          flexShrink: 0,
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(0,0,0,0.01)',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Pergunte sobre esta trilha…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  size="small"
                  sx={{
                    color: input.trim() ? accentColor : 'text.disabled',
                    transition: 'color 0.15s',
                  }}
                >
                  <SendRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px',
              fontSize: 13,
              backgroundColor: 'background.paper',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'background.border',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: accentColor,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(accentColor, 0.5),
            },
          }}
        />
      </Box>
    </Box>
  )
}
