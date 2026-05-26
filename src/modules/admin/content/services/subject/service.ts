import { httpClient } from '@/shared/lib/http/client'
import type { SubjectItem } from '@/modules/admin/shared/types/types'

interface SubjectDto {
  id: string
  slug?: string | null
  name: string
  color?: string | null
  content_count: number
  tasks_count: number
  uploads_count: number
  references_count: number
}

function mapSubject(dto: SubjectDto): SubjectItem {
  return {
    id: dto.id,
    slug: dto.slug ?? undefined,
    name: dto.name,
    color: dto.color ?? undefined,
    contentCount: dto.content_count,
    tasksCount: dto.tasks_count,
    uploadsCount: dto.uploads_count,
    trailsCount: 0,
    questionnaireCount: 0,
  }
}

export const subjectService = {
  async listSubjects(): Promise<SubjectItem[]> {
    const response = await httpClient.get<SubjectDto[]>('admin/subjects')
    return response.data.map(mapSubject)
  },

  async getSubject(id: string): Promise<SubjectItem> {
    const response = await httpClient.get<SubjectDto>(`admin/subjects/${id}`)
    return mapSubject(response.data)
  },

  async createSubject(name: string, color?: string): Promise<SubjectItem> {
    const response = await httpClient.post<SubjectDto>('admin/subjects', {
      color,
      name,
    })
    return mapSubject(response.data)
  },

  async updateSubject(
    id: string,
    payload: { name?: string; color?: string }
  ): Promise<SubjectItem> {
    const response = await httpClient.patch<SubjectDto>(
      `admin/subjects/${id}`,
      payload
    )
    return mapSubject(response.data)
  },

  async deleteSubject(id: string): Promise<void> {
    await httpClient.delete<unknown>(`admin/subjects/${id}`)
  },
}
