import { afterEach, expect, jest, test } from '@jest/globals'
import {
  STUDENT_LIST_CACHE_TTL_MS,
  invalidateStudentListCache,
} from '@/modules/admin/student/services/listCache'
import { createStudentRepository } from '@/modules/admin/student/services/repository'
import type {
  StudentDto,
  StudentListDto,
} from '@/modules/admin/student/services/mapper'
import type { StudentApiClient } from '@/modules/admin/student/types/types'
import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'

function apiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    message: 'OK',
    success: true,
  }
}

function studentDto(overrides: Partial<StudentDto> = {}): StudentDto {
  return {
    email: 'ana@test.local',
    first_name: 'Ana',
    guardian_id: 'guardian-1',
    guardian_name: 'Maria Responsavel',
    id: 'student-1',
    is_active: true,
    last_name: 'Silva',
    school_id: 'school-1',
    school_name: 'Escola Central',
    student_class: '7th class',
    ...overrides,
  }
}

function studentListDto(items: StudentDto[]): StudentListDto {
  return {
    items,
    page: 1,
    page_size: 10,
    total: items.length,
    total_pages: 1,
  }
}

function createClient(overrides: Partial<StudentApiClient>): StudentApiClient {
  return {
    async delete<T>() {
      throw new Error('Unexpected delete call')
    },
    async get<T>() {
      throw new Error('Unexpected get call')
    },
    async patch<T>() {
      throw new Error('Unexpected patch call')
    },
    async post<T>() {
      throw new Error('Unexpected post call')
    },
    async put<T>() {
      throw new Error('Unexpected put call')
    },
    ...overrides,
  } as StudentApiClient
}

afterEach(() => {
  invalidateStudentListCache()
  jest.restoreAllMocks()
})

test('student repository caches list requests by name, email, page and size while TTL is valid', async () => {
  let now = 1_000
  jest.spyOn(Date, 'now').mockImplementation(() => now)

  const getCalls: Array<{
    options?: { query?: HttpRequestOptions['query'] }
    path: string
  }> = []
  const client = createClient({
    async get<T>(
      path: string,
      options?: { query?: HttpRequestOptions['query'] }
    ) {
      getCalls.push({ options, path })

      return apiResponse(
        studentListDto([studentDto({ id: `student-${getCalls.length}` })])
      ) as ApiResponse<T>
    },
  })
  const repository = createStudentRepository({ client })

  const first = await repository.getStudents({
    email: 'ana@test.local',
    page: 1,
    pageSize: 10,
    query: 'Ana',
  })
  const second = await repository.getStudents({
    email: 'ana@test.local',
    name: 'Ana',
    page: 1,
    pageSize: 10,
  })

  expect(second).toEqual(first)
  expect(getCalls).toHaveLength(1)

  await repository.getStudents({
    email: 'ana@test.local',
    name: 'Ana',
    page: 2,
    pageSize: 10,
  })
  await repository.getStudents({
    email: 'ana@test.local',
    name: 'Ana',
    page: 1,
    size: 20,
  })
  await repository.getStudents({
    email: 'bruno@test.local',
    name: 'Ana',
    page: 1,
    pageSize: 10,
  })

  expect(getCalls.map(call => call.options?.query)).toEqual([
    {
      email: 'ana@test.local',
      name: 'Ana',
      page: 1,
      size: 10,
    },
    {
      email: 'ana@test.local',
      name: 'Ana',
      page: 2,
      size: 10,
    },
    {
      email: 'ana@test.local',
      name: 'Ana',
      page: 1,
      size: 20,
    },
    {
      email: 'bruno@test.local',
      name: 'Ana',
      page: 1,
      size: 10,
    },
  ])

  now += STUDENT_LIST_CACHE_TTL_MS + 1
  await repository.getStudents({
    email: 'ana@test.local',
    name: 'Ana',
    page: 1,
    pageSize: 10,
  })

  expect(getCalls).toHaveLength(5)
})

test('student repository deduplicates simultaneous list requests for the same key', async () => {
  const getCalls: string[] = []
  let resolveRequest!: (value: ApiResponse<StudentListDto>) => void
  const pendingRequest = new Promise<ApiResponse<StudentListDto>>(resolve => {
    resolveRequest = resolve
  })
  const client = createClient({
    async get<T>(path: string) {
      getCalls.push(path)

      return (await pendingRequest) as ApiResponse<T>
    },
  })
  const repository = createStudentRepository({ client })

  const first = repository.getStudents({
    page: 1,
    pageSize: 10,
    query: 'Ana',
  })
  const second = repository.getStudents({
    page: 1,
    pageSize: 10,
    query: 'Ana',
  })

  await Promise.resolve()

  expect(getCalls).toEqual(['student'])

  resolveRequest(apiResponse(studentListDto([studentDto()])))

  const [firstResult, secondResult] = await Promise.all([first, second])
  expect(secondResult).toEqual(firstResult)
})

test('student repository invalidates cached list requests after student mutations', async () => {
  const getCalls: string[] = []
  const client = createClient({
    async delete<T>() {
      return apiResponse(null) as ApiResponse<T>
    },
    async get<T>(path: string) {
      getCalls.push(path)

      return apiResponse(
        studentListDto([studentDto({ id: `student-${getCalls.length}` })])
      ) as ApiResponse<T>
    },
    async post<T>() {
      return apiResponse(studentDto({ id: 'student-new' })) as ApiResponse<T>
    },
    async put<T>() {
      return apiResponse(
        studentDto({
          guardian_id: null,
          guardian_name: null,
          id: 'student-new',
        })
      ) as ApiResponse<T>
    },
  })
  const repository = createStudentRepository({ client })
  const query = { page: 1, pageSize: 10, query: 'Ana' }

  await repository.getStudents(query)
  await repository.getStudents(query)
  expect(getCalls).toHaveLength(1)

  await repository.createStudent({
    email: 'novo@test.local',
    guardianId: 'guardian-1',
    name: 'Novo Aluno',
    password: '12345678',
    schoolId: 'school-1',
    status: 'ativo',
    year: '7',
  })
  await repository.getStudents(query)
  expect(getCalls).toHaveLength(2)

  await repository.updateStudent('student-new', {
    guardianId: null,
  })
  await repository.getStudents(query)
  expect(getCalls).toHaveLength(3)

  await repository.deleteStudent('student-new')
  await repository.getStudents(query)
  expect(getCalls).toHaveLength(4)
})
