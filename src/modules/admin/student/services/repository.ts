import type {
  StudentItem,
  StudentListQuery,
  StudentListResult,
  StudentMetrics,
  CreateStudentInput,
  UpdateStudentInput,
  CreateStudentRepositoryOptions,
} from '@/modules/admin/student/types/types'
import {
  mapStudentDto,
  mapStudentListDto,
  mapCreateStudentInput,
  mapUpdateStudentInput,
  type StudentDto,
  type StudentListDto,
} from './mapper'

let mockStudents: StudentItem[] = [
  {
    id: '1',
    name: 'Lucas Silva',
    email: 'lucas@escola.com',
    guardian: 'Maria Silva',
    school: 'Escola São Paulo',
    schoolId: null,
    year: '7º Ano',
    status: 'inativo',
  },
  {
    id: '2',
    name: 'Carlos Nunes',
    email: 'carlos@escola.com',
    guardian: 'Roberta Nunes',
    school: 'Escola São Paulo',
    schoolId: null,
    year: '7º Ano',
    status: 'ativo',
  },
  {
    id: '3',
    name: 'Lívia Santos',
    email: 'livia@escola.com',
    guardian: 'Paula Santos',
    school: 'Escola São Paulo',
    schoolId: null,
    year: '6º Ano',
    status: 'ativo',
  },
  {
    id: '4',
    name: 'Marina Costa',
    email: 'marina@escola.com',
    guardian: 'Pedro Costa',
    school: 'Escola Rio Branco',
    schoolId: null,
    year: '7º Ano',
    status: 'ativo',
  },
  {
    id: '5',
    name: 'Rafael Souza',
    email: 'rafael@escola.com',
    guardian: 'Ana Souza',
    school: 'Escola Horizonte',
    schoolId: null,
    year: '8º Ano',
    status: 'ativo',
  },
  {
    id: '6',
    name: 'Julia Oliveira',
    email: 'julia@escola.com',
    guardian: 'Claudio Oliveira',
    school: 'Escola Rio Branco',
    schoolId: null,
    year: '8º Ano',
    status: 'ativo',
  },
]

function shouldUseFallback(error: unknown, allowFallback: boolean): boolean {
  if (!allowFallback) return false

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number'
  ) {
    const status = Number((error as { status: number }).status)
    return status === 404 || status >= 500
  }

  return error instanceof Error
}

function queryMockStudents(query: StudentListQuery): StudentListResult {
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

  const q = normalize(query.query ?? '')

  const filtered = mockStudents.filter(student => {
    const matchesQuery =
      !q ||
      normalize(student.name).includes(q) ||
      normalize(student.email).includes(q) ||
      normalize(student.school ?? '').includes(q) ||
      normalize(student.year ?? '').includes(q)

    const matchesStatus =
      !query.status || query.status === 'all' || student.status === query.status

    return matchesQuery && matchesStatus
  })

  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 50
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return { items, total: filtered.length }
}

function getMockMetrics(): StudentMetrics {
  const active = mockStudents.filter(s => s.status === 'ativo').length
  const schools = new Set(mockStudents.map(s => s.school).filter(Boolean)).size

  return {
    total: mockStudents.length,
    active,
    inactive: mockStudents.length - active,
    schools,
  }
}

function createMockStudent(input: CreateStudentInput): StudentItem {
  const yearLabel = input.year ? `${input.year}º Ano` : null

  const next: StudentItem = {
    id: String(Date.now()),
    name: input.name.trim(),
    email: input.email.trim(),
    guardian: input.guardianId ?? null,
    school: input.schoolId ?? null,
    schoolId: input.schoolId ?? null,
    year: yearLabel,
    status: input.status,
  }
  mockStudents = [next, ...mockStudents]
  return next
}

function updateMockStudent(id: string, input: UpdateStudentInput): StudentItem {
  let updated: StudentItem | undefined

  mockStudents = mockStudents.map(s => {
    if (s.id !== id) return s
    updated = {
      ...s,
      school:
        input.schoolId !== undefined ? (input.schoolId ?? null) : s.school,
      year:
        input.year !== undefined
          ? input.year
            ? `${input.year}º Ano`
            : null
          : s.year,
    }
    return updated
  })

  if (!updated) throw new Error(`Student ${id} not found`)
  return updated
}

function toggleMockStatus(id: string): StudentItem {
  let updated: StudentItem | undefined

  mockStudents = mockStudents.map(s => {
    if (s.id !== id) return s
    updated = { ...s, status: s.status === 'ativo' ? 'inativo' : 'ativo' }
    return updated
  })

  if (!updated) throw new Error(`Student ${id} not found`)
  return updated
}

function deleteMockStudent(id: string): void {
  mockStudents = mockStudents.filter(s => s.id !== id)
}

export function createStudentRepository({
  allowFallback = false,
  client,
}: CreateStudentRepositoryOptions) {
  return {
    async getStudents(query: StudentListQuery): Promise<StudentListResult> {
      try {
        const response = await client.get<StudentListDto>('admin/students', {
          query: {
            q: query.query,
            status: query.status !== 'all' ? query.status : undefined,
            page: query.page,
            page_size: query.pageSize,
          },
        })
        return mapStudentListDto(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        return queryMockStudents(query)
      }
    },

    async getMetrics(): Promise<StudentMetrics> {
      try {
        const response = await client.get<StudentMetrics>(
          'admin/students/metrics'
        )
        return response.data
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        return getMockMetrics()
      }
    },

    async createStudent(input: CreateStudentInput): Promise<StudentItem> {
      try {
        const response = await client.post<StudentDto>(
          'admin/students',
          mapCreateStudentInput(input)
        )
        return mapStudentDto(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        return createMockStudent(input)
      }
    },

    async updateStudent(
      id: string,
      input: UpdateStudentInput
    ): Promise<StudentItem> {
      try {
        const response = await client.put<StudentDto>(
          `admin/students/${id}`,
          mapUpdateStudentInput(input)
        )
        return mapStudentDto(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        return updateMockStudent(id, input)
      }
    },

    async toggleStudentStatus(
      id: string,
      isActive: boolean
    ): Promise<StudentItem> {
      try {
        const response = await client.patch<StudentDto>(
          `admin/students/${id}/status`,
          { is_active: isActive }
        )
        return mapStudentDto(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        return toggleMockStatus(id)
      }
    },

    async deleteStudent(id: string): Promise<void> {
      try {
        await client.delete<void>(`admin/students/${id}`)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        deleteMockStudent(id)
      }
    },
  }
}

export type StudentRepository = ReturnType<typeof createStudentRepository>
