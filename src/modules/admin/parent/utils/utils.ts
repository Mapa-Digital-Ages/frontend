import type {
  ApprovalFilter,
  ApprovalItem,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ParentApprovalItem,
} from '@/modules/admin/shared/types/types'

interface ParentApprovalEligibility {
  canApprove: boolean
  missingRequirements: string[]
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function getSearchableApprovalText(item: ApprovalItem) {
  const parts = [
    item.title,
    item.subtitle,
    ...item.badges.map(badge => badge.label),
  ]

  if (item.kind === 'parent') {
    parts.push(item.childName)
  }

  return normalizeSearchValue(parts.join(' '))
}

export function filterApprovalItems<TItem extends ApprovalItem>(
  items: TItem[],
  filters: ApprovalFilter
) {
  const normalizedQuery = normalizeSearchValue(filters.query)

  return items.filter(item => {
    const matchesStatus =
      filters.status === 'all' || item.status === filters.status

    if (!matchesStatus) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return getSearchableApprovalText(item).includes(normalizedQuery)
  })
}

export function paginateApprovalItems<TItem>(
  items: TItem[],
  query: Pick<ApprovalQueueQuery, 'page' | 'pageSize'>
): ApprovalQueueResult<TItem> {
  const safePageSize = Math.max(1, query.pageSize)
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize))
  const currentPage = Math.min(Math.max(1, query.page), totalPages)
  const startIndex = (currentPage - 1) * safePageSize

  return {
    currentPage,
    items: items.slice(startIndex, startIndex + safePageSize),
    pageSize: safePageSize,
    totalItems,
    totalPages,
  }
}

export function getParentApprovalEligibility(
  item: ParentApprovalItem
): ParentApprovalEligibility {
  const missingRequirements = [
    item.validation.hasDocument ? null : 'documento',
    item.validation.relationshipConfirmed ? null : 'vínculo',
    item.validation.studentLinked ? null : 'aluno',
  ].filter((value): value is string => value !== null)

  return {
    canApprove: missingRequirements.length === 0,
    missingRequirements,
  }
}
