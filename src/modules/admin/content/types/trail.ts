import type { SubjectContext } from '@/shared/types/common'

export type AdminTrailActivityType = 'video' | 'text' | 'question'

export type AdminTrailDifficulty = '1' | '2' | '3'

export interface AdminTrailSubStepFormValues {
  id: string
  title: string
  description: string
  activityType: AdminTrailActivityType
  questionCount: string
  difficulty: AdminTrailDifficulty
}

export interface AdminTrailStepFormValues {
  id: string
  title: string
  description: string
  contentId: string
  subSteps: AdminTrailSubStepFormValues[]
}

export interface TrailCreationFormValues {
  title: string
  description: string
  subjectId: string
  eixo: string
  steps: AdminTrailStepFormValues[]
}

export interface AdaptiveTrailAdminStepItem {
  id: string
  order: number
  title: string
  description: string
  subSteps?: AdaptiveTrailAdminSubStepItem[]
  contentId: string
  contentTitle?: string
  activityType: AdminTrailActivityType
  questionCount?: number | null
  difficulty?: number | null
}

export interface AdaptiveTrailAdminSubStepItem {
  id: string
  order: number
  title: string
  description: string
  contentId: string
  contentTitle?: string
  activityType: AdminTrailActivityType
  questionCount?: number | null
  difficulty?: number | null
}

export interface AdaptiveTrailAdminItem {
  id: string
  title: string
  name: string
  description: string
  subject: SubjectContext
  subjectId: string
  eixo: string[]
  steps: AdaptiveTrailAdminStepItem[]
  stepCount: number
  questionCount: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateAdaptiveTrailSubStepPayload {
  order: number
  title: string
  description: string
  content_id: string
  activity: {
    type: AdminTrailActivityType
    question_count: number | null
    difficulty: number | null
  }
}

export interface CreateAdaptiveTrailStepPayload {
  order: number
  title: string
  description: string
  sub_steps: CreateAdaptiveTrailSubStepPayload[]
}

export interface CreateAdaptiveTrailPayload {
  title: string
  description: string
  subject_id: string
  eixo: string[]
  steps: CreateAdaptiveTrailStepPayload[]
}

export interface UpdateAdaptiveTrailPayload {
  title?: string
  description?: string
  subject_id?: string
  eixo?: string[]
  steps?: CreateAdaptiveTrailStepPayload[]
}
