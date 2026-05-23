import { httpClient } from '@/shared/lib/http/client'

export interface SchoolOption {
  label: string
  value: string
}

export interface GuardianOption {
  label: string
  value: string
}

export const yearOptions = [
  { label: '5º Ano', value: '5' },
  { label: '6º Ano', value: '6' },
  { label: '7º Ano', value: '7' },
  { label: '8º Ano', value: '8' },
  { label: '9º Ano', value: '9' },
]

interface SchoolApiItem {
  user_id: string
  name: string
  is_active: boolean
}

interface SchoolListResponse {
  items: SchoolApiItem[]
  total: number
}

interface GuardianApiItem {
  id: string
  name: string
  first_name?: string
  last_name?: string
  status: string
}

export const studentFormOptionsService = {
  async getSchools(): Promise<SchoolOption[]> {
    try {
      const response = await httpClient.get<SchoolListResponse>('school')
      return response.data.items
        .filter(item => item.is_active)
        .map(item => ({
          label: item.name,
          value: item.user_id,
        }))
    } catch {
      return []
    }
  },

  async getGuardians(): Promise<GuardianOption[]> {
    try {
      const response = await httpClient.get<{
        items: GuardianApiItem[]
        total: number
      }>('admin/users', {
        query: { role: 'guardian', user_status: 'approved' },
      })
      const items = Array.isArray(response.data)
        ? response.data
        : ((response.data as { items: GuardianApiItem[] }).items ?? [])
      return items.map(item => {
        const fullName =
          item.first_name && item.last_name
            ? `${item.first_name} ${item.last_name}`.trim()
            : item.name
        return {
          label: fullName,
          value: item.id,
        }
      })
    } catch {
      return []
    }
  },
}
