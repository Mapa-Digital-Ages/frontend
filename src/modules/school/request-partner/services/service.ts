import { httpClient } from '@/shared/lib/http/client'
import { authService } from '@/app/auth/core/service'
import type {
  CreateSponsorshipRequestPayload,
  SponsorshipRequestApi,
} from '../types/types'

export const requestPartnerService = {
  async createRequest(
    payload: CreateSponsorshipRequestPayload
  ): Promise<SponsorshipRequestApi> {
    const schoolId = authService.getUserId()

    if (!schoolId) {
      throw new Error(
        'Não foi possível identificar a escola. Faça login novamente.'
      )
    }

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
}
