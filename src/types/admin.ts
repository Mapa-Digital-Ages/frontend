import type { ReactNode } from 'react'
import type { SubjectContext } from './common'

export type ApprovalType = 'content' | 'guardian'
export type ApprovalModalAction = 'correct' | 'create' | 'delete' | 'edit'

export type ApprovalBadgeTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export interface ApprovalBadge {
  id: string
  label: string
  tone: ApprovalBadgeTone
}

export interface ApprovalCardStatus {
  label: string
  tone: ApprovalBadgeTone
}

export type ApprovalCardHelperTone = ApprovalBadgeTone

export interface ApprovalCardHelperText {
  text: string
  tone: ApprovalCardHelperTone
}

export interface ApprovalCardAction {
  accentColor?: string
  disabled?: boolean
  icon: ReactNode
  id: string
  label: string
  onClick: () => void
  tooltip?: string
}

export interface ApprovalResultsSummary {
  count: number
  customLabel?: string
  pluralLabel: string
  singularLabel: string
}

interface BaseApprovalItem {
  id: string
  requestedAt?: string
  title: string
  subtitle?: string
  badges: ApprovalBadge[]
}

export type ContentApprovalResourceType = 'exam' | 'task'
export type ContentApprovalStatus =
  | 'inReview'
  | 'sent'
  | 'approved'
  | 'rejected'

export interface ContentApprovalItem extends BaseApprovalItem {
  id: string
  kind: 'content'
  resourceType?: ContentApprovalResourceType
  status: ContentApprovalStatus
  subject?: SubjectContext
}

export type GuardianApprovalStatus =
  | 'pendingValidation'
  | 'approved'
  | 'rejected'

export interface GuardianApprovalValidation {
  hasDocument: boolean
  relationshipConfirmed: boolean
  studentLinked: boolean
}

export interface GuardianApprovalItem extends BaseApprovalItem {
  id: string
  kind: 'guardian'
  roleLabel?: string
  status: GuardianApprovalStatus
  childName: string
  validation: GuardianApprovalValidation
}

export type ApprovalItem = ContentApprovalItem | GuardianApprovalItem

export type ApprovalStatus =
  | ContentApprovalStatus
  | GuardianApprovalStatus
  | 'all'

export interface ApprovalFilter {
  query: string
  status: ApprovalStatus
}

export interface ApprovalQueueQuery extends ApprovalFilter {
  page: number
  pageSize: number
}

export interface ApprovalQueueResult<TItem> {
  currentPage: number
  items: TItem[]
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ContentApprovalDraftInput {
  requestedAt?: string
  resourceType: ContentApprovalResourceType
  subject?: SubjectContext
  title: string
}

export interface GuardianApprovalDraftInput {
  childName: string
  requestedAt?: string
  roleLabel: string
  title: string
}

export interface ApprovalCorrectionInput {
  note: string
}
