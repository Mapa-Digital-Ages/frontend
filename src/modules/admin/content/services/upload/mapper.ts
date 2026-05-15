import type {
  UploadApprovalItem,
  UploadApprovalStatus,
} from '../../types/upload'

export interface StudentUploadDto {
  id: string
  student_id: string
  file_name: string
  download_url: string
  file_type: string
  file_size_bytes: number
  created_at: string | null
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
  studentName: string,
  status: UploadApprovalStatus = 'pending'
): UploadApprovalItem {
  const uploadedAt = formatBrazilianDate(dto.created_at)

  return {
    id: dto.id,
    studentId: dto.student_id,
    studentName,
    fileName: dto.file_name,
    fileType: dto.file_type,
    downloadUrl: dto.download_url,
    activityType: undefined,
    status,
    uploadedAt,
    badges: [
      {
        id: `${dto.id}-student`,
        label: studentName,
        tone: 'neutral',
      },
      {
        id: `${dto.id}-date`,
        label: `Enviado em ${uploadedAt}`,
        tone: 'info',
      },
    ],
  }
}
