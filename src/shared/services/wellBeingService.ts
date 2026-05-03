import { HttpRequestError, httpClient } from '@/shared/lib/http/client'
import type { WeeklyMoodEntry } from '@/shared/types/common'

export type WellBeingHumor = 'good' | 'regular' | 'bad'

interface WellBeingApiResponse {
  student_id: string
  date: string
  humor: WellBeingHumor | null
  online_activity_minutes: number | null
  sleep_hours: number | null
}

function isHttpStatus(error: unknown, status: number): boolean {
  return error instanceof HttpRequestError && error.status === status
}

export const wellBeingService = {
  async getStudentDay(
    studentId: string,
    isoDate: string
  ): Promise<WellBeingApiResponse | null> {
    try {
      const response = await httpClient.get<WellBeingApiResponse>(
        `student/${studentId}/well-being?date=${encodeURIComponent(isoDate)}`
      )
      return response.data
    } catch (error) {
      if (isHttpStatus(error, 404)) return null
      throw error
    }
  },

  async upsertToday(
    studentId: string,
    humor: WellBeingHumor
  ): Promise<WellBeingApiResponse> {
    const response = await httpClient.put<WellBeingApiResponse>(
      `student/${studentId}/well-being`,
      { humor }
    )
    return response.data
  },

  async getStudentHistory(
    studentId: string,
    fromIso: string,
    toIso: string
  ): Promise<WeeklyMoodEntry[]> {
    try {
      const response = await httpClient.get<WellBeingApiResponse[]>(
        `student/${studentId}/well-being/history?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`
      )
      return response.data
        .filter(record => record.humor !== null)
        .map(record => ({
          date: record.date,
          mood: record.humor,
        }))
    } catch (error) {
      if (isHttpStatus(error, 404) || isHttpStatus(error, 403)) return []
      throw error
    }
  },
}
