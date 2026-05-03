import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import {
  filterApprovalItems,
  paginateApprovalItems,
} from '@/modules/admin/parent/utils/utils'
import {
  buildParentApprovalQuery,
  mapParentApprovalUserToParentApprovalItem,
  mapParentStatusToParentApprovalUserStatus,
  type ParentApprovalUserDto,
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

function buildGuardianRegistrationPayload(input: ParentApprovalDraftInput) {
  return {
    email: input.email,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    password: input.password,
  }
}

function buildUserStatusPath(userId: string) {
  return `admin/users/${encodeURIComponent(userId)}/status`
}

function buildGuardianPath(guardianId: string) {
  return `guardian/${encodeURIComponent(guardianId)}`
}

export function createParentApprovalRepository({
  client,
}: CreateParentApprovalRepositoryOptions) {
  return {
    async getParentQueue(query: ApprovalQueueQuery) {
      const response = await client.get<ParentApprovalUserDto[]>(
        'admin/users',
        {
          query: buildParentApprovalQuery(query),
        }
      )
      const items = response.data.map(mapParentApprovalUserToParentApprovalItem)
      const filteredItems = filterApprovalItems(items, query)

      return paginateApprovalItems(filteredItems, query)
    },
    async createParentRegistration(
      input: ParentApprovalDraftInput
    ): Promise<void> {
      await client.post<unknown>(
        'register/guardian',
        buildGuardianRegistrationPayload(input),
        { skipAuth: true }
      )
    },
    async updateParentRegistration(
      guardianId: string,
      input: ParentApprovalDraftInput
    ): Promise<void> {
      await client.patch<unknown>(buildGuardianPath(guardianId), {
        first_name: input.first_name.trim(),
        last_name: input.last_name.trim(),
      })
    },
    async removeParentRegistration(guardianId: string): Promise<void> {
      await client.delete<unknown>(buildGuardianPath(guardianId))
    },
    async updateParentStatus(
      userId: string,
      status: ParentApprovalStatus
    ): Promise<ParentApprovalItem> {
      const response = await client.patch<ParentApprovalUserDto>(
        buildUserStatusPath(userId),
        {
          status: mapParentStatusToParentApprovalUserStatus(status),
        }
      )

      return mapParentApprovalUserToParentApprovalItem(response.data)
    },
  }
}
