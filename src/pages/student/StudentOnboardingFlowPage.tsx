import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import AppPageContainer from '@/components/ui/AppPageContainer'
import OnboardingQuestionCard from '@/components/ui/OnboardingQuestionCard'
import type { SubjectContext } from '@/types/common'
import type {
  StudentOnboardingFlowActionInput,
  StudentOnboardingFlowLoaderData,
} from '@/types/student'
import { getSubjectContext } from '@/utils/themes'
import {
  type OnboardingFlowAnswerMap,
  type OnboardingFlowQuestion,
  getNextOnboardingFlowState,
  getOnboardingFlowProgress,
  getPreviousOnboardingFlowState,
  STUDENT_ONBOARDING_FLOW_QUESTIONS,
} from './components/onboardingQuestionFlow'

type StudentOnboardingFlowRouteState = {
  assessmentId?: StudentOnboardingFlowLoaderData['assessmentId']
  initialAnswersByQuestionId?: StudentOnboardingFlowLoaderData['initialAnswersByQuestionId']
  initialSubject?: SubjectContext
  questions?:
    | StudentOnboardingFlowLoaderData['questions']
    | OnboardingFlowQuestion[]
}

function StudentOnboardingFlowPage() {
  const location = useLocation()
  const loaderData = useLoaderData() as StudentOnboardingFlowLoaderData
  const routeState = {
    ...loaderData,
    ...((location.state ?? {}) as StudentOnboardingFlowRouteState),
  }
  const questions =
    routeState.questions && routeState.questions.length
      ? routeState.questions
      : STUDENT_ONBOARDING_FLOW_QUESTIONS
  const [answersByQuestionId, setAnswersByQuestionId] =
    useState<OnboardingFlowAnswerMap>(
      routeState.initialAnswersByQuestionId ?? {}
    )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = questions[currentQuestionIndex]
  const currentSubject = getSubjectContext(
    currentQuestion.subject,
    routeState.initialSubject ?? currentQuestion.subject
  )
  const selectedOptionId = answersByQuestionId[currentQuestion.id]
  const progress = getOnboardingFlowProgress({
    answersByQuestionId,
    questions,
  })
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  function saveAnswer(optionId: string): StudentOnboardingFlowActionInput {
    return {
      assessmentId: routeState.assessmentId ?? 'local-assessment',
      currentQuestionIndex,
      isCompleted: isLastQuestion,
      optionId,
      questionId: currentQuestion.id,
    }
  }

  function handleSelectOption(optionId: string) {
    const nextAnswer = saveAnswer(optionId)

    setAnswersByQuestionId(currentAnswers => ({
      ...currentAnswers,
      [nextAnswer.questionId]: nextAnswer.optionId,
    }))
  }

  function handleNextQuestion() {
    if (!selectedOptionId) {
      return
    }

    if (isLastQuestion) {
      setAnswersByQuestionId({})
      setCurrentQuestionIndex(0)
      return
    }

    const nextState = getNextOnboardingFlowState({
      answersByQuestionId,
      currentQuestionIndex,
      questions,
    })

    setCurrentQuestionIndex(nextState.currentQuestionIndex)
  }

  function handlePreviousQuestion() {
    if (isFirstQuestion) {
      return
    }

    const previousState = getPreviousOnboardingFlowState({
      answersByQuestionId,
      currentQuestionIndex,
      questions,
    })

    setCurrentQuestionIndex(previousState.currentQuestionIndex)
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Box className="grid gap-1">
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { md: 30, xs: 24 },
            fontWeight: 700,
          }}
        >
          Fluxo de Onboarding
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 768 }}>
        <OnboardingQuestionCard
          currentQuestion={currentQuestionIndex + 1}
          disableNext={!selectedOptionId}
          disablePreviousQuestion={isFirstQuestion}
          nextButtonLabel={isLastQuestion ? 'Reiniciar fluxo' : undefined}
          onNext={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          onSelectOption={handleSelectOption}
          options={currentQuestion.options}
          progress={progress}
          question={currentQuestion.question}
          questionOrderLabel={`${currentQuestionIndex + 1} / ${questions.length}`}
          selectedOptionId={selectedOptionId}
          subject={currentSubject}
          title="Questionário de Nivelamento"
          totalQuestions={questions.length}
        />
      </Box>
    </AppPageContainer>
  )
}

export default StudentOnboardingFlowPage
