import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  UploadApprovalItem,
  UploadApprovalQuery,
  UploadApprovalResult,
  UploadApprovalStatus,
  UploadActivityType,
  UploadEditFormValues,
} from '../../types/upload'

export type UploadApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  delete<T>(path: string): Promise<ApiResponse<T>>
}

export interface CreateUploadApprovalRepositoryOptions {
  allowFallback?: boolean
  client: UploadApiClient
}

class HttpRequestError extends Error {
  constructor(
    public readonly status: number,
    statusText: string
  ) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpRequestError'
  }
}

function shouldUseFallback(error: unknown, allowFallback: boolean): boolean {
  if (!allowFallback) return false
  if (
    error instanceof HttpRequestError ||
    (typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as { status: unknown }).status === 'number')
  ) {
    return Number((error as { status: number }).status) >= 500
  }
  return error instanceof Error
}

function normalizeQuery(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function filterMockItems(
  items: UploadApprovalItem[],
  query: UploadApprovalQuery
): UploadApprovalItem[] {
  const normalizedQ = normalizeQuery(query.query)
  return items.filter(item => {
    const matchesStatus = query.status === 'all' || item.status === query.status
    if (!matchesStatus) return false
    if (!normalizedQ) return true
    const searchable = normalizeQuery(
      [
        item.fileName,
        item.studentName,
        item.uploadedAt,
        ...item.badges.map(b => b.label),
      ].join(' ')
    )
    return searchable.includes(normalizedQ)
  })
}

function paginateMockItems(
  items: UploadApprovalItem[],
  query: UploadApprovalQuery
): UploadApprovalResult {
  const pageSize = Math.max(1, query.pageSize)
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(Math.max(1, query.page), totalPages)
  const start = (currentPage - 1) * pageSize
  return {
    currentPage,
    items: items.slice(start, start + pageSize),
    pageSize,
    totalItems,
    totalPages,
  }
}

const ACTIVITY_TYPE_LABELS: Record<UploadActivityType, string> = {
  exercise: 'Exercício',
  essay: 'Redação',
  activity: 'Atividade',
}

let mockUploadItems: UploadApprovalItem[] = [
  {
    id: 'upload-1',
    studentId: 'student-1',
    studentName: 'Ana Beatriz Silva',
    fileName: 'lista_equacoes_7ano.pdf',
    fileType: 'application/pdf',
    downloadUrl: '/uploads/upload-1/content',
    activityType: 'exercise',
    status: 'pending',
    uploadedAt: '22/03/2026',
    badges: [
      { id: 'upload-1-student', label: 'Ana Beatriz Silva', tone: 'neutral' },
      { id: 'upload-1-type', label: 'Exercício', tone: 'info' },
      { id: 'upload-1-date', label: 'Enviado em 22/03/2026', tone: 'info' },
    ],
  },
  {
    id: 'upload-2',
    studentId: 'student-2',
    studentName: 'Carlos Eduardo Mendes',
    fileName: 'redacao_argumentativa.docx',
    fileType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    downloadUrl: '/uploads/upload-2/content',
    activityType: 'essay',
    status: 'inReview',
    uploadedAt: '28/03/2026',
    badges: [
      {
        id: 'upload-2-student',
        label: 'Carlos Eduardo Mendes',
        tone: 'neutral',
      },
      { id: 'upload-2-type', label: 'Redação', tone: 'info' },
      { id: 'upload-2-date', label: 'Enviado em 28/03/2026', tone: 'info' },
    ],
  },
  {
    id: 'upload-3',
    studentId: 'student-1',
    studentName: 'Ana Beatriz Silva',
    fileName: 'atividade_ciencias.pdf',
    fileType: 'application/pdf',
    downloadUrl: '/uploads/upload-3/content',
    activityType: 'activity',
    status: 'correctionInProgress',
    uploadedAt: '01/04/2026',
    badges: [
      { id: 'upload-3-student', label: 'Ana Beatriz Silva', tone: 'neutral' },
      { id: 'upload-3-type', label: 'Atividade', tone: 'info' },
      { id: 'upload-3-date', label: 'Enviado em 01/04/2026', tone: 'info' },
    ],
  },
  {
    id: 'upload-4',
    studentId: 'student-3',
    studentName: 'Fernanda Lima Costa',
    fileName: 'prova_historia.pdf',
    fileType: 'application/pdf',
    downloadUrl: '/uploads/upload-4/content',
    activityType: 'exercise',
    status: 'corrected',
    uploadedAt: '04/04/2026',
    badges: [
      {
        id: 'upload-4-student',
        label: 'Fernanda Lima Costa',
        tone: 'neutral',
      },
      { id: 'upload-4-type', label: 'Exercício', tone: 'info' },
      { id: 'upload-4-date', label: 'Enviado em 04/04/2026', tone: 'info' },
    ],
  },
]

function queryMockUploads(query: UploadApprovalQuery): UploadApprovalResult {
  return paginateMockItems(filterMockItems(mockUploadItems, query), query)
}

function updateMockUploadStatus(
  id: string,
  status: UploadApprovalStatus
): UploadApprovalItem {
  let updated: UploadApprovalItem | undefined
  mockUploadItems = mockUploadItems.map(item => {
    if (item.id !== id) return item
    updated = { ...item, status }
    return updated
  })
  if (!updated) throw new Error(`Upload ${id} not found`)
  return updated
}

function updateMockUploadActivityType(
  id: string,
  values: UploadEditFormValues
): UploadApprovalItem {
  let updated: UploadApprovalItem | undefined
  mockUploadItems = mockUploadItems.map(item => {
    if (item.id !== id) return item
    const typeLabel = ACTIVITY_TYPE_LABELS[values.activityType]
    updated = {
      ...item,
      activityType: values.activityType,
      badges: [
        ...item.badges.filter(b => !b.id.endsWith('-type')),
        { id: `${item.id}-type`, label: typeLabel, tone: 'info' as const },
      ],
    }
    return updated
  })
  if (!updated) throw new Error(`Upload ${id} not found`)
  return updated
}

function removeMockUpload(id: string): void {
  mockUploadItems = mockUploadItems.filter(item => item.id !== id)
}

export function createUploadApprovalRepository({
  allowFallback = false,
  client,
}: CreateUploadApprovalRepositoryOptions) {
  return {
    async getUploadQueue(
      query: UploadApprovalQuery
    ): Promise<UploadApprovalResult> {
      if (allowFallback) {
        return queryMockUploads(query)
      }
      throw new Error(
        'Endpoint GET /admin/uploads não implementado no backend. Habilite VITE_ENABLE_API_FALLBACK=true em dev.'
      )
    },

    async updateUploadStatus(
      id: string,
      status: UploadApprovalStatus
    ): Promise<UploadApprovalItem> {
      if (allowFallback) {
        return updateMockUploadStatus(id, status)
      }
      throw new Error(
        'Endpoint PATCH /uploads/{id}/status não implementado no backend.'
      )
    },

    async updateUploadActivityType(
      id: string,
      values: UploadEditFormValues
    ): Promise<UploadApprovalItem> {
      if (allowFallback) {
        return updateMockUploadActivityType(id, values)
      }
      throw new Error(
        'Endpoint PATCH /uploads/{id} não implementado no backend.'
      )
    },

    async removeUpload(id: string): Promise<void> {
      try {
        await client.delete<unknown>(`uploads/${id}`)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) throw error
        removeMockUpload(id)
      }
    },
  }
}
