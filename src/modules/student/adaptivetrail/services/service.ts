import { COOKIE_KEYS } from '@/shared/constants/storage'
import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type { StudentTask, SummaryMetric } from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'

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

  getStudentId(): string | null {
    return authService.getUserId()
  },

  async getSummary() {
    const response = await httpClient.get<SummaryMetric[]>('student/summary')
    return response.data
  },

  async getTasks() {
    const response = await httpClient.get<StudentTask[]>('student/tasks')
    return response.data
  },
}
