import { httpClient } from '@/shared/lib/http/client'
import type { TagContext } from '@/shared/types/common'

export interface Trail {
  id: string
  name: string
  subject?: TagContext
  description: string
  progress: number
  steps: number
  completed: number
  timeEstimate: string | null
}

interface TrailApiResponse {
  id: string
  name: string
  description: string
  subject: { id: string; label: string; color?: string }
  steps: number
  completed: number
  progress: number
  time_estimate: string | null
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
    timeEstimate: raw.time_estimate,
  }
}

export async function fetchTrails(studentId: string): Promise<Trail[]> {
  const response = await httpClient.get<TrailApiResponse[]>(
    `student/${studentId}/trails`
  )
  return response.data.map(mapTrail)
}

export interface TrailMetric {
  id: string
  title: string
  value: number
}

export function getTrailMetrics(trails: Trail[]): TrailMetric[] {
  const inProgress = trails.filter(
    t => t.progress > 0 && t.progress < 100
  ).length
  const completed = trails.filter(t => t.progress >= 100).length
  const available = trails.filter(t => t.progress === 0).length
  const subjects = new Set(trails.map(t => t.subject?.id)).size

  return [
    { id: 'progress', title: 'Em Andamento', value: inProgress },
    { id: 'complete', title: 'Concluídas', value: completed },
    { id: 'available', title: 'Disponíveis', value: available },
    { id: 'subjects', title: 'Matérias', value: subjects },
  ]
}

export interface SubjectGroup {
  subjectId: string
  subject?: TagContext
  trails: Trail[]
  averageProgress: number
}

const NO_SUBJECT_KEY = '__no_subject__'

/**
 * Group trails by their subject so the UI can show one card per subject, each
 * containing that subject's trails. Subject order follows first appearance.
 */
export function groupTrailsBySubject(trails: Trail[]): SubjectGroup[] {
  const order: string[] = []
  const bySubject = new Map<string, Trail[]>()

  for (const trail of trails) {
    const key = trail.subject?.id ?? NO_SUBJECT_KEY
    if (!bySubject.has(key)) {
      bySubject.set(key, [])
      order.push(key)
    }
    bySubject.get(key)!.push(trail)
  }

  return order.map(key => {
    const groupTrails = bySubject.get(key)!
    const averageProgress = Math.round(
      groupTrails.reduce((sum, t) => sum + t.progress, 0) / groupTrails.length
    )
    return {
      subjectId: key,
      subject: groupTrails[0].subject,
      trails: groupTrails,
      averageProgress,
    }
  })
}
