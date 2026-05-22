import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import OnboardingQuestionCard from '@/modules/student/shared/components/OnboardingQuestionCard'
import { adaptiveTrailDetailService } from '../services/service'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  TrailStepAnswerInput,
  TrailStepQuestionFlow,
} from '../types/types'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import ProgressBar from '@/shared/ui/ProgressBar'
import { getSubjectTheme } from '@/shared/utils/themes'

interface StepRailItemProps {
  isActive: boolean
  onAnswer: (step: AdaptiveTrailStep) => void
  step: AdaptiveTrailStep
  subjectColor: string
}

const stepKindLabel: Record<AdaptiveTrailStep['kind'], string> = {
  question: 'Questão',
  text: 'Texto',
  video: 'Vídeo',
}

const stepKindIcon: Record<AdaptiveTrailStep['kind'], ReactElement> = {
  question: <QuizOutlinedIcon sx={{ fontSize: 16 }} />,
  text: <ArticleOutlinedIcon sx={{ fontSize: 16 }} />,
  video: <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />,
}

function getActiveStep(session: AdaptiveTrailSession) {
  return (
    session.steps.find(step => step.status === 'available') ??
    session.steps.find(step => step.status === 'locked') ??
    session.steps[0]
  )
}
function LockedContentPreview({ step }: { step: AdaptiveTrailStep }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.04)
            : 'rgba(246, 248, 251, 1)',
        border: '1px dashed',
        borderColor: 'background.border',
        borderRadius: '20px',
        display: 'grid',
        gap: 2,
        justifyItems: 'center',
        minHeight: { md: 360, xs: 260 },
        p: { md: 4, xs: 2.5 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: alpha(theme.palette.text.secondary, 0.1),
          borderRadius: '999px',
          color: 'text.secondary',
          display: 'flex',
          height: 72,
          justifyContent: 'center',
          width: 72,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 34 }} />
      </Box>
      <Box className="grid gap-1">
        <Typography
          sx={{ color: 'text.primary', fontSize: 20, fontWeight: 800 }}
        >
          {step.content.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 460 }}>
          {step.lockReason ??
            'Conclua a etapa liberada para acessar este conteúdo.'}
        </Typography>
      </Box>
      <Button
        disabled
        startIcon={<LockOutlinedIcon />}
        sx={{
          borderRadius: '999px',
          fontWeight: 800,
          textTransform: 'none',
        }}
        variant="outlined"
      >
        Conteúdo bloqueado
      </Button>
    </Box>
  )
}

