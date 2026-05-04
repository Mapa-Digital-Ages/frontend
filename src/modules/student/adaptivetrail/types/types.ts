import type { TagContext } from '@/shared/types/common'

export type { SummaryMetric, StudentTask } from '@/shared/types/common'

export interface FilterOption {
  label: string
  value: string
  subject: TagContext | null
}
