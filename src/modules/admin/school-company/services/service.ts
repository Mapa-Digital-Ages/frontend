import { httpClient } from '@/shared/lib/http/client'
import {
  mapStudentListDto,
  type StudentDto,
  type StudentListDto,
} from '@/modules/admin/student/services/mapper'
import type { StudentItem } from '@/modules/admin/student/types/types'
import type {
  AdminPartnership,
  AdminPartnershipApi,
  AdminPartnershipListApiResponse,
  Company,
  CompanyApi,
  CreateCompanyPayload,
  School,
  SchoolApi,
  SchoolListApiResponse,
  CreateSchoolPayload,
  PartnershipStatus,
} from '../types/types'

function normalizePartnershipStatus(status: string): PartnershipStatus {
  const normalized = status.trim().toLowerCase()
  if (
    normalized === 'pending' ||
    normalized === 'approved' ||
    normalized === 'rejected'
  ) {
    return normalized
  }
  return 'pending'
}

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
    spots: Number(company.spots ?? 0),
  }
}

function mapAdminPartnership(
  partnership: AdminPartnershipApi
): AdminPartnership {
  return {
    id: partnership.id,
    schoolId: partnership.school_id,
    schoolName: partnership.school_name,
    companyId: partnership.company_id,
    companyName: partnership.company_name,
    requestId: partnership.request_id,
    requestTitle: partnership.request_title,
    requestedSpots: partnership.requested_spots,
    remainingSpots: partnership.remaining_spots,
    grantedSpots: partnership.granted_spots,
    status: normalizePartnershipStatus(partnership.status),
    createdAt: partnership.created_at,
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

  async listPartnerships(
    status?: PartnershipStatus
  ): Promise<AdminPartnership[]> {
    const params = new URLSearchParams()
    if (status) params.set('partnership_status', status)
    const qs = params.toString()
    const response = await httpClient.get<AdminPartnershipListApiResponse>(
      `admin/partnerships${qs ? `?${qs}` : ''}`
    )
    return response.data.items.map(mapAdminPartnership)
  },

  async updatePartnershipStatus(
    partnershipId: string,
    status: Extract<PartnershipStatus, 'approved' | 'rejected'>
  ): Promise<AdminPartnership> {
    const response = await httpClient.patch<AdminPartnershipApi>(
      `admin/partnerships/${encodeURIComponent(partnershipId)}/status`,
      { status: status.toUpperCase() }
    )
    return mapAdminPartnership(response.data)
  },
}

function mapSchool(api: SchoolApi): School {
  const fullName =
    [api.first_name, api.last_name].filter(Boolean).join(' ') || api.name
  return {
    id: api.user_id,
    name: fullName,
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
    const [firstName, ...lastNameParts] = payload.name.trim().split(' ')
    const lastName = lastNameParts.join(' ') || undefined
    const response = await httpClient.post<SchoolApi>('school', {
      first_name: firstName,
      last_name: lastName,
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
    size = 10,
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
