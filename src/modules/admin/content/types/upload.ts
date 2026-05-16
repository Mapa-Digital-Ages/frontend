export type UploadApprovalStatus =
  | 'pending'
  | 'inReview'
  | 'correctionInProgress'
  | 'corrected'
  | 'rejected'

export type UploadActivityType = 'exercise' | 'essay' | 'activity'
export type UploadApprovalFilter =
  | UploadApprovalStatus
  | UploadActivityType
  | 'all'

export interface UploadApprovalItem {
  id: string
  studentId: string
  studentName: string
  fileName: string
  fileType: string
  downloadUrl: string
  activityType?: UploadActivityType
  status: UploadApprovalStatus
  uploadedAt: string
  subject?: {
    id: string
    name: string
    color?: string | null
    slug?: string | null
  } | null
  badges: Array<{
    id: string
    label: string
    tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  }>
}

export interface UploadApprovalQuery {
  activityType: UploadActivityType | 'all'
  page: number
  pageSize: number
  query: string
  status: UploadApprovalStatus | 'all'
}

export interface UploadApprovalResult {
  currentPage: number
  items: UploadApprovalItem[]
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface UploadEditFormValues {
  activityType: UploadActivityType
}
