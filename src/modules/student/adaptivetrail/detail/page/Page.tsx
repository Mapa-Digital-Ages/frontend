import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import ProgressBar from '@/shared/ui/ProgressBar'
import { getSubjectTheme } from '@/shared/utils/themes'
import type {
  AdaptiveTrailQuestion,
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
} from '../../types/types'
import type {
  StepAnswerPayload,
  StepCompletionResult,
  TrailStepQuestionFlow,
  ValidateAnswerResult,
} from '../types/types'
import { adaptiveTrailDetailService } from '../services/service'
import TrailComponent from '../components/TrailComponent'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

interface ActiveQuiz {
  flow: TrailStepQuestionFlow
  step: AdaptiveTrailStep
  trail: AdaptiveTrailSession
}

interface QuizSummary {
  result: StepCompletionResult
  stepTitle: string
  trail: AdaptiveTrailSession
}

function upsertSession(
  sessions: AdaptiveTrailSession[],
  next: AdaptiveTrailSession
): AdaptiveTrailSession[] {
  return sessions.map(session => (session.id === next.id ? next : session))
}

function QuestionCard({
  isSubmitting,
  onBack,
  onSelect,
  onSubmit,
  question,
  questionIndex,
  selectedFeedback,
  selectedOptionId,
  totalQuestions,
  trail,
}: {
  isSubmitting: boolean
  onBack: () => void
  onSelect: (optionId: string) => void
  onSubmit: () => void
  question: AdaptiveTrailQuestion
  questionIndex: number
  selectedFeedback: ValidateAnswerResult | null
  selectedOptionId: string | null
  totalQuestions: number
  trail: AdaptiveTrailSession
}) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(trail.subject, {
    mode: theme.palette.mode,
  })
  const isDark = theme.palette.mode === 'dark'
  const isLast = questionIndex === totalQuestions - 1
  const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100)

  return (
    <AppCard
      sx={{
        borderColor: subjectTheme.border.borderColor,
        maxWidth: 820,
        width: '100%',
      }}
      contentSx={{
        display: 'grid',
        gap: { md: 3, xs: 2 },
        p: { md: 4, xs: 2 },
      }}
    >
      <Box>
        <Button
          onClick={onBack}
          size="small"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            borderRadius: 'var(--app-radius-pill)',
            color: 'text.secondary',
            fontWeight: 700,
            textTransform: 'none',
          }}
          variant="text"
        >
          Voltar para etapas
        </Button>
      </Box>

      <Stack spacing={1}>
        <AppSubjectsTags
          subjects={trail.subject ? [trail.subject] : []}
          size="sm"
        />
        <Typography
          component="h1"
          sx={{
            color: 'text.primary',
            fontSize: { md: 26, xs: 21 },
            fontWeight: 800,
            lineHeight: 1.18,
          }}
        >
          {trail.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
          Selecione uma alternativa e confira o resultado antes de avançar.
        </Typography>
      </Stack>

      <Box
        sx={{
          backgroundColor: subjectTheme.softSurface.backgroundColor,
          border: `1px solid ${subjectTheme.softSurface.borderColor}`,
          borderRadius: '16px',
          display: 'grid',
          gap: 1.5,
          p: { md: 2.5, xs: 2 },
        }}
      >
        <Typography
          sx={{
            color: subjectTheme.color,
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Pergunta {questionIndex + 1} de {totalQuestions}
        </Typography>
        <ProgressBar
          subject={trail.subject}
          thickness={8}
          value={progress}
          valueLabelVariant="plain"
        />
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${subjectTheme.border.borderColor}`,
          borderRadius: '16px',
          display: 'grid',
          gap: 2,
          p: { md: 3, xs: 2 },
        }}
      >
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { md: 22, xs: 18 },
            fontWeight: 800,
            lineHeight: 1.25,
          }}
        >
          {question.question}
        </Typography>

        <Box sx={{ display: 'grid', gap: 1.25 }}>
          {question.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id
            const isValidatedOption = selectedFeedback?.optionId === option.id
            const validationColor = selectedFeedback?.correct
              ? theme.palette.success.main
              : theme.palette.error.main
            const selectedBackground = alpha(
              isValidatedOption ? validationColor : subjectTheme.color,
              isDark ? 0.16 : 0.09
            )

            return (
              <Button
                key={option.id}
                disabled={isSubmitting || Boolean(selectedFeedback)}
                onClick={() => onSelect(option.id)}
                sx={{
                  backgroundColor: isSelected
                    ? selectedBackground
                    : 'transparent',
                  borderColor: isSelected
                    ? isValidatedOption
                      ? validationColor
                      : subjectTheme.color
                    : alpha(subjectTheme.color, isDark ? 0.34 : 0.22),
                  borderRadius: 'var(--app-radius-control)',
                  color: 'text.primary',
                  fontWeight: 700,
                  justifyContent: 'flex-start',
                  minHeight: 50,
                  px: 2,
                  py: 1.25,
                  textAlign: 'left',
                  textTransform: 'none',
                  whiteSpace: 'normal',
                  '&:hover': {
                    backgroundColor: isSelected
                      ? selectedBackground
                      : alpha(subjectTheme.color, isDark ? 0.14 : 0.08),
                    borderColor: subjectTheme.color,
                  },
                }}
                variant="outlined"
              >
                <Box component="span" sx={{ color: subjectTheme.color, mr: 1 }}>
                  {OPTION_LETTERS[index] ?? index + 1}.
                </Box>
                {option.label}
              </Button>
            )
          })}
        </Box>

        {selectedFeedback ? (
          <Typography
            sx={{
              color: selectedFeedback.correct ? 'success.main' : 'error.main',
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {selectedFeedback.correct
              ? 'Resposta correta.'
              : 'Resposta incorreta.'}
          </Typography>
        ) : null}

        <Button
          disabled={!selectedOptionId || isSubmitting}
          onClick={onSubmit}
          sx={{
            backgroundColor: subjectTheme.solidSurface.backgroundColor,
            borderRadius: 'var(--app-radius-pill)',
            boxShadow: 'none',
            color: subjectTheme.solidSurface.color,
            fontWeight: 800,
            minHeight: 46,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: subjectTheme.solidSurface.backgroundColor,
              opacity: 0.92,
            },
          }}
          variant="contained"
        >
          {selectedFeedback
            ? isLast
              ? 'Concluir etapa'
              : 'Próxima pergunta'
            : 'Verificar resposta'}
        </Button>
      </Box>
    </AppCard>
  )
}

function QuizFinishedCard({
  onRestart,
  summary,
}: {
  onRestart: () => void
  summary: QuizSummary
}) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(summary.trail.subject, {
    mode: theme.palette.mode,
  })
  const { correct, total, passed } = summary.result

  return (
    <AppCard
      sx={{ borderColor: subjectTheme.border.borderColor, maxWidth: 720 }}
      contentSx={{ display: 'grid', gap: 2.5, p: { md: 4, xs: 2 } }}
    >
      <AppSubjectsTags
        subjects={summary.trail.subject ? [summary.trail.subject] : []}
        size="sm"
      />
      <Typography
        component="h1"
        sx={{
          color: 'text.primary',
          fontSize: { md: 26, xs: 21 },
          fontWeight: 800,
          lineHeight: 1.18,
        }}
      >
        {passed ? 'Etapa concluída' : 'Continue praticando'}
      </Typography>
      <Typography
        sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.6 }}
      >
        {passed
          ? 'Você concluiu esta etapa e avançou na trilha.'
          : 'Revise o conteúdo e tente novamente para avançar na trilha.'}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 1.25,
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <Box>
          <Typography
            sx={{ color: subjectTheme.color, fontSize: 28, fontWeight: 900 }}
          >
            {correct}
          </Typography>
          <Typography
            sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 700 }}
          >
            Corretas
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ color: subjectTheme.color, fontSize: 28, fontWeight: 900 }}
          >
            {total}
          </Typography>
          <Typography
            sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 700 }}
          >
            Respondidas
          </Typography>
        </Box>
      </Box>
      <Button
        onClick={onRestart}
        sx={{
          backgroundColor: subjectTheme.solidSurface.backgroundColor,
          borderRadius: 'var(--app-radius-pill)',
          boxShadow: 'none',
          color: subjectTheme.solidSurface.color,
          fontWeight: 800,
          minHeight: 46,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: subjectTheme.solidSurface.backgroundColor,
            opacity: 0.92,
          },
        }}
        variant="contained"
      >
        Voltar para etapas
      </Button>
    </AppCard>
  )
}

export default function Page() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [sessions, setSessions] = useState<AdaptiveTrailSession[]>([])
  const [quiz, setQuiz] = useState<ActiveQuiz | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<StepAnswerPayload[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [summary, setSummary] = useState<QuizSummary | null>(null)
  const [selectedFeedback, setSelectedFeedback] =
    useState<ValidateAnswerResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadSessions = useCallback(async () => {
    if (!subjectId) {
      setError('Matéria não informada.')
      setIsLoading(false)
      return
    }
    const nextSessions =
      await adaptiveTrailDetailService.getSubjectTrailSessions(subjectId)
    setSessions(nextSessions)
    setError(
      nextSessions.length > 0
        ? null
        : 'Nenhuma trilha foi encontrada para esta matéria.'
    )
  }, [subjectId])

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    loadSessions()
      .catch(() => {
        if (isActive)
          setError('Não foi possível carregar as trilhas desta matéria.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [loadSessions])

  const resetQuizState = useCallback(() => {
    setQuiz(null)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedOptionId(null)
    setSelectedFeedback(null)
  }, [])

  const handleAnswerSubStep = useCallback(
    async (
      trailId: string,
      step: AdaptiveTrailStep,
      subStep: AdaptiveTrailSubStep
    ) => {
      if (subStep.status === 'locked') return
      const trail = sessions.find(session => session.id === trailId)
      if (!trail) return

      setError(null)

      if (subStep.kind !== 'question') {
        if (!subStep.itemId) return
        try {
          const { session } = await adaptiveTrailDetailService.completeItem(
            trailId,
            subStep.itemId,
            []
          )
          setSessions(current => upsertSession(current, session))
        } catch {
          setError('Não foi possível concluir esta etapa.')
        }
        return
      }

      try {
        const flow = await adaptiveTrailDetailService.getSubStepQuestionFlow(
          trailId,
          step.id,
          subStep.id
        )
        if (flow.questions.length === 0) {
          setError('Esta etapa não possui questões disponíveis.')
          return
        }
        resetQuizState()
        setQuiz({ flow, step, trail })
        setSummary(null)
      } catch {
        setError('Não foi possível iniciar o quiz desta etapa.')
      }
    },
    [resetQuizState, sessions]
  )

  const handleSubmitAnswer = useCallback(async () => {
    if (!quiz || !selectedOptionId) return

    const question = quiz.flow.questions[currentIndex]
    if (!selectedFeedback) {
      setIsSubmitting(true)
      try {
        const validation = await adaptiveTrailDetailService.validateAnswer(
          quiz.trail.id,
          quiz.step.id,
          { exerciseId: question.id, optionId: selectedOptionId }
        )
        setSelectedFeedback(validation)
      } catch {
        setError('Não foi possível validar esta alternativa.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    const nextAnswers: StepAnswerPayload[] = [
      ...answers,
      { exerciseId: question.id, optionId: selectedOptionId },
    ]

    if (currentIndex < quiz.flow.questions.length - 1) {
      setAnswers(nextAnswers)
      setCurrentIndex(index => index + 1)
      setSelectedOptionId(null)
      setSelectedFeedback(null)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await adaptiveTrailDetailService.completeStep(
        quiz.trail.id,
        quiz.step.id,
        nextAnswers
      )
      setSummary({
        result,
        stepTitle: quiz.flow.stepTitle,
        trail: quiz.trail,
      })
      resetQuizState()
      await loadSessions().catch(() => undefined)
    } catch {
      setError('Não foi possível enviar as respostas desta etapa.')
    } finally {
      setIsSubmitting(false)
    }
  }, [
    answers,
    currentIndex,
    loadSessions,
    quiz,
    resetQuizState,
    selectedFeedback,
    selectedOptionId,
  ])

  const handleBackToTrail = useCallback(() => {
    resetQuizState()
    setSummary(null)
    setError(null)
  }, [resetQuizState])

  if (isLoading) return <LoadingScreen />

  if (error && sessions.length === 0) {
    return (
      <AppPageContainer>
        <EmptyState title="Trilha indisponível" description={error} />
      </AppPageContainer>
    )
  }

  if (sessions.length === 0) {
    return (
      <AppPageContainer>
        <EmptyState
          title="Trilha indisponível"
          description="Nenhuma trilha foi encontrada para esta matéria."
        />
      </AppPageContainer>
    )
  }

  return (
    <AppPageContainer sx={{ maxWidth: 'none' }}>
      {error ? <EmptyState title="Erro na trilha" description={error} /> : null}

      {summary ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <QuizFinishedCard summary={summary} onRestart={handleBackToTrail} />
        </Box>
      ) : quiz ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <QuestionCard
            isSubmitting={isSubmitting}
            onBack={handleBackToTrail}
            onSelect={optionId => {
              setSelectedOptionId(optionId)
              setSelectedFeedback(null)
            }}
            onSubmit={handleSubmitAnswer}
            question={quiz.flow.questions[currentIndex]}
            questionIndex={currentIndex}
            selectedFeedback={selectedFeedback}
            selectedOptionId={selectedOptionId}
            totalQuestions={quiz.flow.questions.length}
            trail={quiz.trail}
          />
        </Box>
      ) : (
        <TrailComponent
          emptyDescription="Nenhuma trilha de quiz disponível no momento."
          emptyTitle="Nenhuma trilha encontrada"
          onAnswerSubStep={handleAnswerSubStep}
          sessions={sessions}
        />
      )}
    </AppPageContainer>
  )
}
