import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { AppTag } from '@/shared/ui/AppTags'
import { useUserRole } from '@/app/access/hook'
import { uploadApprovalService } from '@/modules/admin/content/services/upload/runtime'
import {
  getHoverStyle,
  getRoleAccentColor,
  getRolePalette,
} from '@/app/theme/core/roles'
import type { UploadApprovalItem } from '@/modules/admin/content/types/upload'

const correctionCardHeight = { md: 560, xs: 300 }

export default function Page() {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const { role, isAdmin } = useUserRole()
  const [upload, setUpload] = useState<UploadApprovalItem | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewExpiresAt, setPreviewExpiresAt] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreparingDownload, setIsPreparingDownload] = useState(false)
  const accent = getRolePalette(theme, role ?? 'admin')
  const accentColor = getRoleAccentColor(theme, role ?? 'admin')
  const accentHover = getHoverStyle(theme, accentColor)

  const refreshDownloadUrl = useCallback(async (uploadId: string) => {
    const data = await uploadApprovalService.getUploadDownloadUrl(uploadId)
    setPreviewUrl(data.url)
    setPreviewExpiresAt(Date.now() + data.expiresIn * 1000)
    return data
  }, [])

  useEffect(() => {
    let isActive = true

    async function load() {
      if (!contentId || !isAdmin) {
        setIsLoading(false)
        return
      }

      try {
        const data = await uploadApprovalService.getUpload(contentId)
        if (!isActive) return
        setUpload(data)
        setError(null)
        await refreshDownloadUrl(contentId)
      } catch {
        if (!isActive) return
        setError('Não foi possível carregar a correção desta atividade.')
        setUpload(null)
        setPreviewUrl(null)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void load()
    return () => {
      isActive = false
    }
  }, [contentId, isAdmin, refreshDownloadUrl])

  const handleDownload = useCallback(async () => {
    if (!upload) return
    setIsPreparingDownload(true)
    try {
      const fresh =
        Date.now() < previewExpiresAt - 5_000 && previewUrl
          ? { url: previewUrl, fileName: upload.fileName }
          : await refreshDownloadUrl(upload.id)
      const link = document.createElement('a')
      link.href = fresh.url
      link.download = upload.fileName
      link.target = '_blank'
      link.rel = 'noopener'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setIsPreparingDownload(false)
    }
  }, [upload, previewExpiresAt, previewUrl, refreshDownloadUrl])

  if (!role || !isAdmin || isLoading) {
    return <LoadingScreen />
  }

  if (error || !upload) {
    return (
      <AppPageContainer>
        <EmptyState
          description={error ?? 'A atividade solicitada não foi encontrada.'}
          title="Correção indisponível"
        />
      </AppPageContainer>
    )
  }

  const subjectTag = upload.subject
    ? {
        id: upload.subject.id,
        label: upload.subject.name,
        color: upload.subject.color ?? undefined,
      }
    : null

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Box
        sx={{
          alignItems: { sm: 'center', xs: 'flex-start' },
          display: 'flex',
          flexDirection: { sm: 'row', xs: 'column' },
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: { sm: 'center', xs: 'flex-start' },
            flexDirection: { sm: 'row', xs: 'column' },
            gap: 2,
            minWidth: 0,
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            size="large"
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: 'var(--app-radius-control)',
              color: 'text.primary',
              flexShrink: 0,
              gap: 1,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: accentHover.backgroundColor,
                borderColor: accentHover.borderColor,
                color: accentColor,
              },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 20 }} />
            Voltar
          </Button>
          <Box sx={{ display: 'grid', gap: 0.75, minWidth: 0 }}>
            {subjectTag ? (
              <Box>
                <AppTag size="sm" tag={subjectTag} />
              </Box>
            ) : null}
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { md: 28, xs: 22 },
                fontWeight: 800,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={upload.fileName}
            >
              {upload.fileName}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
              Enviado por {upload.studentName} · {upload.uploadedAt}
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={handleDownload}
          disabled={isPreparingDownload}
          size="large"
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'background.border',
            borderRadius: 'var(--app-radius-control)',
            color: 'text.primary',
            flexShrink: 0,
            gap: 1,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: accentHover.backgroundColor,
              borderColor: accentHover.borderColor,
              color: accentColor,
            },
          }}
        >
          <ArrowCircleDownOutlinedIcon sx={{ fontSize: 20 }} />
          {isPreparingDownload ? 'Preparando...' : 'Baixar'}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: { md: 'nowrap', xs: 'wrap' },
          gap: 3,
          height: correctionCardHeight,
          width: '100%',
        }}
      >
        <AppCard
          sx={{
            width: '100%',
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
            {previewUrl && upload.fileType?.startsWith('image/') ? (
              <Box
                alt={`Upload ${upload.fileName}`}
                component="img"
                src={previewUrl}
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
                  {upload.fileName}
                </Typography>
                <Typography sx={{ color: 'text.secondary', maxWidth: 380 }}>
                  Use o botão "Baixar" para abrir o arquivo. O link é assinado e
                  expira em alguns minutos.
                </Typography>
              </Box>
            )}
          </Box>
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}
