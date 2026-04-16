import CloseIcon from '@mui/icons-material/Close'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState, type ReactNode } from 'react'

type EmotionButtonColor = 'error' | 'success' | 'warning'

interface EmotionButtonProps {
  color: EmotionButtonColor
  icon: ReactNode
  label: string
  onClick: () => void
  testId: string
}

function EmotionButton({
  color,
  icon,
  label,
  onClick,
  testId,
}: EmotionButtonProps) {
  const theme = useTheme()
  const mainColor = theme.palette[color].main
  const hoverBackgroundColor = alpha(
    mainColor,
    theme.palette.mode === 'dark' ? 0.14 : 0.08
  )
  const hoverBorderColor = alpha(
    mainColor,
    theme.palette.mode === 'dark' ? 0.46 : 0.32
  )

  return (
    <Box
      component="button"
      data-testid={testId}
      onClick={onClick}
      sx={{
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: mainColor,
        borderRadius: 'var(--app-radius-control)',
        color: mainColor,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: 92,
        justifyContent: 'center',
        transition:
          'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
        width: { sm: 164, xs: '100%' },
        '&:hover': {
          backgroundColor: hoverBackgroundColor,
          borderColor: hoverBorderColor,
          transform: 'translateY(-1px)',
        },
      }}
    >
      {icon}
      <Typography fontWeight={700}>{label}</Typography>
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

  return (
    <Box
      data-testid="card-checkin-emocional"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'none',
        maxWidth: 556,
        p: 3,
        width: '100%',
      }}
    >
      <Typography
        sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}
        variant="h6"
      >
        Check-in emocional
      </Typography>

      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2} sx={{ mb: 4 }}>
        <EmotionButton
          color="success"
          icon={<SentimentSatisfiedAltIcon sx={{ fontSize: 28 }} />}
          label="Bem"
          onClick={() => handleEmotionSelect('Bem')}
          testId="emotion-button-good"
        />
        <EmotionButton
          color="warning"
          icon={<SentimentNeutralIcon sx={{ fontSize: 28 }} />}
          label="Regular"
          onClick={() => handleEmotionSelect('Regular')}
          testId="emotion-button-regular"
        />
        <EmotionButton
          color="error"
          icon={<SentimentVeryDissatisfiedIcon sx={{ fontSize: 28 }} />}
          label="Mal"
          onClick={() => handleEmotionSelect('Mal')}
          testId="emotion-button-bad"
        />
      </Stack>

      <Typography sx={{ color: 'text.primary', fontWeight: 700 }} variant="h6">
        Humor da Semana
      </Typography>
      <Dialog
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        PaperProps={{
          sx: { borderRadius: 'var(--app-radius-card)', p: 2 },
        }}
      >
        <DialogTitle
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Typography fontWeight={700}>Confirmação</Typography>
          <IconButton onClick={() => setModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Você registrou seu humor hoje como: {selectedEmotion}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
