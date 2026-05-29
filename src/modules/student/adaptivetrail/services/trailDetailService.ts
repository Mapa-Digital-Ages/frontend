import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type { TagContext } from '@/shared/types/common'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
  RecommendedContent,
  TrailStepAnswerInput,
  TrailStepCompletionResult,
  TrailStepQuestionFlow,
} from '../types/types'

interface SubStepApiResponse {
  id: string
  kind: 'resource' | 'question'
  title: string
  order: number
  status: 'available' | 'completed' | 'locked'
  questions: unknown[]
}

interface StepApiResponse {
  id: string
  title: string
  description?: string
  order: number
  status: 'available' | 'completed' | 'locked'
  sub_steps: SubStepApiResponse[]
}

interface TrailDetailApiResponse {
  id: string
  title: string
  description: string
  subject: { id: string; label: string; color?: string }
  progress: number
  completed_steps: number
  level_label: string | null
  time_estimate: string | null
  steps: StepApiResponse[]
}

function mapSubStep(raw: SubStepApiResponse): AdaptiveTrailSubStep {
  return {
    id: raw.id,
    kind: raw.kind === 'question' ? 'question' : 'video',
    title: raw.title,
    description: '',
    order: raw.order,
    status: raw.status,
    questions: [],
  }
}

function mapStep(raw: StepApiResponse): AdaptiveTrailStep {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    order: raw.order,
    status: raw.status,
    subSteps: raw.sub_steps.map(mapSubStep),
  }
}

function mapSession(raw: TrailDetailApiResponse): AdaptiveTrailSession {
  const subject: TagContext = {
    id: raw.subject.id,
    label: raw.subject.label,
    color: raw.subject.color,
  }
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    subject,
    progress: raw.progress,
    completedSteps: raw.completed_steps,
    levelLabel: raw.level_label ?? '',
    timeEstimate: raw.time_estimate ?? '',
    steps: raw.steps.map(mapStep),
  }
}

export const adaptiveTrailDetailService = {
  async getTrailSession(trailId: string): Promise<AdaptiveTrailSession | null> {
    const studentId = authService.getUserId()
    if (!studentId) return null

    try {
      const response = await httpClient.get<TrailDetailApiResponse>(
        `student/${studentId}/trails/${trailId}`
      )
      return mapSession(response.data)
    } catch {
      return null
    }
  },

  async getSubStepQuestionFlow(
    _trailId: string,
    _stepId: string,
    _subStepId: string
  ): Promise<TrailStepQuestionFlow> {
    throw new Error('Question flow not yet implemented')
  },

  async saveStepAnswer(_input: TrailStepAnswerInput): Promise<void> {
    return Promise.resolve()
  },

  async getCompletionRecommendations(
    _trailId: string,
    stepTitle: string,
    correct: number,
    total: number
  ): Promise<TrailStepCompletionResult> {
    return {
      stepTitle,
      correct,
      total,
      subject: { label: '' },
      trailTitle: '',
      recommendedTrails: [],
      recommendedContent: [] as RecommendedContent[],
    }
  },
}
