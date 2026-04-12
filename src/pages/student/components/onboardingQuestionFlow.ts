import type { SubjectContext } from '../../../types/common'
import { SUBJECTS } from '../../../utils/themes'

type OnboardingFlowOption = {
  id: string
  label: string
}

export type OnboardingFlowQuestion = {
  id: string
  options: OnboardingFlowOption[]
  question: string
  subject: SubjectContext
}

export type OnboardingFlowAnswerMap = Record<string, string>

type OnboardingFlowInput = {
  answersByQuestionId: OnboardingFlowAnswerMap
  currentQuestionIndex: number
  questions: OnboardingFlowQuestion[]
}

export const STUDENT_ONBOARDING_FLOW_QUESTIONS: OnboardingFlowQuestion[] = [
  {
    id: 'question-1',
    options: [
      { id: 'question-1-option-1', label: '1' },
      { id: 'question-1-option-2', label: '4/8' },
      { id: 'question-1-option-3', label: '4/4' },
    ],
    question: 'Quanto é 3/4 + 1/4?',
    subject: SUBJECTS.matematica,
  },
  {
    id: 'question-2',
    options: [
      { id: 'question-2-option-1', label: 'Lisboa' },
      { id: 'question-2-option-2', label: 'Brasília' },
      { id: 'question-2-option-3', label: 'Porto Alegre' },
    ],
    question: 'Qual é a capital do Brasil?',
    subject: SUBJECTS.geografia,
  },
  {
    id: 'question-3',
    options: [
      { id: 'question-3-option-1', label: 'Substantivo' },
      { id: 'question-3-option-2', label: 'Verbo' },
      { id: 'question-3-option-3', label: 'Adjetivo' },
    ],
    question: 'A palavra “correr” é classificada como:',
    subject: SUBJECTS.portugues,
  },
]

export function getAnsweredQuestionsCount(
  answersByQuestionId: OnboardingFlowAnswerMap,
  questions: OnboardingFlowQuestion[]
) {
  return questions.reduce((answeredCount, question) => {
    return answersByQuestionId[question.id] ? answeredCount + 1 : answeredCount
  }, 0)
}

export function getOnboardingFlowProgress({
  answersByQuestionId,
  questions,
}: Pick<OnboardingFlowInput, 'answersByQuestionId' | 'questions'>) {
  if (!questions.length) {
    return 0
  }

  return Math.round(
    (getAnsweredQuestionsCount(answersByQuestionId, questions) /
      questions.length) *
      100
  )
}

export function getNextOnboardingFlowState({
  answersByQuestionId,
  currentQuestionIndex,
  questions,
}: OnboardingFlowInput) {
  const currentQuestion = questions[currentQuestionIndex]
  const canGoNext = Boolean(answersByQuestionId[currentQuestion.id])
  const nextQuestionIndex = canGoNext
    ? Math.min(currentQuestionIndex + 1, questions.length - 1)
    : currentQuestionIndex

  return {
    canGoNext,
    currentQuestion: questions[nextQuestionIndex],
    currentQuestionIndex: nextQuestionIndex,
    progress: getOnboardingFlowProgress({
      answersByQuestionId,
      questions,
    }),
  }
}

export function getPreviousOnboardingFlowState({
  answersByQuestionId,
  currentQuestionIndex,
  questions,
}: OnboardingFlowInput) {
  const previousQuestionIndex = Math.max(currentQuestionIndex - 1, 0)

  return {
    answersByQuestionId,
    currentQuestion: questions[previousQuestionIndex],
    currentQuestionIndex: previousQuestionIndex,
    progress: getOnboardingFlowProgress({
      answersByQuestionId,
      questions,
    }),
  }
}
