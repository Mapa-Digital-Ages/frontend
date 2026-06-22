import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type { AdoptedSchool } from '../types/types'

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

async function getApprovedPartnerships(
  companyId: string
): Promise<CompanyPartnershipApi[]> {
  const response = await httpClient.get<CompanyPartnershipListApi>(
    `company/${encodeURIComponent(companyId)}/partnerships`,
    { query: { partnership_status: 'approved' } }
  )

  return response.data.items
}

export const adoptedSchoolsService = {
  getTitle(): string {
    return 'Gestão de Escolas Adotadas'
  },

  getSubtitle(): string {
    return 'Status operacional das escolas parceiras'
  },

  async getSchools(): Promise<AdoptedSchool[]> {
    const companyId = resolveCompanyId()
    const partnerships = await getApprovedPartnerships(companyId)

    return partnerships.map(partnership => ({
      id: partnership.id,
      partnershipId: partnership.id,
      schoolId: partnership.school_id,
      schoolName: partnership.school_name,
      city: '-',
      state: '-',
      coordinator: '-',
      grantedSpots: partnership.granted_spots,
    }))
  },

  async removeSchool(partnershipId: string): Promise<void> {
    const companyId = resolveCompanyId()
    await httpClient.delete(
      `company/${encodeURIComponent(companyId)}/partnerships/${encodeURIComponent(partnershipId)}`
    )
  },
}
