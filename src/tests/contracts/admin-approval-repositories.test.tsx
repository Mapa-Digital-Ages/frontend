import { expect, test } from '@jest/globals'
import {
  createContentApprovalRepository,
  type ApprovalApiClient,
} from '@/modules/admin/content/services/content/repository'
import type {
  ApprovalQueueResponseDto,
  ContentApprovalDto,
} from '@/modules/admin/content/services/content/mapper'
import {
  createParentApprovalRepository,
  type ParentApprovalApiClient,
} from '@/modules/admin/parent/services/parent/repository'
import type {
  GuardianListPaginatedDto,
  GuardianResponseDto,
} from '@/modules/admin/parent/services/parent/mapper'
import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'

function apiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    message: 'OK',
    success: true,
  }
}

function guardianResponse(
  overrides: Partial<GuardianResponseDto> = {}
): GuardianResponseDto {
  return {
    user_id: '47f2a20f-77cb-4d0b-89ef-b64d160fce48',
    first_name: 'Mariana',
    last_name: 'Souza',
    email: 'responsavel+qa@test.com',
    phone_number: '+55 51 99999-0000',
    guardian_status: 'waiting',
    is_active: true,
    created_at: '2026-04-08T10:15:00+00:00',
    deactivated_at: null,
    students: [],
    ...overrides,
  }
}

function guardianListResponse(
  items: GuardianResponseDto[] = [guardianResponse()],
  overrides: Partial<Omit<GuardianListPaginatedDto, 'items'>> = {}
): GuardianListPaginatedDto {
  return {
    items,
    total: items.length,
    page: 1,
    size: 10,
    ...overrides,
  }
}

function contentApproval(
  overrides: Partial<ContentApprovalDto> = {}
): ContentApprovalDto {
  return {
    id: 'content-10',
    requested_at: '2026-04-07',
    resource_type: 'exam',
    stage_label: 'Português',
    status: 'in_review',
    subject_label: '7º ano',
    tags: [{ id: 'tag-1', label: '2 questões vinculadas', tone: 'danger' }],
    title: 'Avaliação bimestral',
    ...overrides,
  }
}

test('content approval repository sends queue filters and maps backend DTOs', async () => {
  const getCalls: Array<{
    options?: { query?: HttpRequestOptions['query'] }
    path: string
  }> = []
  const client: ApprovalApiClient = {
    async get<T>(
      path: string,
      options?: { query?: HttpRequestOptions['query'] }
    ) {
      getCalls.push({ path, options })

      return apiResponse<ApprovalQueueResponseDto<ContentApprovalDto>>({
        items: [contentApproval()],
        page: 2,
        page_size: 10,
        total_items: 11,
        total_pages: 2,
      }) as ApiResponse<T>
    },
    async patch() {
      throw new Error('Unexpected patch call')
    },
    async post() {
      throw new Error('Unexpected post call')
    },
  }

  const repository = createContentApprovalRepository({ client })
  const result = await repository.getContentQueue({
    page: 2,
    pageSize: 10,
    query: ' português ',
    status: 'inReview',
  })

  expect(getCalls).toEqual([
    {
      path: 'admin/approvals/content',
      options: {
        query: {
          page: 2,
          page_size: 10,
          query: 'português',
          status: 'in_review',
        },
      },
    },
  ])
  expect(result).toMatchObject({
    currentPage: 2,
    pageSize: 10,
    totalItems: 11,
    totalPages: 2,
  })
  expect(result.items[0]).toMatchObject({
    id: 'content-10',
    status: 'inReview',
    subtitle: 'Prova · Português · 07/04/2026',
    title: 'Avaliação bimestral',
  })
})

test('content approval repository translates UI status updates before patching', async () => {
  const patchCalls: Array<{ body?: unknown; path: string }> = []
  const client: ApprovalApiClient = {
    async get() {
      throw new Error('Unexpected get call')
    },
    async patch<T>(path: string, body?: unknown) {
      patchCalls.push({ path, body })

      return apiResponse(
        contentApproval({ status: 'correction_in_progress' })
      ) as ApiResponse<T>
    },
    async post() {
      throw new Error('Unexpected post call')
    },
  }

  const repository = createContentApprovalRepository({ client })
  const item = await repository.updateContentStatus(
    'content-10',
    'correctionInProgress'
  )

  expect(patchCalls).toEqual([
    {
      path: 'admin/approvals/content/content-10/status',
      body: { status: 'correction_in_progress' },
    },
  ])
  expect(item.status).toBe('correctionInProgress')
})

