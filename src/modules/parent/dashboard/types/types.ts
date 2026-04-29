export type {
  ParentChild,
  SummaryMetric,
  WeeklyMoodEntry,
} from '@/shared/types/common'
import type { SummaryMetric, WeeklyMoodEntry } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

export interface ParentDashboardChild {
  id: string
  name: string
  grade: string
}

export interface StudentDisciplineProgress {
  subjectId: string
  subjectLabel: string
  progress: number
}

export interface ParentDashboardData {
  child: ParentDashboardChild | null
  children: ParentDashboardChild[]
  metrics: SummaryMetric[]
  disciplines: StudentDisciplineProgress[]
  tasks: Task[]
  wellBeing: WeeklyMoodEntry[]
}
