import type { SubjectContext } from '@/shared/types/common'

export type Status = 'done' | 'pending' | 'overdue'

export type Task = {
  id: string
  question: string
  options: Array<{
    id: string
    label: string
  }>
  subject: SubjectContext
}

export type StudentComponentsLoaderData = {
  availableComponents: {
    onboardingQuestionCard: boolean
    progressBar: boolean
    subjectBaseCard: boolean
  }
  subjects: SubjectContext[]
}

export type QuestionFlowPayload = {
  id: string
  options: Array<{
    id: string
    label: string
  }>
  question: string
  subject: SubjectContext
}

export type QuestionFlowLoaderData = {
  assessmentId: string
  initialAnswersByQuestionId?: Record<string, string>
  initialSubject?: SubjectContext
  questions: QuestionFlowPayload[]
}

export type QuestionFlowActionInput = {
  assessmentId: string
  currentQuestionIndex: number
  isCompleted?: boolean
  optionId: string
  questionId: string
}

export type StudentOnboardingFlowLoaderData = QuestionFlowLoaderData
export type StudentOnboardingFlowActionInput = QuestionFlowActionInput
