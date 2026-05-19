import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ContentApprovalItem,
} from '@/modules/admin/shared/types/types'
import { getSubjectTagContextByLabel } from '@/shared/utils/themes'

export interface ContentApprovalDto {
  id: string
  title: string
  description?: string | null
  created_at?: string | null
  updated_at?: string | null
  subject: {
    id: string
    name: string
    slug?: string | null
    color?: string | null
  }
}

export interface ApprovalQueueResponseDto<TItem> {
  items: TItem[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

export function buildApprovalQueueQuery(query: ApprovalQueueQuery) {
  return {
    page: query.page,
    page_size: query.pageSize,
    query: query.query.trim() || undefined,
  } satisfies HttpRequestOptions['query']
}

function mapApprovalQueue<TSource, TTarget>(
  response: ApiResponse<ApprovalQueueResponseDto<TSource>>,
  mapItem: (item: TSource) => TTarget
): ApprovalQueueResult<TTarget> {
  return {
    currentPage: response.data.page,
    items: response.data.items.map(mapItem),
    pageSize: response.data.page_size,
    totalItems: response.data.total_items,
    totalPages: response.data.total_pages,
  }
}

function formatBrazilianDate(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function mapContentApprovalItem(
  item: ContentApprovalDto
): ContentApprovalItem {
  const subject = item.subject
    ? {
        color: item.subject.color ?? undefined,
        id: item.subject.id,
        label: item.subject.name,
      }
    : getSubjectTagContextByLabel('')

  const createdAt = formatBrazilianDate(item.created_at)
  const updatedAt = formatBrazilianDate(item.updated_at)
  const subtitleParts: string[] = []
  if (item.subject?.name) subtitleParts.push(item.subject.name)
  if (createdAt) subtitleParts.push(`Criado em ${createdAt}`)
  if (updatedAt && updatedAt !== createdAt) {
    subtitleParts.push(`Atualizado em ${updatedAt}`)
  }

  return {
    id: item.id,
    kind: 'content',
    requestedAt: createdAt,
    status: 'sent',
    subject,
    title: item.title,
    subtitle: subtitleParts.join(' · '),
    description: item.description ?? '',
    badges: [],
  }
}

export function mapContentApprovalQueueResponse(
  response: ApiResponse<ApprovalQueueResponseDto<ContentApprovalDto>>
) {
  return mapApprovalQueue(response, mapContentApprovalItem)
}
