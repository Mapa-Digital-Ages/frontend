import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ContentApprovalDraftInput,
  ContentCorrectionMessageInput,
  ContentCorrectionSession,
} from '@/modules/admin/shared/types/types'
import {
  buildApprovalQueueQuery,
  mapContentApprovalItem,
  mapContentApprovalQueueResponse,
  type ApprovalQueueResponseDto,
  type ContentApprovalDto,
} from './mapper'

export type ApprovalApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  post<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  delete<T>(path: string): Promise<ApiResponse<T>>
}

export interface CreateContentApprovalRepositoryOptions {
  client: ApprovalApiClient
}

function buildContentDraftPayload(input?: ContentApprovalDraftInput) {
  const subjectId = input?.subject?.id ? Number(input.subject.id) : undefined

  return {
    description: input?.description ?? '',
    ...(Number.isFinite(subjectId) ? { subject_id: subjectId } : {}),
    title: input?.title?.trim() || 'Novo conteúdo',
  }
}

export function createContentApprovalRepository({
  client,
}: CreateContentApprovalRepositoryOptions) {
  return {
    async getContentQueue(query: ApprovalQueueQuery) {
      const response = await client.get<
        ApprovalQueueResponseDto<ContentApprovalDto>
      >('admin/content', {
        query: buildApprovalQueueQuery(query),
      })

      return mapContentApprovalQueueResponse(response)
    },
    async createLocalContentDraft(input?: ContentApprovalDraftInput) {
      const response = await client.post<ContentApprovalDto>(
        'admin/content',
        buildContentDraftPayload(input)
      )

      return mapContentApprovalItem(response.data)
    },
    async updateLocalContentItem(id: string, input: ContentApprovalDraftInput) {
      const response = await client.patch<ContentApprovalDto>(
        `admin/content/${id}`,
        buildContentDraftPayload(input)
      )

      return mapContentApprovalItem(response.data)
    },
    async removeLocalContentItem(id: string) {
      await client.delete<unknown>(`admin/content/${id}`)
    },
    async getContentCorrectionSession(
      id: string
    ): Promise<ContentCorrectionSession> {
      return buildEmptyCorrectionSession(id)
    },
    async markContentCorrectionInProgress(
      id: string
    ): Promise<ContentCorrectionSession> {
      return { ...buildEmptyCorrectionSession(id), status: 'inProgress' }
    },
    async sendContentCorrectionMessage(
      id: string,
      _input: ContentCorrectionMessageInput
    ): Promise<ContentCorrectionSession> {
      return buildEmptyCorrectionSession(id)
    },
  }
}

function buildEmptyCorrectionSession(id: string): ContentCorrectionSession {
  return {
    contentId: id,
    status: 'pending',
    messages: [],
    requestedAt: '',
    subtitle: '',
    title: '',
    uploadFileName: '',
  }
}
