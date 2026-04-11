import type { SubjectContext } from '@/types/common'

export type StudentComponentsLoaderData = {
  availableComponents: {
    onboardingQuestionCard: boolean
    progressBar: boolean
    subjectBaseCard: boolean
  }
  subjects: SubjectContext[]
}

export type StudentOnboardingFlowQuestionPayload = {
  id: string
  options: Array<{
    id: string
    label: string
  }>
  question: string
  subject: SubjectContext
}

export type StudentOnboardingFlowLoaderData = {
  assessmentId: string
  initialAnswersByQuestionId?: Record<string, string>
  initialSubject?: SubjectContext
  questions: StudentOnboardingFlowQuestionPayload[]
}

export type StudentOnboardingFlowActionInput = {
  assessmentId: string
  currentQuestionIndex: number
  isCompleted?: boolean
  optionId: string
  questionId: string
}
