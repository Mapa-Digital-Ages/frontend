export type {
  ParentChild,
  SummaryMetric,
  WeeklyMoodEntry,
} from '@/shared/types/common'
import type { SummaryMetric, WeeklyMoodEntry } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

export interface ParentChildren {
  id: string
  name: string
  grade: string
  status?: string
}

export type ParentDashboardChild = ParentChildren

export interface StudentDisciplineProgress {
  subjectId: string
  subjectLabel: string
  progress: number
}

export interface ParentDashboardData {
  child: ParentChildren | null
  children: ParentChildren[]
  metrics: SummaryMetric[]
  disciplines: StudentDisciplineProgress[]
  tasks: Task[]
  wellBeing: WeeklyMoodEntry[]
}

export type Status = ParentStatus | StudentStatus | 'all'

export type ParentStatus =
  | 'inReview'
  | 'correctionInProgress'
  | 'sent'
  | 'approved'
  | 'rejected'

export type StudentStatus = 'pendingValidation' | 'approved' | 'rejected'

export interface ResultsSummary {
  count: number
  customLabel?: string
  pluralLabel: string
  singularLabel: string
}

export interface Filter {
  query: string
  status: Status
}

export interface ChildQueueQuery extends Filter {
  page: number
  pageSize: number
}

export interface ChildQueueResult<TItem> {
  currentPage: number
  items: TItem[]
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ChildItem extends ParentChildren {
  id: string
  roleLabel?: string
  status: Status
  childName: string
  grade: string
}
