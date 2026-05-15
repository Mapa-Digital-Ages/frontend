export type UploadApprovalStatus =
  | 'pending'
  | 'inReview'
  | 'correctionInProgress'
  | 'corrected'
  | 'rejected'

export type UploadActivityType = 'exercise' | 'essay' | 'activity'

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
  badges: Array<{
    id: string
    label: string
    tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  }>
}

export interface UploadApprovalQuery {
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
