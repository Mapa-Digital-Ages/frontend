export type { CompanyStat } from '@/shared/types/common'

export type SupportRequestStatus =
  | 'aguardando'
  | 'pendente'
  | 'apoiada'
  | 'recusada'

export interface SupportRequest {
  /** ID of the originating SponsorshipRequest (used to create the partnership). */
  id: string
  schoolName: string
  title: string
  description: string
  status: SupportRequestStatus
  /** Spots still open on the request — upper bound for what the company can donate. */
  remainingSpots: number
}

export interface SupportedSchool {
  /** ID of the SchoolCompanyPartnership. */
  id: string
  schoolId: string
  schoolName: string
  description: string
  status: SupportRequestStatus
  grantedSpots: number
}
