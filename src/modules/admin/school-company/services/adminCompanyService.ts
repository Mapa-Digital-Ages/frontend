import { httpClient } from '@/shared/lib/http/client'

export type Company = {
  id: string
  name: string
  email: string
  type: string
  status: 'ativa' | 'pendente' | 'inativa'
  description: string
  requests: []
  spots: number
}

type CompanyApi = {
  id?: string
  user_id?: string
  first_name: string
  last_name: string
  email: string
  spots: number
  is_active?: boolean
}

export type CreateCompanyPayload = {
  name: string
  email: string
  password: string
  type: string
}

function mapCompany(company: any): Company {
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
  async listCompanies(): Promise<Company[]> {
    const response = await httpClient.get<CompanyApi[]>('company')
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

  async deleteCompany(companyId: string): Promise<void> {
    await httpClient.delete(`company/${encodeURIComponent(companyId)}`)
  },
}
