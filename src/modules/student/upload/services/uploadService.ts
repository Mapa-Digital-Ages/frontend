import { COOKIE_KEYS } from '@/shared/constants/storage'
import { HttpRequestError, httpClient } from '@/shared/lib/http/client'
import { getCookie } from '@/shared/lib/storage/cookies'
import type { UploadItem, UploadListResponse } from '../types/types'

const env = (
  import.meta as ImportMeta & {
    env?: Record<string, string | undefined>
  }
).env

const baseUrl = String(env?.VITE_API_BASE_URL ?? 'http://localhost:8000/')

function getAuthHeaders(): HeadersInit {
  const token = getCookie(COOKIE_KEYS.authToken)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url : `${url}/`
}

export type StudentUploadActivityType = 'exercise' | 'essay' | 'activity'

export interface SubjectDirectoryItem {
  id: number
  slug: string | null
  name: string
  color: string | null
}

interface SubjectListDto {
  id: number | string
  slug?: string | null
  name: string
  color?: string | null
}

export const uploadService = {
  async uploadStudentFile(
    studentId: string,
    file: File,
    activityType: StudentUploadActivityType,
    subjectId?: number | null
  ): Promise<UploadItem> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('activity_type', activityType)
    if (subjectId != null) {
      formData.append('subject_id', String(subjectId))
    }

    const response = await fetch(
      `${normalizeBaseUrl(baseUrl)}student/${encodeURIComponent(studentId)}/uploads`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      }
    )

    if (!response.ok) {
      throw new HttpRequestError(response.status, response.statusText, response)
    }

    return response.json() as Promise<UploadItem>
  },

  async listStudentUploads(
    studentId: string,
    page = 1,
    size = 50
  ): Promise<UploadListResponse> {
    const response = await httpClient.get<UploadListResponse>(
      `student/${encodeURIComponent(studentId)}/uploads`,
      { query: { page, size } }
    )
    return response.data
  },

  async listSubjects(): Promise<SubjectDirectoryItem[]> {
    const response = await httpClient.get<SubjectListDto[]>('subjects')
    return response.data.map(dto => ({
      id: Number(dto.id),
      slug: dto.slug ?? null,
      name: dto.name,
      color: dto.color ?? null,
    }))
  },

  async getUpload(uploadId: string): Promise<UploadItem> {
    const response = await httpClient.get<UploadItem>(`uploads/${uploadId}`)
    return response.data
  },

  getContentUrl(uploadId: string): string {
    return `${normalizeBaseUrl(baseUrl)}uploads/${encodeURIComponent(uploadId)}/content`
  },

  async downloadUploadContent(uploadId: string): Promise<Blob> {
    const token = getCookie(COOKIE_KEYS.authToken)
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {}

    const response = await fetch(
      `${normalizeBaseUrl(baseUrl)}uploads/${encodeURIComponent(uploadId)}/content`,
      { headers }
    )

    if (!response.ok) {
      throw new HttpRequestError(response.status, response.statusText, response)
    }

    return response.blob()
  },
}
