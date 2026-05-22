import type { SubjectContext } from '@/shared/types/common'
import type {
  QuestionFlowActionInput,
  QuestionFlowPayload,
} from '@/modules/student/shared/types/types'

export type AdaptiveTrailStepKind = 'video' | 'text' | 'question'
export type AdaptiveTrailStepStatus = 'available' | 'completed' | 'locked'

export interface AdaptiveTrailContentBlock {
  body: string
  title: string
}

export interface AdaptiveTrailStep {
  content: AdaptiveTrailContentBlock
  duration: string
  id: string
  kind: AdaptiveTrailStepKind
  lockReason?: string
  order: number
  questions: QuestionFlowPayload[]
  status: AdaptiveTrailStepStatus
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
  questions: QuestionFlowPayload[]
  stepId: string
  stepTitle: string
  trailId: string
}

export type TrailStepAnswerInput = QuestionFlowActionInput
