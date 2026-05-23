import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'

export type StudentStatus = 'ativo' | 'inativo'

export interface StudentItem {
  id: string
  name: string
  email: string
  guardian: string | null
  guardianId: string | null
  school: string | null
  schoolId: string | null
  year: string | null
  status: StudentStatus
}

export interface StudentListResult {
  items: StudentItem[]
  total: number
  hasMore: boolean
}

export interface StudentListQuery {
  email?: string
  name?: string
  size?: number
  query?: string
  status?: StudentStatus | 'all'
  page?: number
  pageSize?: number
}

export interface CreateStudentInput {
  name: string
  email: string
  password: string
  schoolId: string | null
  guardianId: string | null
  year: string | null
  status: StudentStatus
  birthDate?: string
}

export interface UpdateStudentInput {
  password?: string
  schoolId?: string | null
  year?: string | null
  guardianId?: string | null
}

export interface StudentMetrics {
  total: number
  schools: number
}

export type StudentApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  post<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  put<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  delete<T>(path: string): Promise<ApiResponse<T>>
}

export interface CreateStudentRepositoryOptions {
  client: StudentApiClient
}
