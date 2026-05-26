import { httpClient } from '@/shared/lib/http/client'

export interface SchoolOption {
  id: string
  name: string
}

interface SchoolApiResponse {
  user_id: string
  name: string
  is_active: boolean
}

interface SchoolListApiResponse {
  items: SchoolApiResponse[]
  total: number
  page: number
  size: number
}

export const schoolService = {
  async listActiveSchools(): Promise<SchoolOption[]> {
    const response = await httpClient.get<SchoolListApiResponse>(
      'school?page=1&size=100'
    )
    return response.data.items
      .filter(item => item.is_active)
      .map(item => ({
        id: item.user_id,
        name: item.name,
      }))
  },
}
