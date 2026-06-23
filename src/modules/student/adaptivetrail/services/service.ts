import { COOKIE_KEYS } from '@/shared/constants/storage'
import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type { StudentTask, SummaryMetric } from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'
import type { SubjectGroup, Trail } from '../types/types'

interface TrailApiResponse {
  id: string
  name: string
  description: string
  subject?: {
    id?: string
    label: string
    color?: string
  }
  steps: number
  completed: number
  progress: number
  time_estimate?: string | null
}

function mapTrail(raw: TrailApiResponse): Trail {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    subject: raw.subject
      ? {
          id: raw.subject.id,
          label: raw.subject.label,
          color: raw.subject.color,
        }
      : undefined,
    steps: raw.steps,
    completed: raw.completed,
    progress: raw.progress,
    timeEstimate: raw.time_estimate ?? null,
  }
}

export function getTrailMetrics(trails: Trail[]): SummaryMetric[] {
  const inProgress = trails.filter(
    trail => trail.progress > 0 && trail.progress < 100
  ).length
  const completed = trails.filter(trail => trail.progress >= 100).length
  const available = trails.filter(trail => trail.progress === 0).length
  const subjects = new Set(trails.map(trail => trail.subject?.id ?? 'geral'))
    .size

  return [
    { id: 'in-progress', title: 'Em andamento', value: inProgress },
    { id: 'completed', title: 'Concluídas', value: completed },
    { id: 'available', title: 'Disponíveis', value: available },
    { id: 'subjects', title: 'Matérias', value: subjects },
  ]
}

export function groupTrailsBySubject(trails: Trail[]): SubjectGroup[] {
  const groups = new Map<string, SubjectGroup>()

  trails.forEach(trail => {
    const subjectId = trail.subject?.id ?? 'geral'
    const group = groups.get(subjectId)
    if (group) {
      group.trails.push(trail)
      group.averageProgress = Math.round(
        group.trails.reduce((sum, item) => sum + item.progress, 0) /
          group.trails.length
      )
      return
    }
    groups.set(subjectId, {
      subjectId,
      subject: trail.subject,
      trails: [trail],
      averageProgress: Math.round(trail.progress),
    })
  })

  return Array.from(groups.values())
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

  async listTrails(studentId: string): Promise<Trail[]> {
    const response = await httpClient.get<TrailApiResponse[]>(
      `student/${studentId}/trails`
    )
    return response.data.map(mapTrail)
  },
}
