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
import { getCachedStudentList, invalidateStudentListCache } from './listCache'
import { importCsvBatch } from '@/modules/admin/shared/services/batchImport'

export function createStudentRepository({
  client,
}: CreateStudentRepositoryOptions) {
  return {
    async getStudents(query: StudentListQuery): Promise<StudentListResult> {
      const pageSize = query.size ?? query.pageSize ?? 10
      const page = query.page ?? 1
      const name = query.name ?? query.query
      const email = query.email
      const schoolId = query.schoolId

      return getCachedStudentList(
        {
          email,
          name,
          page,
          size: pageSize,
          schoolId,
        },
        async () => {
          const params: Record<string, string | number> = {
            page,
            size: pageSize,
          }
          if (name) {
            params.name = name
          }
          if (email) {
            params.email = email
          }
          if (schoolId) {
            params.school_id = schoolId
          }
          const response = await client.get<StudentDto[] | StudentListDto>(
            'student',
            {
              query: params,
            }
          )
          return mapStudentListDto(response.data, pageSize)
        }
      )
    },

    async createStudent(input: CreateStudentInput): Promise<StudentItem> {
      const response = await client.post<StudentDto>(
        'student',
        mapCreateStudentInput(input)
      )
      invalidateStudentListCache()
      return mapStudentDto(response.data)
    },

    async importStudents(file: File) {
      const result = await importCsvBatch(client, 'student/batch', file)
      if (result.created > 0) invalidateStudentListCache()
      return result
    },

    async updateStudent(
      id: string,
      input: UpdateStudentInput
    ): Promise<StudentItem> {
      const response = await client.put<StudentDto>(
        `student/${id}`,
        mapUpdateStudentInput(input)
      )
      invalidateStudentListCache()
      return mapStudentDto(response.data)
    },

    async deleteStudent(id: string): Promise<void> {
      await client.delete<void>(`student/${id}`)
      invalidateStudentListCache()
    },

    async countStudents(name?: string, schoolId?: string): Promise<number> {
      const params: Record<string, string> = {}
      if (name) params.name = name
      if (schoolId) params.school_id = schoolId
      const response = await client.get<{ total: number }>('student/count', {
        query: params,
      })
      return response.data.total
    },
  }
}

export type StudentRepository = ReturnType<typeof createStudentRepository>
