import { httpClient } from '@/shared/lib/http/client'
import { authService } from '@/app/auth/core/service'
import type {
  CreateSponsorshipRequestPayload,
  SchoolPartnershipApi,
  SponsorshipRequestApi,
} from '../types/types'

type SponsorshipRequestListApi = {
  items: SponsorshipRequestApi[]
  total: number
}

type SchoolPartnershipListApi = {
  items: SchoolPartnershipApi[]
  total: number
}

function resolveSchoolId(): string {
  const schoolId = authService.getUserId()

  if (!schoolId) {
    throw new Error(
      'Não foi possível identificar a escola. Faça login novamente.'
    )
  }

  return schoolId
}

export const requestPartnerService = {
  async createRequest(
    payload: CreateSponsorshipRequestPayload
  ): Promise<SponsorshipRequestApi> {
    const schoolId = resolveSchoolId()

    const response = await httpClient.post<SponsorshipRequestApi>(
      `school/${encodeURIComponent(schoolId)}/requests`,
      {
        title: payload.title,
        description: payload.description || null,
        requested_spots: payload.requestedSpots,
      }
    )

    return response.data
  },

  async listRequests(): Promise<SponsorshipRequestApi[]> {
    const schoolId = resolveSchoolId()

    const response = await httpClient.get<SponsorshipRequestListApi>(
      `school/${encodeURIComponent(schoolId)}/requests`
    )

    return response.data.items
  },

  async listPartnerships(): Promise<SchoolPartnershipApi[]> {
    const schoolId = resolveSchoolId()

    const response = await httpClient.get<SchoolPartnershipListApi>(
      `school/${encodeURIComponent(schoolId)}/partnerships`
    )

    return response.data.items
  },
}
