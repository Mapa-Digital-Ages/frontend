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
} from '@/modules/admin/content/utils'
import {
  buildParentApprovalQuery,
  mapParentApprovalUserToParentApprovalItem,
  mapParentStatusToParentApprovalUserStatus,
  type ParentApprovalUserDto,
} from './mapper'

export type ParentApprovalApiClient = {
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

function buildUserStatusPath(email: string) {
  return `admin/users/${encodeURIComponent(email)}/status`
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
        'register',
        {
          email: input.email,
          name: input.title,
          password: input.password,
        },
        { skipAuth: true }
      )
    },
    async updateParentStatus(
      email: string,
      status: ParentApprovalStatus
    ): Promise<ParentApprovalItem> {
      const response = await client.patch<ParentApprovalUserDto>(
        buildUserStatusPath(email),
        {
          status: mapParentStatusToParentApprovalUserStatus(status),
        }
      )

      return mapParentApprovalUserToParentApprovalItem(response.data)
    },
  }
}
