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

export type PartnershipStatus = 'pending' | 'approved' | 'rejected'

export type AdminPartnership = {
  id: string
  schoolId: string
  schoolName: string
  companyId: string
  companyName: string
  requestId: string
  requestTitle: string
  requestedSpots: number
  remainingSpots: number
  grantedSpots: number
  status: PartnershipStatus
  createdAt: string
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

export type AdminPartnershipApi = {
  id: string
  school_id: string
  school_name: string
  company_id: string
  company_name: string
  request_id: string
  request_title: string
  requested_spots: number
  remaining_spots: number
  granted_spots: number
  status: string
  created_at: string
}

export type AdminPartnershipListApiResponse = {
  items: AdminPartnershipApi[]
  total: number
}

export type CreateCompanyPayload = {
  name: string
  email: string
  password: string
  type: string
}

export type School = {
  id: string
  name: string
  email: string
  isPrivate: boolean
  requestedSpots: number | null
  isActive: boolean
  studentCount: number
  deactivatedAt: string | null
  createdAt: string
}

export type SchoolApi = {
  user_id: string
  email: string
  name: string
  first_name: string
  last_name: string | null
  is_private: boolean
  requested_spots: number | null
  is_active: boolean
  deactivated_at: string | null
  created_at: string
  student_count: number
}

export type SchoolListApiResponse = {
  items: SchoolApi[]
  total: number
  page: number
  size: number
}

export type CreateSchoolPayload = {
  name: string
  email: string
  password: string
  isPrivate: boolean
  requestedSpots?: number | null
}
