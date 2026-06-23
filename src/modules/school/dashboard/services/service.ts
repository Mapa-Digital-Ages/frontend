import type { SchoolDashboardData } from '../types/types'
import { httpClient } from '@/shared/lib/http/client'

export const schoolDashboardService = {
  getTitle(): string {
    return 'Painel da Escola'
  },

  async getDashboardData(): Promise<SchoolDashboardData> {
    const response =
      await httpClient.get<SchoolDashboardData>('school/dashboard')
    return response.data
  },
}
