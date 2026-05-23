import type {
  StudentItem,
  StudentListQuery,
  StudentListResult,
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

export function createStudentRepository({
  client,
}: CreateStudentRepositoryOptions) {
  return {
    async getStudents(query: StudentListQuery): Promise<StudentListResult> {
      const pageSize = query.pageSize ?? 10
      const params: Record<string, string | number> = {
        page: query.page ?? 1,
        size: pageSize,
      }
      if (query.query) {
        params.name = query.query
      }
      const response = await client.get<StudentDto[] | StudentListDto>(
        'student',
        {
          query: params,
        }
      )
      return mapStudentListDto(response.data, pageSize)
    },

    async createStudent(input: CreateStudentInput): Promise<StudentItem> {
      const response = await client.post<StudentDto>(
        'student',
        mapCreateStudentInput(input)
      )
      return mapStudentDto(response.data)
    },

    async updateStudent(
      id: string,
      input: UpdateStudentInput
    ): Promise<StudentItem> {
      const response = await client.put<StudentDto>(
        `student/${id}`,
        mapUpdateStudentInput(input)
      )
      return mapStudentDto(response.data)
    },

    async deleteStudent(id: string): Promise<void> {
      await client.delete<void>(`student/${id}`)
    },

    async countStudents(name?: string): Promise<number> {
      const params: Record<string, string> = {}
      if (name) params.name = name
      const response = await client.get<{ total: number }>('student/count', {
        query: params,
      })
      return response.data.total
    },
  }
}

export type StudentRepository = ReturnType<typeof createStudentRepository>
