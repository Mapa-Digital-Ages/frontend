import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import { invalidateStudentListCache } from '@/modules/admin/student/services/listCache'
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

function getGuardianDraft(input: ParentApprovalDraftInput) {
  return (
    input.guardian ?? {
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      password: input.password,
      phone_number: input.phone_number,
    }
  )
}

function addTrimmedPayloadField(
  payload: Record<string, string>,
  field: string,
  value?: string
) {
  if (value === undefined) return

  const trimmed = value.trim()
  if (trimmed) {
    payload[field] = trimmed
  }
}

function buildGuardianRegistrationPayload(input: ParentApprovalDraftInput) {
  const guardian = getGuardianDraft(input)
  const payload: Record<string, string> = {}

  addTrimmedPayloadField(payload, 'email', guardian.email)
  addTrimmedPayloadField(payload, 'first_name', guardian.first_name)
  addTrimmedPayloadField(payload, 'last_name', guardian.last_name)
  addTrimmedPayloadField(payload, 'phone_number', guardian.phone_number)
  addTrimmedPayloadField(payload, 'student', input.student)
  if (guardian.password !== undefined) payload.password = guardian.password

  return payload
}

function buildGuardianUpdatePayload(input: ParentApprovalDraftInput) {
  const guardian = getGuardianDraft(input)
  const payload: Record<string, string> = {}

  addTrimmedPayloadField(payload, 'email', guardian.email)
  addTrimmedPayloadField(payload, 'first_name', guardian.first_name)
  addTrimmedPayloadField(payload, 'last_name', guardian.last_name)
  addTrimmedPayloadField(payload, 'phone_number', guardian.phone_number)
  addTrimmedPayloadField(payload, 'student', input.student)

  return payload
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
      userId: string,
      status: ParentApprovalStatus
    ): Promise<ParentApprovalItem> {
      const response = await client.patch<ParentApprovalUserDto>(
        buildUserStatusPath(userId),
        {
          status: mapParentStatusToParentApprovalUserStatus(status),
        }
      )

      invalidateStudentListCache()
      return mapParentApprovalUserToParentApprovalItem(response.data)
    },
  }
}
