import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import { invalidateStudentListCache } from '@/modules/admin/student/services/listCache'
import {
  buildGuardianListQuery,
  mapGuardianResponseToParentApprovalItem,
  mapParentStatusToGuardianStatusDto,
  type GuardianListPaginatedDto,
  type GuardianResponseDto,
} from './mapper'

export type ParentApprovalApiClient = {
  delete<T>(path: string): Promise<ApiResponse<T>>
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
  ): Promise<ApiResponse<T>>
}

export interface CreateParentApprovalRepositoryOptions {
  client: ParentApprovalApiClient
}

function buildGuardianPath(guardianId: string) {
  return `guardian/${encodeURIComponent(guardianId)}`
}

function buildGuardianRegistrationPayload(input: ParentApprovalDraftInput) {
  const guardian = input.guardian!
  return {
    email: guardian.email,
    first_name: guardian.first_name.trim(),
    last_name: guardian.last_name.trim(),
    password: guardian.password,
    phone_number: guardian.phone_number.trim(),
  }
}

function buildGuardianUpdatePayload(input: ParentApprovalDraftInput) {
  const guardian = input.guardian!
  return {
    email: guardian.email,
    first_name: guardian.first_name.trim(),
    last_name: guardian.last_name.trim(),
    phone_number: guardian.phone_number.trim(),
  }
}

export function createParentApprovalRepository({
  client,
}: CreateParentApprovalRepositoryOptions) {
  return {
    async getParentQueue(
      query: ApprovalQueueQuery
    ): Promise<ApprovalQueueResult<ParentApprovalItem>> {
      const response = await client.get<GuardianListPaginatedDto>('guardian', {
        query: buildGuardianListQuery(query),
      })

      return {
        currentPage: response.data.page,
        items: response.data.items.map(mapGuardianResponseToParentApprovalItem),
        pageSize: response.data.size,
        totalItems: response.data.total,
        totalPages: Math.max(
          1,
          Math.ceil(response.data.total / response.data.size)
        ),
      }
    },

    async createParentRegistration(
      input: ParentApprovalDraftInput
    ): Promise<void> {
      await client.post<unknown>(
        'register/guardian',
        buildGuardianRegistrationPayload(input),
        { skipAuth: true }
      )
      invalidateStudentListCache()
    },

    async updateParentRegistration(
      guardianId: string,
      input: ParentApprovalDraftInput
    ): Promise<void> {
      await client.patch<unknown>(
        buildGuardianPath(guardianId),
        buildGuardianUpdatePayload(input)
      )
      invalidateStudentListCache()
    },

    async removeParentRegistration(guardianId: string): Promise<void> {
      await client.delete<unknown>(buildGuardianPath(guardianId))
      invalidateStudentListCache()
    },

    async updateParentStatus(
      guardianId: string,
      status: ParentApprovalStatus
    ): Promise<ParentApprovalItem> {
      await client.patch<unknown>(
        `admin/users/${encodeURIComponent(guardianId)}/status`,
        { status: mapParentStatusToGuardianStatusDto(status) }
      )
      invalidateStudentListCache()
      const refreshed = await client.get<GuardianResponseDto>(
        buildGuardianPath(guardianId)
      )
      return mapGuardianResponseToParentApprovalItem(refreshed.data)
    },
  }
}
