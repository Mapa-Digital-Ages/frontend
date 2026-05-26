export interface UploadItem {
  id: string
  student_id: string
  subject_id: number | null
  file_name: string
  download_url: string
  file_type: string
  activity_type?: string
  status?: string
  file_size_bytes: number
  created_at: string
}

export type UploadListResponse = UploadItem[]
