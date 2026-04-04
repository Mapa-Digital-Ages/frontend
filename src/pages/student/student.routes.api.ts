import type { SubjectContext } from '@/types/common'

export type StudentComponentsLoaderData = {
  availableComponents: {
    onboardingQuestionCard: boolean
    progressBar: boolean
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

// Future route loader for APP_ROUTES.student.components
//
// Responsibilities:
// - fetch the discipline catalog used by the component showcase
// - fetch feature flags or availability for the student component previews
//
// Example:
// export async function studentComponentsLoader(): Promise<StudentComponentsLoaderData> {
//   return studentService.getComponentCatalog()
// }

// Future route loader for APP_ROUTES.student.onboardingFlow
//
// Responsibilities:
// - fetch the onboarding assessment metadata
// - fetch the question list rendered by StudentOnboardingFlowPage
// - fetch previously saved answers when the student resumes the flow
//
// Example:
// export async function studentOnboardingFlowLoader({
//   request,
// }: LoaderFunctionArgs): Promise<StudentOnboardingFlowLoaderData> {
//   const url = new URL(request.url)
//   const assessmentId = url.searchParams.get('assessmentId')
//
//   if (!assessmentId) {
//     throw new Response('Assessment not found', { status: 400 })
//   }
//
//   return studentService.getOnboardingAssessment(assessmentId)
// }

// Future route action for APP_ROUTES.student.onboardingFlow
//
// Responsibilities:
// - persist the selected answer after each step
// - allow partial save while the student advances through the flow
// - finalize the onboarding attempt after the last answer
//
// Example:
// export async function studentOnboardingFlowAction({
//   request,
// }: ActionFunctionArgs) {
//   const payload =
//     (await request.json()) as StudentOnboardingFlowActionInput
//
//   return studentService.saveOnboardingAnswer(payload)
// }
