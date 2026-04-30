import {
  Box,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import CloseIcon from '@mui/icons-material/Close'
import { useState, type ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')
dayjs.extend(isoWeek)

type EmotionButtonColor = 'success' | 'warning' | 'error'
interface EmotionButtonProps {
  icon: ReactNode
  label: string
  color: EmotionButtonColor
  onClick: () => void
  testId: string
  value: string
  width?: string
  height?: string
}

function EmotionButton({
  icon,
  label,
  color,
  onClick,
  testId,
  value,
  width,
  height,
}: EmotionButtonProps) {
  const theme = useTheme()
  const hoverBackgrounds: Record<EmotionButtonColor, string> = {
    success:
      theme.palette.mode === 'dark'
        ? alpha('rgba(184, 246, 181, 1)', 0.4)
        : alpha('rgba(184, 246, 181, 1)', 0.8),
    warning:
      theme.palette.mode === 'dark'
        ? alpha('rgba(244, 253, 177, 1)', 0.4)
        : alpha('rgba(244, 253, 177, 1)', 0.8),
    error:
      theme.palette.mode === 'dark'
        ? alpha('rgba(253, 194, 200, 1)', 0.4)
        : alpha('rgba(253, 194, 200, 1)', 0.8),
  }

  return (
    <ToggleButton
      data-testid={testId}
      onClick={onClick}
      value={value}
      sx={{
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: `${color}.main`,
        borderRadius: '12px !important',
        color: `${color}.main`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: height || '92px',
        justifyContent: 'center',
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        width: width || '163.33px',
        '&:hover': {
          backgroundColor: hoverBackgrounds[color],
          opacity: 0.9,
        },
        '&.Mui-selected': {
          backgroundColor: hoverBackgrounds[color],
          color: `${color}.main`,
        },
        '&.Mui-selected:hover': {
          backgroundColor: hoverBackgrounds[color],
        },
      }}
    >
      {icon}
      <Typography fontWeight="bold">{label}</Typography>
    </ToggleButton>
  )
}

export default function EmotionalContainer() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const startOfWeek = dayjs().startOf('isoWeek')
  const initialWeek = Array.from({ length: 7 }).map((_, index) => {
    const date = startOfWeek.add(index, 'day')
    return { date, mood: null as string | null }
  })
  const [weeklyMood, setWeeklyMood] = useState(initialWeek)

  function handleEmotionSelect(emotionLabel: string) {
    const moodMap: Record<string, string> = {
      Bem: 'good',
      Regular: 'regular',
      Mal: 'bad',
    }

    const today = dayjs().format('YYYY-MM-DD')

    setWeeklyMood(prev =>
      prev.map(day =>
        day.date.format('YYYY-MM-DD') === today
          ? { ...day, mood: moodMap[emotionLabel] }
          : day
      )
    )

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

      <ToggleButtonGroup
        exclusive
        value={selectedEmotion}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
          '& .MuiToggleButtonGroup-grouped': {
            border: '1px solid',
            margin: 0,
          },
        }}
      >
        <EmotionButton
          testId="emotion-button-good"
          label="Bem"
          color="success"
          icon={<SentimentVerySatisfiedIcon sx={{ fontSize: 28 }} />}
          onClick={() => handleEmotionSelect('Bem')}
          value="Bem"
        />
        <EmotionButton
          testId="emotion-button-regular"
          label="Regular"
          color="warning"
          icon={<SentimentNeutralIcon sx={{ fontSize: 28 }} />}
          onClick={() => handleEmotionSelect('Regular')}
          value="Regular"
        />
        <EmotionButton
          testId="emotion-button-bad"
          label="Mal"
          color="error"
          icon={<SentimentVeryDissatisfiedIcon sx={{ fontSize: 28 }} />}
          onClick={() => handleEmotionSelect('Mal')}
          value="Mal"
        />
      </ToggleButtonGroup>

      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', color: 'text.primary' }}
      >
        Humor da Semana
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 2, flexWrap: 'wrap' }}
      >
        {weeklyMood.map(({ date, mood }) => {
          let icon = null
          let color = 'text.secondary'

          if (mood === 'good') {
            icon = <SentimentVerySatisfiedIcon sx={{ fontSize: 24 }} />
            color = 'success.main'
          } else if (mood === 'regular') {
            icon = <SentimentSatisfiedIcon sx={{ fontSize: 24 }} />
            color = 'warning.main'
          } else if (mood === 'bad') {
            icon = <SentimentVeryDissatisfiedIcon sx={{ fontSize: 24 }} />
            color = 'error.main'
          }

          const label =
            date.format('ddd').charAt(0).toUpperCase() +
            date.format('ddd').slice(1)

          return (
            <Box
              key={date.toString()}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color }}
            >
              {icon && icon}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: '12px',
                  color: 'text.primary',
                }}
              >
                {label}
              </Typography>
            </Box>
          )
        })}
      </Stack>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        PaperProps={{ sx: { borderRadius: '16px', padding: '16px' } }}
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
