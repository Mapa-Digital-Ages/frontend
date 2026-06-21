import type { SubjectContext } from '@/shared/types/common'

export type { FilterOption } from '@/modules/student/shared/types/types'

export interface ContentTrail {
  articleCount: number
  completedSteps: number
  description: string
  id: string
  name: string
  progress: number
  steps: number
  subject?: SubjectContext
  timeEstimate: string
  videoCount: number
}
