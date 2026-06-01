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

  async getTasksForDate(studentId: string, dateStr: string) {
    const response = await httpClient.get<Task[]>(
      `student/${studentId}/calendar/${dateStr}`
    )
    return response.data
  },

  async syncCalendarDay(
    studentId: string,
    dateStr: string,
    tasks: Array<{
      id?: number | null
      title: string
      task_status?: string | null
      subject_id: number | null
    }>
  ) {
    const response = await httpClient.put<Task[]>(
      `student/${studentId}/calendar/${dateStr}`,
      { tasks }
    )
    return response.data
  },

  async listSubjects() {
    const response = await httpClient.get<
      Array<{
        id: number | string
        slug?: string | null
        name: string
        color?: string | null
      }>
    >('subjects')
    return response.data.map(dto => ({
      id: Number(dto.id),
      slug: dto.slug ?? null,
      name: dto.name,
    }))
  },
}
