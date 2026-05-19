import type {
  UploadApprovalItem,
  UploadApprovalStatus,
} from '../../types/upload'

export interface StudentUploadDto {
  id: string
  student_id: string
  student_name?: string
  file_name: string
  download_url: string
  file_type: string
  file_size_bytes: number
  created_at: string | null
  status?: UploadApprovalStatusDto
  activity_type?: UploadActivityTypeDto | null
  subject?: {
    id: string
    name: string
    slug?: string | null
    color?: string | null
  } | null
}

export type UploadApprovalStatusDto =
  | 'pending'
  | 'in_review'
  | 'correction_in_progress'
  | 'corrected'
  | 'rejected'

export type UploadActivityTypeDto = 'exercise' | 'essay' | 'activity'

const uploadActivityTypeLabel: Record<UploadActivityTypeDto, string> = {
  activity: 'Atividade',
  essay: 'Redação',
  exercise: 'Exercício',
}

export interface UploadQueueResponseDto {
  items: StudentUploadDto[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

const uploadStatusMap: Record<UploadApprovalStatusDto, UploadApprovalStatus> = {
  corrected: 'corrected',
  correction_in_progress: 'correctionInProgress',
  in_review: 'inReview',
  pending: 'pending',
  rejected: 'rejected',
}

export function formatBrazilianDate(value: string | null): string {
  if (!value) return 'Data desconhecida'
  const datePart = value.split('T')[0] ?? value
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function mapStudentUploadToUploadApprovalItem(
  dto: StudentUploadDto,
  studentName = dto.student_name ?? 'Aluno',
  status: UploadApprovalStatus = dto.status
    ? uploadStatusMap[dto.status]
    : 'pending'
): UploadApprovalItem {
  const uploadedAt = formatBrazilianDate(dto.created_at)
  const activityType = dto.activity_type ?? 'activity'

  const subjectBadge = dto.subject
    ? [
        {
          id: `${dto.id}-subject`,
          label: dto.subject.name,
          tone: 'info' as const,
        },
      ]
    : []

  return {
    id: dto.id,
    studentId: dto.student_id,
    studentName,
    fileName: dto.file_name,
    fileType: dto.file_type,
    downloadUrl: dto.download_url,
    activityType,
    status,
    uploadedAt,
    subject: dto.subject ?? null,
    badges: [
      {
        id: `${dto.id}-student`,
        label: studentName,
        tone: 'neutral',
      },
      ...subjectBadge,
      {
        id: `${dto.id}-activity-type`,
        label: uploadActivityTypeLabel[activityType],
        tone: 'info',
      },
      {
        id: `${dto.id}-date`,
        label: `Enviado em ${uploadedAt}`,
        tone: 'info',
      },
    ],
  }
}

export function mapUploadQueueResponse(response: UploadQueueResponseDto) {
  return {
    currentPage: response.page,
    items: response.items.map(item =>
      mapStudentUploadToUploadApprovalItem(item)
    ),
    pageSize: response.page_size,
    totalItems: response.total_items,
    totalPages: response.total_pages,
  }
}
