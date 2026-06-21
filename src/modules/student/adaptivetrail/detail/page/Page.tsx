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
import { adaptiveTrailDetailService } from '../../services/trailDetailService'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
  TrailStepAnswerInput,
  TrailStepCompletionResult,
  TrailStepQuestionFlow,
} from '../../types/types'
import TrailComponent from '../components/TrailComponent'

export default function Page() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [sessions, setSessions] = useState<AdaptiveTrailSession[]>([])
  const [questionFlow, setQuestionFlow] =
    useState<TrailStepQuestionFlow | null>(null)
  const [completionResult, setCompletionResult] =
    useState<TrailStepCompletionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadTrailSessions() {
      if (!subjectId) {
        setError('Matéria não informada.')
        setIsLoading(false)
        return
      }

      try {
        const nextSessions =
          await adaptiveTrailDetailService.getSubjectTrailSessions(subjectId)

        if (!isActive) return

        setError(
          nextSessions.length > 0
            ? null
            : 'Nenhuma trilha foi encontrada para esta matéria.'
        )
        setSessions(nextSessions)
      } catch {
        if (isActive)
          setError('Não foi possível carregar as trilhas desta matéria.')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadTrailSessions()
    return () => {
      isActive = false
    }
  }, [subjectId])

  const handleAnswerSubStep = useCallback(
    async (
      actionTrailId: string,
      step: AdaptiveTrailStep,
      subStep: AdaptiveTrailSubStep
    ) => {
      if (subStep.status === 'locked') return
      if (!subStep.itemId) return

      if (subStep.kind === 'question') {
        const nextFlow =
          await adaptiveTrailDetailService.getSubStepQuestionFlow(
            actionTrailId,
            step.id,
            subStep.id
          )
        setQuestionFlow({ ...nextFlow, itemId: subStep.itemId })
      } else {
        const result = await adaptiveTrailDetailService.completeItem(
          actionTrailId,
          subStep.itemId,
          []
        )
        setSessions(current =>
          current.map(session =>
            session.id === actionTrailId ? result.session : session
          )
        )
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

      const { questions, itemId, trailId: activeTrailId } = questionFlow
      const answers = questions
        .filter(q => answersByQuestionId[q.id])
        .map(q => ({ exerciseId: q.id, optionId: answersByQuestionId[q.id] }))

      const completion = await adaptiveTrailDetailService.completeItem(
        activeTrailId,
        itemId,
        answers
      )

      setSessions(current =>
        current.map(session =>
          session.id === activeTrailId ? completion.session : session
        )
      )

      const result =
        await adaptiveTrailDetailService.getCompletionRecommendations(
          activeTrailId,
          questionFlow.stepTitle,
          completion.correct,
          completion.total
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
