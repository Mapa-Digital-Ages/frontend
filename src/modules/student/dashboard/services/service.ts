import { COOKIE_KEYS } from '@/shared/constants/storage'
import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type { StudentTask, SummaryMetric } from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'

interface CurrentStudentResponse {
  student_class?: string | null
}

function formatClassLabel(studentClass?: string | null) {
  if (!studentClass) return undefined
  const match = studentClass.match(/(\d+)/)
  return match ? `${match[1]}º Ano` : studentClass
}

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

  async getCurrentStudentClassLabel(): Promise<string | undefined> {
    const studentId = authService.getUserId()
    if (!studentId) return undefined

    const response = await httpClient.get<CurrentStudentResponse>(
      `student/${studentId}`
    )
    return formatClassLabel(response.data.student_class)
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
