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
  createUploadApprovalRepository,
  type UploadApiClient,
} from '@/modules/admin/content/services/upload/repository'
import type {
  StudentUploadDto,
  UploadQueueResponseDto,
} from '@/modules/admin/content/services/upload/mapper'
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
    created_at: '2026-04-07T12:00:00+00:00',
    description: 'Conteúdo inicial.',
    subject: {
      id: '1',
      name: 'Português',
      slug: 'portuguese',
      color: 'rgba(5, 113, 247, 1)',
    },
    title: 'Avaliação bimestral',
    updated_at: null,
    ...overrides,
  }
}

function studentUpload(
  overrides: Partial<StudentUploadDto> = {}
): StudentUploadDto {
  return {
    id: '2f188dbd-4398-44eb-8060-b60ef5b7d4df',
    student_id: '6df602e0-9344-4ee4-ac97-b49ab79ebca0',
    student_name: 'Ana Silva',
    file_name: 'atividade.pdf',
    download_url: '/uploads/2f188dbd-4398-44eb-8060-b60ef5b7d4df/content',
    file_type: 'application/pdf',
    file_size_bytes: 1280,
    created_at: '2026-04-08T10:15:00+00:00',
    status: 'correction_in_progress',
    activity_type: 'exercise',
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
    async delete() {
      throw new Error('Unexpected delete call')
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
      path: 'admin/content',
      options: {
        query: {
          page: 2,
          page_size: 10,
          query: 'português',
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
    status: 'sent',
    subtitle: 'Português · Criado em 07/04/2026',
    title: 'Avaliação bimestral',
  })
})

test('content approval repository creates and updates content without resource type', async () => {
  const postCalls: Array<{ body?: unknown; path: string }> = []
  const patchCalls: Array<{ body?: unknown; path: string }> = []
  const client: ApprovalApiClient = {
    async get() {
      throw new Error('Unexpected get call')
    },
    async post<T>(path: string, body?: unknown) {
      postCalls.push({ path, body })

      return apiResponse(contentApproval()) as ApiResponse<T>
    },
    async patch<T>(path: string, body?: unknown) {
      patchCalls.push({ path, body })

      return apiResponse(
        contentApproval({ title: 'Conteúdo editado' })
      ) as ApiResponse<T>
    },
    async delete() {
      throw new Error('Unexpected delete call')
    },
  }

  const repository = createContentApprovalRepository({ client })
  await repository.createLocalContentDraft({
    description: '',
    requestedAt: '07/04/2026',
    subject: { id: '1', label: 'Português' },
    title: 'Avaliação bimestral',
  })
  const item = await repository.updateLocalContentItem('content-10', {
    description: '',
    requestedAt: '08/04/2026',
    subject: { id: '1', label: 'Português' },
    title: 'Conteúdo editado',
  })

  expect(postCalls).toEqual([
    {
      path: 'admin/content',
      body: {
        description: '',
        subject_id: 1,
        title: 'Avaliação bimestral',
      },
    },
  ])
  expect(patchCalls).toEqual([
    {
      path: 'admin/content/content-10',
      body: {
        description: '',
        subject_id: 1,
        title: 'Conteúdo editado',
      },
    },
  ])
  expect(item.title).toBe('Conteúdo editado')
})

test('upload approval repository uses admin upload list and delete endpoints', async () => {
  const getCalls: Array<{
    options?: { query?: HttpRequestOptions['query'] }
    path: string
  }> = []
  const deleteCalls: string[] = []
  const patchCalls: Array<{ body?: unknown; path: string }> = []

  const client: UploadApiClient = {
    async get<T>(
      path: string,
      options?: { query?: HttpRequestOptions['query'] }
    ) {
      getCalls.push({ path, options })
      return apiResponse<UploadQueueResponseDto>({
        items: [studentUpload()],
        page: 1,
        page_size: 10,
        total_items: 1,
        total_pages: 1,
      }) as ApiResponse<T>
    },
    async patch<T>(path: string, body?: unknown) {
      patchCalls.push({ path, body })
      return apiResponse(
        studentUpload({ activity_type: 'essay', status: 'corrected' })
      ) as ApiResponse<T>
    },
    async delete<T>(path: string) {
      deleteCalls.push(path)
      return apiResponse(null) as ApiResponse<T>
    },
  }

  const repository = createUploadApprovalRepository({ client })
  const queue = await repository.getUploadQueue({
    page: 1,
    pageSize: 10,
    query: ' atividade ',
    activityType: 'essay',
    status: 'correctionInProgress',
  })
  const updatedType = await repository.updateUploadActivityType(
    '2f188dbd-4398-44eb-8060-b60ef5b7d4df',
    'essay'
  )
  const updatedStatus = await repository.updateUploadStatus(
    '2f188dbd-4398-44eb-8060-b60ef5b7d4df',
    'corrected'
  )
  await repository.removeUpload('2f188dbd-4398-44eb-8060-b60ef5b7d4df')

  expect(getCalls).toEqual([
    {
      path: 'admin/uploads',
      options: {
        query: {
          page: 1,
          page_size: 10,
          query: 'atividade',
          status: 'in_review',
          activity_type: 'essay',
        },
      },
    },
  ])
  expect(queue.items[0]).toMatchObject({
    activityType: 'exercise',
    status: 'correctionInProgress',
    studentName: 'Ana Silva',
  })
  expect(patchCalls).toEqual([
    {
      path: 'admin/uploads/2f188dbd-4398-44eb-8060-b60ef5b7d4df',
      body: { activity_type: 'essay' },
    },
    {
      path: 'admin/uploads/2f188dbd-4398-44eb-8060-b60ef5b7d4df',
      body: { status: 'corrected' },
    },
  ])
  expect(updatedType.activityType).toBe('essay')
  expect(updatedStatus.status).toBe('corrected')
  expect(deleteCalls).toEqual([
    'admin/uploads/2f188dbd-4398-44eb-8060-b60ef5b7d4df',
  ])
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
      if (path.startsWith('guardian/')) {
        return apiResponse(
          guardianResponse({ guardian_status: 'approved' })
        ) as ApiResponse<T>
      }
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
    {
      path: 'guardian/47f2a20f-77cb-4d0b-89ef-b64d160fce48',
      options: undefined,
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
      path: 'admin/users/47f2a20f-77cb-4d0b-89ef-b64d160fce48/status',
      body: { status: 'approved' },
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
