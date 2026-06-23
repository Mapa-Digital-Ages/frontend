import { COOKIE_KEYS } from '@/shared/constants/storage'
import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type { StudentTask, SummaryMetric } from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'

interface CurrentStudentResponse {
  student_class?: string | null
}

export interface StudentDisciplineProgress {
  subjectId: string
  subjectLabel: string
  subjectColor?: string | null
  progress: number
}

interface TrailApiResponse {
  id: string
  name: string
  description?: string | null
  subject?: {
    id?: string
    label: string
    color?: string | null
  }
  progress: number
}

export interface StudentActiveTrail {
  id: string
  name: string
  subject?: {
    id?: string
    label: string
    color?: string | null
  }
  progress: number
}

function formatClassLabel(studentClass?: string | null) {
  if (!studentClass) return undefined
  const match = studentClass.match(/(\d+)/)
  return match ? `${match[1]}º Ano` : studentClass
}

function mapActiveTrail(raw: TrailApiResponse): StudentActiveTrail {
  return {
    id: raw.id,
    name: raw.name,
    progress: raw.progress,
    subject: raw.subject
      ? {
          id: raw.subject.id,
          label: raw.subject.label,
          color: raw.subject.color,
        }
      : undefined,
  }
}

function isActiveTrail(trail: StudentActiveTrail) {
  return trail.progress > 0 && trail.progress < 100
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

  async getDisciplines(): Promise<StudentDisciplineProgress[]> {
    const studentId = authService.getUserId()
    if (!studentId) return []

    const response = await httpClient.get<StudentDisciplineProgress[]>(
      `student/${studentId}/disciplines`
    )
    return response.data
  },

  async getActiveTrails(): Promise<StudentActiveTrail[]> {
    const studentId = authService.getUserId()
    if (!studentId) return []

    const response = await httpClient.get<TrailApiResponse[]>(
      `student/${studentId}/trails`
    )
    return response.data.map(mapActiveTrail).filter(isActiveTrail)
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
