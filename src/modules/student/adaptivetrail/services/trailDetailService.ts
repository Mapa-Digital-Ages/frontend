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
import { fetchTrails } from '../data/trails'

interface QuestionFlowApiResponse {
  assessmentId: string
  trailId: string
  stepId: string
  subStepId: string
  stepTitle: string
  questions: Array<{
    id: string
    question: string
    options: Array<{ id: string; label: string }>
    subject: { id: string; label: string; color?: string }
  }>
}

interface StepCompletionApiResponse {
  correct: number
  total: number
  passed: boolean
  current_sub_path: number
  path_status: 'on_going' | 'completed' | 'paused' | null
}

export interface StepAnswerPayload {
  exerciseId: string
  optionId: string
}

export interface StepCompletionApiResult {
  correct: number
  total: number
  passed: boolean
  currentSubPath: number
  pathStatus: 'on_going' | 'completed' | 'paused' | null
}

interface SubStepApiResponse {
  id: string
  item_id?: string
  item_ids?: string[]
  kind: 'video' | 'text' | 'question'
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

interface ItemCompletionApiResponse extends TrailDetailApiResponse {
  last_completion?: {
    correct: number
    total: number
    passed: boolean
  }
}

function mapSubStep(raw: SubStepApiResponse): AdaptiveTrailSubStep {
  return {
    id: raw.id,
    itemId: raw.item_id,
    itemIds: raw.item_ids,
    kind: raw.kind,
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

  async getSubjectTrailSessions(
    subjectId: string
  ): Promise<AdaptiveTrailSession[]> {
    const studentId = authService.getUserId()
    if (!studentId) return []

    const response = await httpClient.get<TrailDetailApiResponse[]>(
      `student/${studentId}/trails/subjects/${subjectId}`
    )
    return response.data.map(mapSession)
  },

  async getSubStepQuestionFlow(
    trailId: string,
    stepId: string,
    _subStepId: string
  ): Promise<TrailStepQuestionFlow> {
    const studentId = authService.getUserId()
    if (!studentId) throw new Error('Usuário não autenticado.')

    const response = await httpClient.get<QuestionFlowApiResponse>(
      `student/${studentId}/trails/${trailId}/steps/${stepId}/questions`
    )
    const raw = response.data
    return {
      assessmentId: raw.assessmentId,
      itemId: raw.subStepId,
      trailId: raw.trailId,
      stepId: raw.stepId,
      subStepId: raw.subStepId,
      stepTitle: raw.stepTitle,
      questions: raw.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        subject: {
          id: q.subject.id,
          label: q.subject.label,
          color: q.subject.color,
        },
      })),
    }
  },

  async saveStepAnswer(_input: TrailStepAnswerInput): Promise<void> {
    return Promise.resolve()
  },

  async completeStep(
    trailId: string,
    stepId: string,
    answers: StepAnswerPayload[]
  ): Promise<StepCompletionApiResult> {
    const studentId = authService.getUserId()
    if (!studentId) throw new Error('Usuário não autenticado.')

    const response = await httpClient.post<StepCompletionApiResponse>(
      `student/${studentId}/trails/${trailId}/steps/${stepId}/complete`,
      {
        answers: answers.map(a => ({
          exercise_id: a.exerciseId,
          option_id: a.optionId,
        })),
      }
    )
    const d = response.data
    return {
      correct: d.correct,
      total: d.total,
      passed: d.passed,
      currentSubPath: d.current_sub_path,
      pathStatus: d.path_status,
    }
  },

  async completeItem(
    trailId: string,
    itemId: string,
    answers: StepAnswerPayload[]
  ): Promise<{
    correct: number
    passed: boolean
    session: AdaptiveTrailSession
    total: number
  }> {
    const studentId = authService.getUserId()
    if (!studentId) throw new Error('Usuário não autenticado.')

    const response = await httpClient.post<ItemCompletionApiResponse>(
      `student/${studentId}/trails/${trailId}/items/${itemId}/complete`,
      {
        answers: answers.map(a => ({
          exercise_id: a.exerciseId,
          option_id: a.optionId,
        })),
      }
    )
    const completion = response.data.last_completion ?? {
      correct: 0,
      passed: false,
      total: 0,
    }
    return {
      correct: completion.correct,
      passed: completion.passed,
      session: mapSession(response.data),
      total: completion.total,
    }
  },

  async getCompletionRecommendations(
    trailId: string,
    stepTitle: string,
    correct: number,
    total: number
  ): Promise<TrailStepCompletionResult> {
    const studentId = authService.getUserId()
    const empty: TrailStepCompletionResult = {
      stepTitle,
      correct,
      total,
      subject: { label: '' },
      trailTitle: '',
      recommendedTrails: [],
      recommendedContent: [] as RecommendedContent[],
    }
    if (!studentId) return empty

    try {
      const trails = await fetchTrails(studentId)
      const current = trails.find(t => t.id === trailId)
      const subject = current?.subject ?? { label: '' }

      const recommendedTrails = trails
        .filter(t => t.id !== trailId && t.progress < 100)
        .filter(t => !current?.subject || t.subject?.id === current.subject?.id)
        .slice(0, 3)
        .map(t => ({
          id: t.id,
          name: t.name,
          subject: t.subject,
          steps: t.steps,
          timeEstimate: t.timeEstimate ?? '',
        }))

      return {
        stepTitle,
        correct,
        total,
        subject,
        trailTitle: current?.name ?? '',
        recommendedTrails,
        recommendedContent: [] as RecommendedContent[],
      }
    } catch {
      return empty
    }
  },
}