function StepRailItem({
  isActive,
  onAnswer,
  step,
  subjectColor,
}: StepRailItemProps) {
  const theme = useTheme()
  const isLocked = step.status === 'locked'
  const isDark = theme.palette.mode === 'dark'

  const surfaceBg = isLocked
    ? alpha(theme.palette.text.secondary, isDark ? 0.06 : 0.04)
    : isActive
      ? alpha(subjectColor, isDark ? 0.16 : 0.08)
      : isDark
        ? alpha(theme.palette.common.white, 0.02)
        : 'background.paper'

  const surfaceBorder = isLocked
    ? alpha(theme.palette.text.secondary, isDark ? 0.16 : 0.14)
    : isActive
      ? alpha(subjectColor, isDark ? 0.5 : 0.36)
      : isDark
        ? alpha(theme.palette.common.white, 0.08)
        : 'background.border'

  return (
    <Box
      sx={{
        backgroundColor: surfaceBg,
        border: '1px solid',
        borderColor: surfaceBorder,
        borderRadius: '20px',
        display: 'grid',
        alignItems: 'center',
        gap: { md: 2, xs: 1.5 },
        gridTemplateColumns: { md: '1fr auto', xs: '1fr' },
        opacity: isLocked ? 0.85 : 1,
        p: { md: 2.5, xs: 2 },
        transition: 'background-color 160ms ease, border-color 160ms ease',
      }}
    >
      <Box className="grid gap-1.5">
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Chip
            label={`Etapa ${step.order}`}
            size="small"
            sx={{
              backgroundColor: isActive
                ? alpha(subjectColor, isDark ? 0.24 : 0.14)
                : alpha(theme.palette.text.secondary, isDark ? 0.16 : 0.08),
              color: isActive ? subjectColor : 'text.secondary',
              fontWeight: 700,
            }}
          />
          <Chip
            icon={isLocked ? <LockOutlinedIcon /> : stepKindIcon[step.kind]}
            label={stepKindLabel[step.kind]}
            size="small"
            sx={{
              backgroundColor: alpha(
                theme.palette.text.secondary,
                isDark ? 0.16 : 0.08
              ),
              color: 'text.secondary',
              fontWeight: 700,
              '& .MuiChip-icon': {
                color: 'text.secondary',
              },
            }}
          />
        </Stack>

        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { md: 17, xs: 16 },
            fontWeight: 800,
          }}
        >
          {step.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
          {step.content.body}
        </Typography>
      </Box>

      {isLocked ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            backgroundColor: alpha(
              theme.palette.text.secondary,
              isDark ? 0.14 : 0.08
            ),
            borderRadius: '999px',
            color: 'text.secondary',
            justifyContent: 'center',
            justifySelf: { md: 'end', xs: 'stretch' },
            px: 1.5,
            py: 0.75,
            width: { md: 'fit-content', xs: '100%' },
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {step.lockReason ?? 'Etapa bloqueada'}
          </Typography>
        </Stack>
      ) : (
        <IconButton
          onClick={() => onAnswer(step)}
          sx={{
            borderColor: subjectColor,
            borderRadius: 'var(--app-radius-control)',
            color: subjectColor,
            fontWeight: 800,
            justifySelf: { md: 'end', xs: 'stretch' },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            border: '1px solid',
            height: 32,
            width: 32,
            '&:hover': {
              borderColor: alpha(subjectColor, 0.6),
            },
          }}
        >
          <PlayArrowRoundedIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default function Page() {
  const theme = useTheme()
  const { trailId } = useParams<{ trailId: string }>()
  const [session, setSession] = useState<AdaptiveTrailSession | null>(null)
  const [questionFlow, setQuestionFlow] =
    useState<TrailStepQuestionFlow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadTrailSession() {
      if (!trailId) {
        setError('Trilha não informada.')
        setIsLoading(false)
        return
      }

      try {
        const nextSession =
          await adaptiveTrailDetailService.getTrailSession(trailId)

        if (!isActive) {
          return
        }

        setSession(nextSession)
        setError(nextSession ? null : 'A trilha solicitada não foi encontrada.')
      } catch {
        if (isActive) {
          setError('Não foi possível carregar esta trilha.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadTrailSession()

    return () => {
      isActive = false
    }
  }, [trailId])

  const activeStep = useMemo(
    () => (session ? getActiveStep(session) : null),
    [session]
  )
  const subjectTheme = getSubjectTheme(session?.subject, {
    mode: theme.palette.mode,
  })

  const handleAnswerStep = useCallback(
    async (step: AdaptiveTrailStep) => {
      if (!trailId || step.status === 'locked') {
        return
      }

      const nextQuestionFlow =
        await adaptiveTrailDetailService.getStepQuestionFlow(trailId, step.id)

      setQuestionFlow(nextQuestionFlow)
    },
    [trailId]
  )

  const handleAnswer = useCallback(async (input: TrailStepAnswerInput) => {
    await adaptiveTrailDetailService.saveStepAnswer(input)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !session || !activeStep) {
    return (
      <AppPageContainer>
        <EmptyState
          description={error ?? 'A trilha solicitada não foi encontrada.'}
          title="Trilha indisponível"
        />
      </AppPageContainer>
    )
  }

  if (questionFlow) {
    return (
      <AppPageContainer
        sx={{
          alignItems: 'center',
          justifyItems: 'center',
          maxWidth: 'none',
          minHeight: { md: '80vh', xs: 'auto' },
          py: { md: 4, xs: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <OnboardingQuestionCard
            assessmentId={questionFlow.assessmentId}
            initialAnswersByQuestionId={questionFlow.initialAnswersByQuestionId}
            onAnswer={handleAnswer}
            onBack={() => setQuestionFlow(null)}
            questions={questionFlow.questions}
            title={questionFlow.stepTitle ?? 'Questionário da trilha'}
          />
        </Box>
      </AppPageContainer>
    )
  }

  const isActiveStepLocked = activeStep.status === 'locked'

  return (
    <AppPageContainer sx={{ maxWidth: 'none' }}>
      <AppCard
        sx={{
          backgroundColor: subjectTheme.softSurface.backgroundColor,
          borderColor: subjectTheme.softSurface.borderColor,
        }}
        contentSx={{
          display: 'grid',
          gap: { md: 3, xs: 2 },
          p: { md: 4, xs: 2.5 },
        }}
      >
        <Button
          component={Link}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            borderRadius: '999px',
            color: 'text.secondary',
            fontWeight: 700,
            width: 'fit-content',
            textTransform: 'none',
          }}
          to={APP_ROUTES.student.adaptiveTrail}
          variant="text"
        >
          Voltar para trilhas
        </Button>

        <Box className="grid gap-2">
          <AppSubjectsTags
            subjects={session.subject ? [session.subject] : []}
            size="sm"
          />

          <Typography
            component="h1"
            sx={{
              color: 'text.primary',
              fontSize: { md: 30, xs: 22 },
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            {session.title}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { md: 15, xs: 14 },
              maxWidth: 860,
            }}
          >
            {session.description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { md: 2, xs: 1.5 },
          }}
        >
          {isActiveStepLocked ? (
            <LockedContentPreview step={activeStep} />
          ) : (
            session.steps.map(step => (
              <StepRailItem
                key={step.id}
                isActive={step.id === activeStep.id}
                onAnswer={selectedStep => {
                  void handleAnswerStep(selectedStep)
                }}
                step={step}
                subjectColor={subjectTheme.color}
              />
            ))
          )}
        </Box>
      </AppCard>
    </AppPageContainer>
  )
}