test('parent approval repository calls guardian endpoints with pagination', async () => {
  const getCalls: Array<{
    options?: { query?: HttpRequestOptions['query'] }
    path: string
  }> = []
  const patchCalls: Array<{ body?: unknown; path: string }> = []
  const deleteCalls: string[] = []
  const postCalls: Array<{
    body?: unknown
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
    path: string
  }> = []

  const client: ParentApprovalApiClient = {
    async get<T>(
      path: string,
      options?: { query?: HttpRequestOptions['query'] }
    ) {
      getCalls.push({ path, options })
      return apiResponse(
        guardianListResponse([guardianResponse()])
      ) as ApiResponse<T>
    },
    async patch<T>(path: string, body?: unknown) {
      patchCalls.push({ path, body })
      return apiResponse(
        guardianResponse({ guardian_status: 'approved' })
      ) as ApiResponse<T>
    },
    async delete<T>(path: string) {
      deleteCalls.push(path)
      return apiResponse(null) as ApiResponse<T>
    },
    async post<T>(
      path: string,
      body?: unknown,
      options?: Omit<HttpRequestOptions, 'body' | 'method'>
    ) {
      postCalls.push({ path, body, options })
      return apiResponse(null) as ApiResponse<T>
    },
  }

  const repository = createParentApprovalRepository({ client })

  const queue = await repository.getParentQueue({
    page: 1,
    pageSize: 10,
    query: 'mariana',
    status: 'pendingValidation',
  })

  const updated = await repository.updateParentStatus(
    '47f2a20f-77cb-4d0b-89ef-b64d160fce48',
    'approved'
  )

  await repository.createParentRegistration({
    guardian: {
      email: 'novo@test.com',
      first_name: 'Novo',
      last_name: 'Responsável',
      password: '12345678',
      phone_number: '',
    },
  })

  await repository.updateParentRegistration(
    '47f2a20f-77cb-4d0b-89ef-b64d160fce48',
    {
      guardian: {
        email: 'responsavel+qa@test.com',
        first_name: 'Mariana',
        last_name: 'Atualizada',
        phone_number: '+55 51 99999-0000',
      },
    }
  )

  await repository.removeParentRegistration(
    '47f2a20f-77cb-4d0b-89ef-b64d160fce48'
  )

  expect(getCalls).toEqual([
    {
      path: 'guardian',
      options: {
        query: {
          page: 1,
          size: 10,
          name: 'mariana',
          guardian_status: 'waiting',
        },
      },
    },
  ])

  expect(queue.items[0]).toMatchObject({
    id: '47f2a20f-77cb-4d0b-89ef-b64d160fce48',
    requestedAt: '08/04/2026',
    roleLabel: 'Responsável',
    status: 'pendingValidation',
    title: 'Mariana Souza',
    name: { firstName: 'Mariana', lastName: 'Souza' },
  })

  expect(queue.totalItems).toBe(1)
  expect(queue.pageSize).toBe(10)

  expect(patchCalls).toEqual([
    {
      path: 'guardian/47f2a20f-77cb-4d0b-89ef-b64d160fce48',
      body: { guardian_status: 'approved' },
    },
    {
      path: 'guardian/47f2a20f-77cb-4d0b-89ef-b64d160fce48',
      body: {
        email: 'responsavel+qa@test.com',
        first_name: 'Mariana',
        last_name: 'Atualizada',
        phone_number: '+55 51 99999-0000',
      },
    },
  ])

  expect(updated.status).toBe('approved')
  expect(deleteCalls).toEqual(['guardian/47f2a20f-77cb-4d0b-89ef-b64d160fce48'])
  expect(postCalls).toEqual([
    {
      path: 'register/guardian',
      body: {
        email: 'novo@test.com',
        first_name: 'Novo',
        last_name: 'Responsável',
        password: '12345678',
        phone_number: '',
      },
      options: { skipAuth: true },
    },
  ])
})
