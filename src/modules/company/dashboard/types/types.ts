export type { CompanyStat } from '@/shared/types/common'

export type SupportRequestStatus = 'aguardando' | 'apoiada' | 'recusada'

export interface SupportRequest {
  id: string
  schoolName: string
  description: string
  status: SupportRequestStatus
}

export interface SupportedSchool {
  id: string
  schoolName: string
  description: string
  status: SupportRequestStatus
}
