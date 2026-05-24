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

export type CompanyApi = {
  id?: string
  user_id?: string
  first_name?: string
  firstName?: string
  last_name?: string
  lastName?: string
  email?: string
  spots?: number
  is_active?: boolean
  name?: string
  company_name?: string
  companyName?: string
  user?: {
    id?: string
    first_name?: string
    firstName?: string
    last_name?: string
    lastName?: string
    email?: string
  }
  user_data?: {
    first_name?: string
    firstName?: string
    last_name?: string
    lastName?: string
  }
}

export type CreateCompanyPayload = {
  name: string
  email: string
  password: string
  type: string
}
