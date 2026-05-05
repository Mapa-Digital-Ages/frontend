export interface UploadItem {
  id: string
  student_id: string
  file_name: string
  download_url: string
  file_type: string
  file_size_bytes: number
  created_at: string
}

export type UploadListResponse = UploadItem[]
