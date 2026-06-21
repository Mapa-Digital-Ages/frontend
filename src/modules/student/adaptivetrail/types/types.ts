import type { SubjectContext, TagContext } from '@/shared/types/common'
import type { QuestionFlowPayload } from '@/modules/student/shared/types/types'

export type { SummaryMetric, StudentTask } from '@/shared/types/common'

export type { FilterOption } from '@/modules/student/shared/types/types'

export type AdaptiveTrailStepKind = 'video' | 'text' | 'question'
export type AdaptiveTrailStepStatus = 'available' | 'completed' | 'locked'

export type AdaptiveTrailQuestion = QuestionFlowPayload

export interface AdaptiveTrailSubStep {
  order: number
  description: string
  duration?: string
  id: string
  itemId?: string
  itemIds?: string[]
  kind: AdaptiveTrailStepKind
  lockReason?: string
  questions: AdaptiveTrailQuestion[]
  status: AdaptiveTrailStepStatus
  title: string
}

export interface AdaptiveTrailStep {
  description?: string
  id: string
  lockReason?: string
  order: number
  status: AdaptiveTrailStepStatus
  subSteps: AdaptiveTrailSubStep[]
  title: string
}

export interface AdaptiveTrailSession {
  completedSteps: number
  description: string
  id: string
  levelLabel: string
  progress: number
  steps: AdaptiveTrailStep[]
  subject: SubjectContext
  timeEstimate: string
  title: string
}

export interface TrailStepQuestionFlow {
  assessmentId: string
  initialAnswersByQuestionId?: Record<string, string>
  itemId: string
  questions: AdaptiveTrailQuestion[]
  stepId: string
  subStepId: string
  stepTitle: string
  trailId: string
}

export type TrailStepAnswerInput = {
  assessmentId: string
  currentQuestionIndex: number
  isCompleted?: boolean
  optionId: string
  questionId: string
}

export interface RecommendedContent {
  id: string
  title: string
  description: string
  kind: 'video' | 'text'
}

export interface TrailStepCompletionResult {
  stepTitle: string
  correct: number
  total: number
  subject: SubjectContext
  trailTitle: string
  recommendedTrails: Array<{
    id: string
    name: string
    subject?: SubjectContext
    steps: number
    timeEstimate: string
  }>
  recommendedContent: RecommendedContent[]
}
