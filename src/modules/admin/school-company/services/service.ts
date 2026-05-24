import { httpClient } from '@/shared/lib/http/client'
import {
  mapStudentListDto,
  type StudentDto,
  type StudentListDto,
} from '@/modules/admin/student/services/mapper'
import type { StudentItem } from '@/modules/admin/student/types/types'
import {
  Company,
  CompanyApi,
  CreateCompanyPayload,
  School,
  SchoolApi,
  SchoolListApiResponse,
  CreateSchoolPayload,
} from '../types/types'

function mapCompany(company: CompanyApi): Company {
  const firstName =
    company.first_name ??
    company.firstName ??
    company.user?.first_name ??
    company.user?.firstName ??
    company.user_data?.first_name ??
    company.user_data?.firstName ??
    ''

  const lastName =
    company.last_name ??
    company.lastName ??
    company.user?.last_name ??
    company.user?.lastName ??
    company.user_data?.last_name ??
    company.user_data?.lastName ??
    ''

  const name =
    company.name ??
    company.company_name ??
    company.companyName ??
    `${firstName} ${lastName}`.trim()

  return {
    id: String(company.id ?? company.user_id ?? company.user?.id),
    name: name || 'Empresa sem nome',
    email: company.email ?? company.user?.email ?? '',
    type: 'Empresa parceira',
    status: company.is_active === false ? 'inativa' : 'ativa',
    description: '',
    requests: [],
    spots: 0,
  }
}

export const adminCompanyService = {
  async listCompanies(page = 1, size = 10, name?: string): Promise<Company[]> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    if (name) params.set('name', name)
    const response = await httpClient.get<CompanyApi[]>(`company?${params}`)
    return response.data.map(mapCompany)
  },

  async createCompany(payload: CreateCompanyPayload): Promise<Company> {
    const [firstName, ...lastNameParts] = payload.name.trim().split(' ')

    const response = await httpClient.post<CompanyApi>('company', {
      first_name: firstName,
      last_name: lastNameParts.join(' ') || 'Empresa',
      email: payload.email,
      password: payload.password,
      spots: 0,
    })

    return mapCompany(response.data)
  },

  async countCompanies(name?: string): Promise<number> {
    const params = new URLSearchParams()
    if (name) params.set('name', name)
    const qs = params.toString()
    const response = await httpClient.get<{ total: number }>(
      `company/count${qs ? `?${qs}` : ''}`
    )
    return response.data.total
  },

  async deleteCompany(companyId: string): Promise<void> {
    await httpClient.delete(`company/${encodeURIComponent(companyId)}`)
  },
}

function mapSchool(api: SchoolApi): School {
  return {
    id: api.user_id,
    name: api.name,
    email: api.email,
    isPrivate: api.is_private,
    requestedSpots: api.requested_spots,
    isActive: api.is_active,
    studentCount: api.student_count,
    deactivatedAt: api.deactivated_at,
    createdAt: api.created_at,
  }
}

export const adminSchoolService = {
  async listSchools(
    page = 1,
    size = 10,
    name?: string
  ): Promise<{ items: School[]; total: number }> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    if (name) params.set('name', name)
    const response = await httpClient.get<SchoolListApiResponse>(
      `school?${params}`
    )
    return {
      items: response.data.items.map(mapSchool),
      total: response.data.total,
    }
  },

  async createSchool(payload: CreateSchoolPayload): Promise<School> {
    const [firstName] = payload.name.trim().split(' ')
    const response = await httpClient.post<SchoolApi>('school', {
      first_name: firstName,
      email: payload.email,
      password: payload.password,
      is_private: payload.isPrivate,
      requested_spots: payload.requestedSpots ?? null,
      phone_number: null,
    })
    return mapSchool(response.data)
  },

  async listStudentsBySchool(
    schoolId: string,
    page = 1,
    size = 20,
    name?: string
  ): Promise<{ items: StudentItem[]; total: number; hasMore: boolean }> {
    const params: Record<string, string | number> = {
      school_id: schoolId,
      page,
      size,
    }
    if (name) params.name = name
    const response = await httpClient.get<StudentDto[] | StudentListDto>(
      'student',
      { query: params }
    )
    const result = mapStudentListDto(response.data, size)
    return result
  },

  async countStudentsBySchool(
    schoolId: string,
    name?: string
  ): Promise<number> {
    const params: Record<string, string> = { school_id: schoolId }
    if (name) params.name = name
    const response = await httpClient.get<{ total: number }>('student/count', {
      query: params,
    })
    return response.data.total
  },
}
