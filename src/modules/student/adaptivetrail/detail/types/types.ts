import type {
  AdaptiveTrailQuestion,
  AdaptiveTrailSession,
} from '@/modules/student/adaptivetrail/types/types'

export interface SubjectApiResponse {
  id: string
  label: string
  color?: string
}

export interface SubStepApiResponse {
  id: string
  item_id?: string
  item_ids?: string[]
  kind: 'video' | 'text' | 'question'
  title: string
  order: number
  status: 'available' | 'completed' | 'locked'
  questions: unknown[]
}

export interface StepAnswer {
  exercise_id: number
  option_id: number
}

export interface StepComplete {
  answers: StepAnswer[]
}

export interface ValidateAnswerApiResponse {
  exercise_id: number
  option_id: number
  correct: boolean
}

export interface StepApiResponse {
  id: string
  title: string
  description?: string
  order: number
  status: 'available' | 'completed' | 'locked'
  sub_steps: SubStepApiResponse[]
}

export interface TrailDetailApiResponse {
  id: string
  title: string
  description: string
  subject: SubjectApiResponse
  progress: number
  completed_steps: number
  level_label: string | null
  time_estimate: string | null
  steps: StepApiResponse[]
}

export interface ItemCompletionApiResponse extends TrailDetailApiResponse {
  last_completion?: { correct: number; total: number; passed: boolean }
}

export interface SubStepCompletionApiResponse extends ItemCompletionApiResponse {
  current_sub_path: number
  path_status: 'on_going' | 'completed' | 'paused' | null
}

export interface QuestionFlowApiResponse {
  assessmentId: string
  trailId: string
  stepId: string
  subStepId: string
  stepTitle: string
  questions: Array<{
    id: string
    question: string
    options: Array<{ id: string; label: string }>
    subject: SubjectApiResponse
  }>
}

export interface StepCompletionApiResponse {
  correct: number
  total: number
  passed: boolean
  current_sub_path: number
  path_status: 'on_going' | 'completed' | 'paused' | null
}

export interface ItemCompletionResult {
  correct: number
  total: number
  passed: boolean
  session: AdaptiveTrailSession
}

export interface SubStepCompletionResult {
  result: StepCompletionResult
  session: AdaptiveTrailSession
}

export type PathStatus = 'on_going' | 'completed' | 'paused' | null

export interface TrailStepQuestionFlow {
  assessmentId: string
  itemId: string
  questions: AdaptiveTrailQuestion[]
  stepId: string
  subStepId: string
  stepTitle: string
  trailId: string
}

export interface StepAnswerPayload {
  exerciseId: string
  optionId: string
}

export interface ValidateAnswerResult {
  exerciseId: string
  optionId: string
  correct: boolean
}

export interface StepCompletionResult {
  correct: number
  total: number
  passed: boolean
  currentSubPath: number
  pathStatus: PathStatus
}
