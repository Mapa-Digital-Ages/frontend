import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Box, Button } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import OnboardingQuestionCard from '@/modules/student/shared/components/OnboardingQuestionCard'
import TrailCompletionScreen from '../../components/TrailCompletionScreen'
import { fetchTrails } from '../../data/trails'
import { adaptiveTrailDetailService } from '../../services/trailDetailService'
import { studentService } from '../../services/service'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
  TrailStepAnswerInput,
  TrailStepCompletionResult,
  TrailStepQuestionFlow,
} from '../../types/types'
import TrailComponent from '../components/TrailComponent'

function applySubStepCompletion(
  session: AdaptiveTrailSession,
  stepId: string,
  subStepId: string
): AdaptiveTrailSession {
  const steps = session.steps.map(step => {
    if (step.id !== stepId) return step

    const subStepIndex = step.subSteps.findIndex(ss => ss.id === subStepId)
    if (subStepIndex === -1) return step

    const subSteps = step.subSteps.map((ss, i) => {
      if (i === subStepIndex) return { ...ss, status: 'completed' as const }
      if (i === subStepIndex + 1) return { ...ss, status: 'available' as const }
      return ss
    })

    const allSubStepsDone = subSteps.every(ss => ss.status === 'completed')
    return {
      ...step,
      status: allSubStepsDone ? ('completed' as const) : step.status,
      subSteps,
    }
  })

  const updatedSteps = steps.map((step, i) => {
    const prevStep = steps[i - 1]
    if (prevStep?.status === 'completed' && step.status === 'locked') {
      return {
        ...step,
        status: 'available' as const,
        subSteps: step.subSteps.map((ss, j) =>
          j === 0 ? { ...ss, status: 'available' as const } : ss
        ),
      }
    }
    return step
  })

  const completedCount = updatedSteps.filter(
    s => s.status === 'completed'
  ).length
  const progress =
    updatedSteps.length > 0
      ? Math.round((completedCount / updatedSteps.length) * 100)
      : 0

  return {
    ...session,
    steps: updatedSteps,
    completedSteps: completedCount,
    progress,
  }
}

async function loadSubjectTrailSessions(currentSession: AdaptiveTrailSession) {
  const studentId = studentService.getStudentId()
  if (!studentId) return [currentSession]

  try {
    const trails = await fetchTrails(studentId)
    const subjectTrailIds = trails
      .filter(trail => trail.subject?.id === currentSession.subject?.id)
      .map(trail => trail.id)

    const orderedTrailIds = Array.from(
      new Set([currentSession.id, ...subjectTrailIds])
    )

    const sessions = await Promise.all(
      orderedTrailIds.map(id =>
        id === currentSession.id
          ? Promise.resolve(currentSession)
          : adaptiveTrailDetailService.getTrailSession(id)
      )
    )

    return sessions.filter((session): session is AdaptiveTrailSession =>
      Boolean(session)
    )
  } catch {
    return [currentSession]
  }
}

export default function Page() {
  const { trailId } = useParams<{ trailId: string }>()
  const [sessions, setSessions] = useState<AdaptiveTrailSession[]>([])
  const [questionFlow, setQuestionFlow] =
    useState<TrailStepQuestionFlow | null>(null)
  const [completionResult, setCompletionResult] =
    useState<TrailStepCompletionResult | null>(null)
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

        if (!isActive) return

        const nextSessions = nextSession
          ? await loadSubjectTrailSessions(nextSession)
          : []

        if (!isActive) return

        setError(nextSession ? null : 'A trilha solicitada não foi encontrada.')
        setSessions(nextSessions)
      } catch {
        if (isActive) setError('Não foi possível carregar esta trilha.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadTrailSession()
    return () => {
      isActive = false
    }
  }, [trailId])

  const handleAnswerSubStep = useCallback(
    async (
      actionTrailId: string,
      step: AdaptiveTrailStep,
      subStep: AdaptiveTrailSubStep
    ) => {
      if (subStep.status === 'locked') return

      if (subStep.kind === 'question') {
        const nextFlow =
          await adaptiveTrailDetailService.getSubStepQuestionFlow(
            actionTrailId,
            step.id,
            subStep.id
          )
        setQuestionFlow(nextFlow)
      } else {
        // video/text: mark as done immediately
        setSessions(current =>
          current.map(session =>
            session.id === actionTrailId
              ? applySubStepCompletion(session, step.id, subStep.id)
              : session
          )
        )
        const isLastSubStep =
          step.subSteps[step.subSteps.length - 1]?.id === subStep.id
        const hasQuiz = step.subSteps.some(ss => ss.kind === 'question')
        if (isLastSubStep && !hasQuiz) {
          await adaptiveTrailDetailService.completeStep(
            actionTrailId,
            step.id,
            []
          )
        }
      }
    },
    []
  )

  const handleAnswer = useCallback(async (input: TrailStepAnswerInput) => {
    await adaptiveTrailDetailService.saveStepAnswer(input)
  }, [])

  const handleQuizComplete = useCallback(
    async (answersByQuestionId: Record<string, string>) => {
      if (!questionFlow) return

      const {
        questions,
        stepId,
        subStepId,
        trailId: activeTrailId,
      } = questionFlow
      const answers = questions
        .filter(q => answersByQuestionId[q.id])
        .map(q => ({ exerciseId: q.id, optionId: answersByQuestionId[q.id] }))

      const graded = await adaptiveTrailDetailService.completeStep(
        activeTrailId,
        stepId,
        answers
      )

      setSessions(current =>
        current.map(session =>
          session.id === activeTrailId
            ? applySubStepCompletion(session, stepId, subStepId)
            : session
        )
      )

      const result =
        await adaptiveTrailDetailService.getCompletionRecommendations(
          activeTrailId,
          questionFlow.stepTitle,
          graded.correct,
          graded.total
        )

      setCompletionResult(result)
    },
    [questionFlow]
  )

  const handleContinueFromResult = useCallback(() => {
    setCompletionResult(null)
    setQuestionFlow(null)
  }, [])

  if (isLoading) return <LoadingScreen />

  if (error || sessions.length === 0) {
    return (
      <AppPageContainer>
        <EmptyState
          description={error ?? 'A trilha solicitada não foi encontrada.'}
          title="Trilha indisponível"
        />
      </AppPageContainer>
    )
  }

  if (completionResult) {
    return (
      <TrailCompletionScreen
        result={completionResult}
        onContinue={handleContinueFromResult}
      />
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
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <OnboardingQuestionCard
            assessmentId={questionFlow.assessmentId}
            initialAnswersByQuestionId={questionFlow.initialAnswersByQuestionId}
            onAnswer={handleAnswer}
            onBack={() => setQuestionFlow(null)}
            onComplete={handleQuizComplete}
            questions={questionFlow.questions}
            title={questionFlow.stepTitle ?? 'Questionário da trilha'}
          />
        </Box>
      </AppPageContainer>
    )
  }

  return (
    <AppPageContainer sx={{ maxWidth: 'none' }}>
      <Button
        component={Link}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          borderRadius: '999px',
          color: 'text.secondary',
          fontWeight: 700,
          textTransform: 'none',
          width: 'fit-content',
        }}
        to={APP_ROUTES.student.adaptiveTrail}
        variant="text"
      >
        Voltar para trilhas
      </Button>

      <TrailComponent
        onAnswerSubStep={handleAnswerSubStep}
        sessions={sessions}
      />
    </AppPageContainer>
  )
}
