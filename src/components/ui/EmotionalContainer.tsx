import {
  Box,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import CloseIcon from '@mui/icons-material/Close'
import { useState, type ReactNode } from 'react'

type EmotionButtonColor = 'success' | 'warning' | 'error'

interface EmotionButtonProps {
  icon: ReactNode
  label: string
  color: EmotionButtonColor
  onClick: () => void
  testId: string
  width?: string
  height?: string
}

function EmotionButton({
  icon,
  label,
  color,
  onClick,
  testId,
  width,
  height,
}: EmotionButtonProps) {
  const hoverBackgrounds: Record<EmotionButtonColor, string> = {
    success: 'rgba(184, 246, 181, 0.8)',
    warning: 'rgba(244, 253, 177, 0.8)',
    error: 'rgba(253, 194, 200, 0.8)',
  }

  return (
    <Box
      component="button"
      onClick={onClick}
      data-testid={testId}
      sx={{
        justifyContent: 'center',
        width: width || '163.33px',
        height: height || '92px',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: `${color}.main`,
        backgroundColor: 'transparent',
        color: `${color}.main`,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: hoverBackgrounds[color],
          opacity: 0.9,
        },
      }}
    >
      {icon}
      <Typography fontWeight="bold">{label}</Typography>
    </Box>
  )
}

export default function EmotionalContainer() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState('')

  function handleEmotionSelect(emotionLabel: string) {
    setSelectedEmotion(emotionLabel)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
  }
  return (
    <Box
      data-testid="card-checkin-emocional"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'none',
        p: 3,
        width: '100%',
        maxWidth: '556px',
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}
      >
        Check-in emocional
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <EmotionButton
          testId="emotion-button-good"
          label="Bem"
          color="success"
          icon={<SentimentSatisfiedAltIcon sx={{ fontSize: 28 }} />}
          onClick={() => handleEmotionSelect('Bem')}
        />

        <EmotionButton
          testId="emotion-button-regular"
          label="Regular"
          color="warning"
          icon={<SentimentNeutralIcon sx={{ fontSize: 28 }} />}
          onClick={() => handleEmotionSelect('Regular')}
        />

        <EmotionButton
          testId="emotion-button-bad"
          label="Mal"
          color="error"
          icon={<SentimentVeryDissatisfiedIcon sx={{ fontSize: 28 }} />}
          onClick={() => handleEmotionSelect('Mal')}
        />
      </Stack>

      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', color: 'text.primary' }}
      >
        Humor da Semana
      </Typography>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        PaperProps={{
          sx: { borderRadius: '16px', padding: '16px' },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography fontWeight="bold">Confirmação</Typography>
          <IconButton onClick={handleModalClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography>
            Você registrou seu humor hoje como: {selectedEmotion}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
