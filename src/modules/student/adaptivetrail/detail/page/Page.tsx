import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import OnboardingQuestionCard from '@/modules/student/shared/components/OnboardingQuestionCard'
import TrailCompletionScreen from '../../components/TrailCompletionScreen'
import TrailSearchBar from '../../components/TrailSearchBar'
import TrailStepItem from '../../components/TrailStepItem'
import { useTrailSearch } from '../../hooks/useTrailSearch'
import { adaptiveTrailDetailService } from '../../services/trailDetailService'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
  TrailStepAnswerInput,
  TrailStepCompletionResult,
  TrailStepQuestionFlow,
} from '../../types/types'
import { getSubjectTheme } from '@/shared/utils/themes'
import ProgressBar from '@/shared/ui/ProgressBar'
import { Chat } from '@mui/icons-material'
import TrailChatPanel from '../components/TrailChatPanel'

function getActiveStepId(session: AdaptiveTrailSession): string | null {
  return session.steps.find(s => s.status === 'available')?.id ?? null
}

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

export default function Page() {
  const theme = useTheme()
  const { trailId } = useParams<{ trailId: string }>()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLocked] = useState(false)
  const [session, setSession] = useState<AdaptiveTrailSession | null>(null)
  const [questionFlow, setQuestionFlow] =
    useState<TrailStepQuestionFlow | null>(null)
  const [completionResult, setCompletionResult] =
    useState<TrailStepCompletionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null)

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

        setSession(nextSession)
        setError(nextSession ? null : 'A trilha solicitada não foi encontrada.')

        if (nextSession) {
          const activeId = getActiveStepId(nextSession)
          setExpandedStepId(activeId)
        }
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

  const { query, setQuery, filteredSteps, expandedBySearch } = useTrailSearch(
    session?.steps ?? []
  )

  const progressValue = session?.progress ?? 0

  const subjectTheme = getSubjectTheme(session?.subject, {
    mode: theme.palette.mode,
  })

  const handleExpandStep = useCallback((step: AdaptiveTrailStep) => {
    if (step.status === 'locked') return
    setExpandedStepId(id => (id === step.id ? null : step.id))
  }, [])

  const handleAnswerSubStep = useCallback(
    async (step: AdaptiveTrailStep, subStep: AdaptiveTrailSubStep) => {
      if (!trailId || subStep.status === 'locked') return

      if (subStep.kind === 'question') {
        const nextFlow =
          await adaptiveTrailDetailService.getSubStepQuestionFlow(
            trailId,
            step.id,
            subStep.id
          )
        setQuestionFlow(nextFlow)
      } else {
        // video/text: mark as done immediately
        setSession(current =>
          current ? applySubStepCompletion(current, step.id, subStep.id) : null
        )
      }
    },
    [trailId]
  )

  const handleAnswer = useCallback(async (input: TrailStepAnswerInput) => {
    await adaptiveTrailDetailService.saveStepAnswer(input)
  }, [])

  const handleQuizComplete = useCallback(
    async (answersByQuestionId: Record<string, string>) => {
      if (!trailId || !questionFlow) return

      const { questions, stepId, subStepId } = questionFlow
      const correct = questions.filter(
        q => answersByQuestionId[q.id] === q.correctOptionId
      ).length

      setSession(current =>
        current ? applySubStepCompletion(current, stepId, subStepId) : null
      )

      const result =
        await adaptiveTrailDetailService.getCompletionRecommendations(
          trailId,
          questionFlow.stepTitle,
          correct,
          questions.length
        )

      setCompletionResult(result)
    },
    [trailId, questionFlow]
  )

  const handleContinueFromResult = useCallback(() => {
    setCompletionResult(null)
    setQuestionFlow(null)
    setSession(current => {
      if (!current) return null
      const activeId = getActiveStepId(current)
      setExpandedStepId(activeId)
      return current
    })
  }, [])

  if (isLoading) return <LoadingScreen />

  if (error || !session) {
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

  const chatPanelWidth = 440

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

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AppCard
            sx={{ flex: 1 }}
            contentSx={{
              display: 'grid',
              gap: { md: 3, xs: 2 },
              p: { md: 3, xs: 1.5 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                alignItems: { md: 'center', xs: 'flex-start' },
                justifyContent: 'space-between',
                gap: { md: 0, xs: 2 },
              }}
            >
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
              <IconButton
                onClick={() => setIsExpanded(prev => !prev)}
                sx={{
                  color: isExpanded ? '#fff' : subjectTheme.color,
                  height: 32,
                  width: 32,
                  borderRadius: 'var(--app-radius-control)',
                  textTransform: 'none',
                  flexShrink: 0,
                  border: '1px solid',
                  borderColor: subjectTheme.color,
                  backgroundColor: isExpanded
                    ? subjectTheme.color
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isExpanded
                      ? subjectTheme.color
                      : subjectTheme.softSurface.backgroundColor,
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 18,
                  },
                }}
              >
                <Chat />
              </IconButton>
            </Box>

            <Box>
              <ProgressBar
                subject={session.subject}
                thickness={10}
                showValueLabel
                value={progressValue}
                valueLabelVariant="plain"
              />
            </Box>

            <TrailSearchBar
              onChange={setQuery}
              query={query}
              subjectColor={subjectTheme.color}
            />

            <Box sx={{ display: 'grid' }}>
              {filteredSteps.map((step, index) => (
                <TrailStepItem
                  key={step.id}
                  isExpanded={
                    query.trim()
                      ? expandedBySearch.has(step.id)
                      : expandedStepId === step.id
                  }
                  isFirst={index === 0}
                  isLast={index === filteredSteps.length - 1}
                  prevStatus={
                    index > 0 ? filteredSteps[index - 1].status : undefined
                  }
                  onAnswerSubStep={handleAnswerSubStep}
                  onExpand={handleExpandStep}
                  searchQuery={query}
                  step={step}
                  subjectColor={subjectTheme.color}
                />
              ))}
              {query.trim() && filteredSteps.length === 0 && (
                <EmptyState
                  description="Tente outros termos de busca."
                  title="Nenhuma etapa encontrada"
                />
              )}
            </Box>
          </AppCard>
        </Box>

        <Collapse
          in={isExpanded && !isLocked}
          orientation="horizontal"
          unmountOnExit
          sx={{
            '& .MuiCollapse-wrapperInner': { height: '100%' },
            '& .MuiCollapse-wrapper': { height: '100%' },
          }}
        >
          <Box
            sx={{
              width: chatPanelWidth,
              height: '100%',
            }}
          >
            <TrailChatPanel
              subjectTheme={subjectTheme}
              subjectLabel={session.subject?.label ?? 'Trilha'}
            />
          </Box>
        </Collapse>
      </Box>
    </AppPageContainer>
  )
}
