import { httpClient } from '@/shared/lib/http/client'
import { authService } from '@/app/auth/core/service'
import type { CompanyStat } from '@/shared/types/common'
import type { SupportRequest, SupportedSchool } from '../types/types'

type PublicSponsorshipRequestApi = {
  id: string
  school_id: string
  school_name: string
  title: string
  description: string | null
  requested_spots: number
  remaining_spots: number
  status: string
  created_at: string
}

type PublicSponsorshipRequestListApi = {
  items: PublicSponsorshipRequestApi[]
  total: number
}

type CompanyPartnershipApi = {
  id: string
  school_id: string
  school_name: string
  company_id: string
  request_id: string
  request_title: string
  granted_spots: number
  status: string
  created_at: string
}

type CompanyPartnershipListApi = {
  items: CompanyPartnershipApi[]
  total: number
}

function resolveCompanyId(): string {
  const companyId = authService.getUserId()

  if (!companyId) {
    throw new Error(
      'Não foi possível identificar a empresa. Faça login novamente.'
    )
  }

  return companyId
}

function mapRequest(item: PublicSponsorshipRequestApi): SupportRequest {
  return {
    id: item.id,
    schoolName: item.school_name,
    title: item.title,
    description: item.description?.trim() ? item.description : '',
    status: 'aguardando',
    remainingSpots: item.remaining_spots,
  }
}

function mapPartnershipStatus(status: string): SupportedSchool['status'] {
  const normalizedStatus = status.trim().toLowerCase()

  if (normalizedStatus === 'rejected') {
    return 'recusada'
  }

  if (normalizedStatus === 'pending') {
    return 'pendente'
  }

  return 'apoiada'
}

function mapPartnership(item: CompanyPartnershipApi): SupportedSchool {
  return {
    id: item.id,
    schoolId: item.school_id,
    schoolName: item.school_name,
    description: `${item.request_title} • ${item.granted_spots} vaga(s)`,
    status: mapPartnershipStatus(item.status),
    grantedSpots: item.granted_spots,
  }
}

export const companyDashboardService = {
  getTitle(): string {
    return 'Impacto Educacional'
  },

  /** Derive dashboard metrics from the company's active partnerships. */
  getStats(supportedSchools: SupportedSchool[]): CompanyStat[] {
    const distinctSchools = new Set(supportedSchools.map(s => s.schoolId))
    const impactedStudents = supportedSchools.reduce(
      (sum, school) => sum + school.grantedSpots,
      0
    )

    return [
      {
        id: 'supported-schools',
        label: 'Escolas Apoiadas',
        value: String(distinctSchools.size),
        description: 'escolas ativas no programa',
      },
      {
        id: 'impacted-students',
        label: 'Alunos Impactados',
        value: String(impactedStudents),
        description: 'alunos beneficiados',
      },
    ]
  },

  /** Open sponsorship requests from schools that the company can sponsor. */
  async getSupportRequests(): Promise<SupportRequest[]> {
    const response =
      await httpClient.get<PublicSponsorshipRequestListApi>('company/requests')

    return response.data.items.map(mapRequest)
  },

  /** Active partnerships held by the logged-in company. */
  async getSupportedSchools(): Promise<SupportedSchool[]> {
    const companyId = resolveCompanyId()
    const response = await httpClient.get<CompanyPartnershipListApi>(
      `company/${encodeURIComponent(companyId)}/partnerships`
    )

    return response.data.items.map(mapPartnership)
  },

  /** Accept a request by donating the chosen number of spots (creates a partnership). */
  async acceptRequest(
    request: SupportRequest,
    grantedSpots: number
  ): Promise<void> {
    const companyId = resolveCompanyId()

    await httpClient.post(
      `company/${encodeURIComponent(companyId)}/partnerships`,
      {
        request_id: request.id,
        granted_spots: grantedSpots,
      }
    )
  },
}
