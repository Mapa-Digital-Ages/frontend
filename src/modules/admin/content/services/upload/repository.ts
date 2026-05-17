import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  UploadActivityType,
  UploadApprovalItem,
  UploadApprovalQuery,
  UploadApprovalResult,
  UploadApprovalStatus,
} from '../../types/upload'
import {
  mapStudentUploadToUploadApprovalItem,
  mapUploadQueueResponse,
  type StudentUploadDto,
  type UploadQueueResponseDto,
} from './mapper'

export type UploadApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  delete<T>(path: string): Promise<ApiResponse<T>>
}

export interface CreateUploadApprovalRepositoryOptions {
  client: UploadApiClient
}

function toApiStatus(status: UploadApprovalStatus) {
  if (status === 'inReview') return 'in_review'
  if (status === 'correctionInProgress') return 'in_review'
  return status
}

export function createUploadApprovalRepository({
  client,
}: CreateUploadApprovalRepositoryOptions) {
  return {
    async getUploadQueue(
      query: UploadApprovalQuery
    ): Promise<UploadApprovalResult> {
      const response = await client.get<UploadQueueResponseDto>(
        'admin/uploads',
        {
          query: {
            activity_type:
              query.activityType === 'all' ? undefined : query.activityType,
            page: query.page,
            page_size: query.pageSize,
            query: query.query.trim() || undefined,
            status:
              query.status === 'all' ? undefined : toApiStatus(query.status),
          },
        }
      )

      return mapUploadQueueResponse(response.data)
    },

    async getUpload(id: string): Promise<UploadApprovalItem> {
      const response = await client.get<StudentUploadDto>(`admin/uploads/${id}`)
      return mapStudentUploadToUploadApprovalItem(response.data)
    },

    async getUploadDownloadUrl(id: string): Promise<{
      url: string
      expiresIn: number
      fileName: string
      fileType: string
      presigned: boolean
    }> {
      const response = await client.get<{
        url: string
        expires_in: number
        file_name: string
        file_type: string
        presigned: boolean
      }>(`uploads/${id}/download-url`)
      return {
        url: response.data.url,
        expiresIn: response.data.expires_in,
        fileName: response.data.file_name,
        fileType: response.data.file_type,
        presigned: response.data.presigned,
      }
    },

    async updateUploadStatus(
      id: string,
      status: UploadApprovalStatus
    ): Promise<UploadApprovalItem> {
      const response = await client.patch<StudentUploadDto>(
        `admin/uploads/${id}`,
        { status: toApiStatus(status) }
      )

      return mapStudentUploadToUploadApprovalItem(response.data)
    },

    async updateUploadActivityType(
      id: string,
      activityType: UploadActivityType
    ): Promise<UploadApprovalItem> {
      const response = await client.patch<StudentUploadDto>(
        `admin/uploads/${id}`,
        { activity_type: activityType }
      )

      return mapStudentUploadToUploadApprovalItem(response.data)
    },

    async removeUpload(id: string): Promise<void> {
      await client.delete<unknown>(`admin/uploads/${id}`)
    },
  }
}
