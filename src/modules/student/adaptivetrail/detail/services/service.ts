import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
} from '../../types/types'
import type {
  ItemCompletionApiResponse,
  ItemCompletionResult,
  QuestionFlowApiResponse,
  StepAnswerPayload,
  StepApiResponse,
  StepCompletionApiResponse,
  StepCompletionResult,
  SubStepApiResponse,
  TrailDetailApiResponse,
  TrailStepQuestionFlow,
  ValidateAnswerApiResponse,
  ValidateAnswerResult,
} from '../types/types'

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
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    subject: {
      id: raw.subject.id,
      label: raw.subject.label,
      color: raw.subject.color,
    },
    progress: raw.progress,
    completedSteps: raw.completed_steps,
    levelLabel: raw.level_label ?? '',
    timeEstimate: raw.time_estimate ?? '',
    steps: raw.steps.map(mapStep),
  }
}

function mapQuestionFlow(raw: QuestionFlowApiResponse): TrailStepQuestionFlow {
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
}

function toAnswersPayload(answers: StepAnswerPayload[]) {
  return {
    answers: answers.map(a => ({
      exercise_id: a.exerciseId,
      option_id: a.optionId,
    })),
  }
}

function requireStudentId(): string {
  const studentId = authService.getUserId()
  if (!studentId) throw new Error('Usuário não autenticado.')
  return studentId
}

export const adaptiveTrailDetailService = {
  getStudentId(): string | null {
    return authService.getUserId()
  },

  async getSubjectTrailSessions(
    subjectId: string
  ): Promise<AdaptiveTrailSession[]> {
    const studentId = requireStudentId()
    const response = await httpClient.get<TrailDetailApiResponse[]>(
      `student/${studentId}/trails/subjects/${subjectId}`
    )
    return response.data.map(mapSession)
  },

  async getTrailSession(trailId: string): Promise<AdaptiveTrailSession> {
    const studentId = requireStudentId()
    const response = await httpClient.get<TrailDetailApiResponse>(
      `student/${studentId}/trails/${trailId}`
    )
    return mapSession(response.data)
  },

  async getSubStepQuestionFlow(
    trailId: string,
    stepId: string,
    _subStepId: string
  ): Promise<TrailStepQuestionFlow> {
    const studentId = requireStudentId()
    const response = await httpClient.get<QuestionFlowApiResponse>(
      `student/${studentId}/trails/${trailId}/steps/${stepId}/questions`
    )
    return mapQuestionFlow(response.data)
  },

  async completeStep(
    trailId: string,
    stepId: string,
    answers: StepAnswerPayload[]
  ): Promise<StepCompletionResult> {
    const studentId = requireStudentId()
    const response = await httpClient.post<StepCompletionApiResponse>(
      `student/${studentId}/trails/${trailId}/steps/${stepId}/complete`,
      toAnswersPayload(answers)
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

  async validateAnswer(
    trailId: string,
    stepId: string,
    answer: StepAnswerPayload
  ): Promise<ValidateAnswerResult> {
    const studentId = requireStudentId()
    const response = await httpClient.post<ValidateAnswerApiResponse>(
      `student/${studentId}/trails/${trailId}/steps/${stepId}/answers/validate`,
      {
        exercise_id: answer.exerciseId,
        option_id: answer.optionId,
      }
    )
    const d = response.data
    return {
      exerciseId: String(d.exercise_id),
      optionId: String(d.option_id),
      correct: d.correct,
    }
  },

  async completeItem(
    trailId: string,
    itemId: string,
    answers: StepAnswerPayload[]
  ): Promise<ItemCompletionResult> {
    const studentId = requireStudentId()
    const response = await httpClient.post<ItemCompletionApiResponse>(
      `student/${studentId}/trails/${trailId}/items/${itemId}/complete`,
      toAnswersPayload(answers)
    )
    const completion = response.data.last_completion ?? {
      correct: 0,
      total: 0,
      passed: false,
    }
    return {
      correct: completion.correct,
      total: completion.total,
      passed: completion.passed,
      session: mapSession(response.data),
    }
  },
}
