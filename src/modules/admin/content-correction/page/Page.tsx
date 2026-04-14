import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import { AppTag } from '@/shared/ui/AppTags'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { useUserRole } from '@/app/access/hook'
import { contentApprovalService } from '@/modules/admin/content/services/runtime'
import { getRolePalette } from '@/app/theme/core/roles'
import type { ContentCorrectionSession } from '@/modules/admin/shared/types/types'

export default function Page() {
  const { contentId } = useParams()
  const theme = useTheme()
  const { role, isAdmin } = useUserRole()
  const [session, setSession] = useState<ContentCorrectionSession | null>(null)
  const [draftMessage, setDraftMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const accent = getRolePalette(theme, role ?? 'admin')
  const quickActions = [
    'Pedir mais detalhes',
    'Explicar com exemplo',
    'Reenvio',
  ]
  const correctionCardHeight = { md: 560, xs: 520 }

  useEffect(() => {
    let isActive = true

    async function loadCorrectionSession() {
      if (!contentId || !isAdmin) {
        setIsLoading(false)
        return
      }

      try {
        const currentSession =
          await contentApprovalService.getContentCorrectionSession(contentId)
        const activeSession =
          currentSession.status === 'inProgress'
            ? currentSession
            : await contentApprovalService.markContentCorrectionInProgress(
                contentId
              )

        if (!isActive) {
          return
        }

        setError(null)
        setSession(activeSession)
      } catch {
        if (!isActive) {
          return
        }

        setError('Não foi possível carregar a correção desta atividade.')
        setSession(null)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadCorrectionSession()

    return () => {
      isActive = false
    }
  }, [contentId, isAdmin])

  const handleSendMessage = useCallback(async () => {
    if (!contentId || !draftMessage.trim()) {
      return
    }

    setIsSending(true)

    try {
      const nextSession =
        await contentApprovalService.sendContentCorrectionMessage(contentId, {
          body: draftMessage,
        })

      setSession(nextSession)
      setDraftMessage('')
    } finally {
      setIsSending(false)
    }
  }, [contentId, draftMessage])

  if (!role || !isAdmin || isLoading) {
    return <LoadingScreen />
  }

  if (error || !session) {
    return (
      <AppPageContainer>
        <EmptyState
          description={error ?? 'A atividade solicitada não foi encontrada.'}
          title="Correção indisponível"
        />
      </AppPageContainer>
    )
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Box className="flex flex-col gap-3">
        <Box className="grid gap-2">
          {session.subject ? (
            <Box>
              <AppTag size="sm" tag={session.subject} />
            </Box>
          ) : null}
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 28, xs: 22 },
              fontWeight: 800,
            }}
          >
            {session.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
            {session.subtitle ?? 'Correção de upload enviado pelo aluno.'}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { lg: '1.2fr 0.95fr', xs: '1fr' },
        }}
      >
        <AppCard
          sx={{
            height: correctionCardHeight,
            overflow: 'hidden',
          }}
          contentSx={{
            display: 'flex',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: alpha(
                accent.primary,
                theme.palette.mode === 'dark' ? 0.16 : 0.06
              ),
              border: '1px solid',
              borderColor: alpha(accent.primary, 0.22),
              borderRadius: '24px',
              display: 'flex',
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              minHeight: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {session.uploadPreviewUrl ? (
              <Box
                alt={`Upload ${session.title}`}
                component="img"
                src={session.uploadPreviewUrl}
                sx={{
                  height: '100%',
                  objectFit: 'contain',
                  width: '100%',
                }}
              />
            ) : (
              <Box className="grid justify-items-center gap-3 px-6 text-center">
                <Box
                  sx={{
                    alignItems: 'center',
                    backgroundColor: alpha(accent.primary, 0.12),
                    borderRadius: '999px',
                    color: accent.primary,
                    display: 'flex',
                    height: 72,
                    justifyContent: 'center',
                    width: 72,
                  }}
                >
                  <ImageOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography sx={{ color: 'text.primary', fontWeight: 800 }}>
                  Prévia do upload
                </Typography>
                <Typography sx={{ color: 'text.secondary', maxWidth: 380 }}>
                  Aqui será renderizada a imagem ou documento enviado pelo aluno
                  quando o backend disponibilizar a URL do arquivo.
                </Typography>
              </Box>
            )}
          </Box>
        </AppCard>

        <AppCard
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'background.border',
            borderRadius: '24px',
            height: correctionCardHeight,
            overflow: 'hidden',
          }}
          contentSx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            p: 0,
            '&:last-child': { pb: 0 },
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.05)
                  : 'rgba(246, 248, 251, 1)',
              borderBottom: '1px solid',
              borderColor: 'background.border',
              display: 'grid',
              gap: 0.5,
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              px: { md: 2, xs: 1.5 },
              py: 1.5,
            }}
          >
            <Box className="min-w-0">
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { md: 15, xs: 14 },
                  fontWeight: 800,
                }}
              >
                Correção em andamento
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { md: 13, xs: 12 },
                }}
              >
                Chat de orientação com o aluno
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              flexShrink: 0,
              gap: 1,
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              px: { md: 2, xs: 1.5 },
              py: 1,
            }}
          >
            {quickActions.map(action => (
              <Box
                component="button"
                key={action}
                onClick={() => setDraftMessage(action)}
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: alpha(accent.primary, 0.24),
                  borderRadius: '999px',
                  color: accent.primary,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  fontSize: { md: 12, xs: 11 },
                  fontWeight: 700,
                  gap: 0.75,
                  justifyContent: 'center',
                  minWidth: 0,
                  px: 1.5,
                  py: 0.75,
                  transition: '160ms ease',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: alpha(accent.primary, 0.08),
                    borderColor: alpha(accent.primary, 0.38),
                  },
                }}
                type="button"
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />
                <Box
                  component="span"
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {action}
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              gap: 2,
              minHeight: 0,
              overscrollBehavior: 'contain',
              overflowY: 'auto',
              px: { md: 2, xs: 1.5 },
              py: 0.5,
            }}
          >
            {session.messages.map(message => {
              const fromAdmin = message.author === 'admin'

              return (
                <Box
                  key={message.id}
                  sx={{
                    alignSelf: 'stretch',
                    display: 'grid',
                    gap: 0.5,
                    justifyItems: fromAdmin ? 'end' : 'start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: fromAdmin ? 'row-reverse' : 'row',
                      gap: 1,
                      maxWidth: 'min(92%, 480px)',
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        alignItems: 'center',
                        alignSelf: 'end',
                        backgroundColor: fromAdmin
                          ? alpha(accent.primary, 0.14)
                          : alpha(theme.palette.info.main, 0.1),
                        borderRadius: '999px',
                        color: fromAdmin
                          ? accent.primary
                          : theme.palette.info.main,
                        display: 'flex',
                        flexShrink: 0,
                        height: 32,
                        justifyContent: 'center',
                        mb: 0.15,
                        width: 32,
                      }}
                    >
                      <SmartToyOutlinedIcon sx={{ fontSize: 17 }} />
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: fromAdmin
                          ? accent.primary
                          : theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.08)
                            : 'rgba(236, 239, 244, 1)',
                        border: '1px solid',
                        borderColor: fromAdmin
                          ? accent.primary
                          : 'background.border',
                        borderRadius: fromAdmin
                          ? '18px 18px 4px 18px'
                          : '18px 18px 18px 4px',
                        color: fromAdmin ? accent.contrast : 'text.primary',
                        minWidth: 0,
                        px: { md: 2, xs: 1.5 },
                        py: 1.35,
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'inherit',
                          fontSize: { md: 14, xs: 13 },
                          fontWeight: 600,
                          lineHeight: 1.45,
                        }}
                      >
                        {message.body}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 11,
                      px: 0.75,
                      [fromAdmin ? 'mr' : 'ml']: 5,
                    }}
                  >
                    {fromAdmin ? 'Admin' : 'Aluno'} · {message.createdAt}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          <Box
            className="flex flex-row gap-2"
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.04)
                  : 'rgba(249, 250, 252, 1)',
              borderTop: '1px solid',
              borderColor: 'background.border',
              flexShrink: 0,
              px: { md: 2, xs: 1.5 },
              py: 1.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              <AppInput
                onChange={event => setDraftMessage(event.target.value)}
                placeholder="Escreva uma orientação para o aluno..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '18px',
                    minHeight: { md: 48, xs: 44 },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { md: 14, xs: 13 },
                  },
                }}
                value={draftMessage}
              />
            </Box>
            <IconButton
              disabled={!draftMessage.trim() || isSending}
              sx={{
                backgroundColor: alpha(accent.primary, 0.08),
                borderRadius: 'var(--app-radius-control)',
                border: '1px solid',
                color: accent.primary,
                flexShrink: 0,
                height: { md: 48, xs: 44 },
                width: { md: 48, xs: 44 },
                '&:hover': {
                  backgroundColor: alpha(accent.primary, 0.16),
                },
                '&:disabled': {
                  color: alpha(accent.primary, 0.54),
                  backgroundColor: alpha(accent.primary, 0.12),
                },
              }}
              onClick={() => {
                void handleSendMessage()
              }}
              aria-label="Enviar mensagem"
              size="small"
            >
              <SendRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}
