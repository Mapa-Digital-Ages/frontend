import type { ReactNode } from 'react'
import type { SubjectContext } from '@/shared/types/common'

export type ApprovalType = 'content' | 'parent'
export type ApprovalModalAction = 'correct' | 'create' | 'delete' | 'edit'
export type ApprovalCorrectionOutcome =
  | 'completed'
  | 'completedWithNotes'
  | 'redo'

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
  priority?: 'primary' | 'secondary'
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
  | 'correctionInProgress'
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

export type ParentApprovalStatus = 'pendingValidation' | 'approved' | 'rejected'

export interface ParentApprovalValidation {
  hasDocument: boolean
  relationshipConfirmed: boolean
  studentLinked: boolean
}

export interface ParentApprovalItem extends BaseApprovalItem {
  id: string
  kind: 'parent'
  roleLabel?: string
  status: ParentApprovalStatus
  guardian?: GuardianItem
  childName?: string
  name?: {
    firstName: string
    lastName: string
  }
  validation: ParentApprovalValidation
}

export type ApprovalItem = ContentApprovalItem | ParentApprovalItem

export type ApprovalStatus =
  | ContentApprovalStatus
  | ParentApprovalStatus
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

export interface GuardianItem {
  email: string
  first_name: string
  last_name: string
  password?: string
  phone_number: string
}

export interface ParentApprovalDraftInput {
  student?: string
  email?: string
  first_name?: string
  last_name?: string
  password?: string
  phone_number?: string
  guardian?: GuardianItem
  requestedAt?: string
  title?: string
}

export interface ApprovalCorrectionInput {
  feedback: string
  outcome: ApprovalCorrectionOutcome
}

export type ContentCorrectionStatus = 'pending' | 'inProgress' | 'completed'

export type ContentCorrectionMessageAuthor = 'admin' | 'aluno'

export interface ContentCorrectionMessage {
  author: ContentCorrectionMessageAuthor
  body: string
  createdAt: string
  id: string
}

export interface ContentCorrectionSession {
  contentId: string
  messages: ContentCorrectionMessage[]
  requestedAt?: string
  resourceType?: ContentApprovalResourceType
  status: ContentCorrectionStatus
  subject?: SubjectContext
  subtitle?: string
  title: string
  uploadFileName: string
  uploadPreviewUrl?: string
}

export interface ContentCorrectionMessageInput {
  body: string
}

export type ApprovalActionModalMode = {
  action: Exclude<ApprovalModalAction, 'correct'>
  item?: ApprovalItem
  type: ApprovalType
}

export interface ContentApprovalActionFormValues {
  type: 'content'
  requestedAt: string
  resourceType: ContentApprovalResourceType
  subjectId: string
  title: string
}

export interface GuardianApprovalActionFormValues {
  type: 'parent'
  childName?: string
  email: string
  first_name: string
  last_name: string
  password: string
  phone_number: string
}

export type ApprovalActionFormValues =
  | ContentApprovalActionFormValues
  | GuardianApprovalActionFormValues
