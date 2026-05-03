import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalBadgeTone,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ContentApprovalItem,
  ContentApprovalResourceType,
  ContentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import { getSubjectTagContextByLabel } from '@/shared/utils/themes'

export type ContentApprovalStatusDto =
  | 'approved'
  | 'correction_in_progress'
  | 'in_review'
  | 'rejected'
  | 'sent'
export interface ApprovalTagDto {
  id: string
  label: string
  tone: ApprovalBadgeTone
}

export interface ContentApprovalDto {
  id: string
  requested_at: string
  resource_type: 'exam' | 'task'
  stage_label: string
  status: ContentApprovalStatusDto
  subject_label: string
  tags: ApprovalTagDto[]
  title: string
}

export interface ApprovalQueueResponseDto<TItem> {
  items: TItem[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

const contentResourceLabelMap = {
  exam: 'Prova',
  task: 'Tarefa',
} as const satisfies Record<ContentApprovalResourceType, string>

const contentStatusMap: Record<
  ContentApprovalStatusDto,
  ContentApprovalStatus
> = {
  approved: 'approved',
  correction_in_progress: 'correctionInProgress',
  in_review: 'inReview',
  rejected: 'rejected',
  sent: 'sent',
}

function formatBrazilianDate(value: string) {
  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

export function buildApprovalQueueQuery(query: ApprovalQueueQuery) {
  return {
    page: query.page,
    page_size: query.pageSize,
    query: query.query.trim() || undefined,
    status:
      query.status === 'all'
        ? undefined
        : query.status === 'inReview'
          ? 'in_review'
          : query.status === 'pendingValidation'
            ? 'pending_validation'
            : query.status,
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

export function mapContentApprovalItem(
  item: ContentApprovalDto
): ContentApprovalItem {
  return {
    id: item.id,
    kind: 'content',
    requestedAt: formatBrazilianDate(item.requested_at),
    resourceType: item.resource_type,
    subject: getSubjectTagContextByLabel(item.stage_label),
    title: item.title,
    subtitle: `${contentResourceLabelMap[item.resource_type]} · ${
      item.stage_label
    } · ${formatBrazilianDate(item.requested_at)}`,
    status: contentStatusMap[item.status],
    badges: item.tags.map(tag => ({
      id: tag.id,
      label: tag.label,
      tone: tag.tone,
    })),
  }
}

export function mapContentApprovalQueueResponse(
  response: ApiResponse<ApprovalQueueResponseDto<ContentApprovalDto>>
) {
  return mapApprovalQueue(response, mapContentApprovalItem)
}
