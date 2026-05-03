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
import { useEffect, useState, type ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/pt-br'
import { authService } from '@/app/auth/core/service'
import {
  wellBeingService,
  type WellBeingHumor,
} from '@/shared/services/wellBeingService'

const HUMOR_TO_LABEL: Record<WellBeingHumor, string> = {
  good: 'Bem',
  regular: 'Regular',
  bad: 'Mal',
}

const LABEL_TO_HUMOR: Record<string, WellBeingHumor> = {
  Bem: 'good',
  Regular: 'regular',
  Mal: 'bad',
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const studentUserId = authService.getUserId()

  useEffect(() => {
    if (!studentUserId) return
    let active = true
    const today = dayjs().format('YYYY-MM-DD')
    void wellBeingService
      .getStudentDay(studentUserId, today)
      .then(record => {
        if (!active || !record?.humor) return
        setWeeklyMood(prev =>
          prev.map(day =>
            day.date.format('YYYY-MM-DD') === today
              ? { ...day, mood: record.humor }
              : day
          )
        )
        setSelectedEmotion(HUMOR_TO_LABEL[record.humor])
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [studentUserId])

  async function handleEmotionSelect(emotionLabel: string) {
    const humor = LABEL_TO_HUMOR[emotionLabel]
    if (!humor) return

    const today = dayjs().format('YYYY-MM-DD')

    setWeeklyMood(prev =>
      prev.map(day =>
        day.date.format('YYYY-MM-DD') === today ? { ...day, mood: humor } : day
      )
    )
    setSelectedEmotion(emotionLabel)
    setErrorMessage(null)

    if (!studentUserId) {
      setModalOpen(true)
      return
    }

    setIsSubmitting(true)
    try {
      await wellBeingService.upsertToday(studentUserId, humor)
      setModalOpen(true)
    } catch {
      setErrorMessage(
        'Não foi possível registrar seu humor agora. Tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
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

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: errorMessage ? 1 : 4,
          width: '100%',
          opacity: isSubmitting ? 0.6 : 1,
          pointerEvents: isSubmitting ? 'none' : 'auto',
          transition: 'opacity 120ms ease',
        }}
      >
        <EmotionButton
          testId="emotion-button-good"
          label="Bem"
          color="success"
          icon={<SentimentVerySatisfiedIcon sx={{ fontSize: 28 }} />}
          onClick={() => void handleEmotionSelect('Bem')}
          value="Bem"
        />
        <EmotionButton
          testId="emotion-button-regular"
          label="Regular"
          color="warning"
          icon={<SentimentNeutralIcon sx={{ fontSize: 28 }} />}
          onClick={() => void handleEmotionSelect('Regular')}
          value="Regular"
        />
        <EmotionButton
          testId="emotion-button-bad"
          label="Mal"
          color="error"
          icon={<SentimentVeryDissatisfiedIcon sx={{ fontSize: 28 }} />}
          onClick={() => void handleEmotionSelect('Mal')}
          value="Mal"
        />
      </Stack>
      {errorMessage && (
        <Typography
          role="alert"
          variant="body2"
          sx={{ color: 'error.main', mb: 2 }}
        >
          {errorMessage}
        </Typography>
      )}

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
