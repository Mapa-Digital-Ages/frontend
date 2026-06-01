import { COOKIE_KEYS } from '@/shared/constants/storage'
import { httpClient } from '@/shared/lib/http/client'
import type { StudentTask, SummaryMetric } from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'
import { Task } from '../../shared/components/Planner'

export const studentService = {
  getName(): string | null {
    return getCookie(COOKIE_KEYS.authName)
  },

  getEmail(): string | null {
    return getCookie(COOKIE_KEYS.authEmail)
  },

  getOrganization(): string | null {
    return getCookie(COOKIE_KEYS.authOrganization)
  },

  async getSummary() {
    const response = await httpClient.get<SummaryMetric[]>('student/summary')
    return response.data
  },

  async getTasks(studentId: string) {
    const response = await httpClient.get<Task[]>(
      `student/${studentId}/calendar`
    )
    return response.data
  },
}
