import type { ApiResponse, HttpRequestOptions } from '../../types/api'
import type {
  ApprovalCorrectionInput,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ContentApprovalDraftInput,
  ContentApprovalItem,
  ContentApprovalStatus,
  GuardianApprovalDraftInput,
  GuardianApprovalItem,
  GuardianApprovalStatus,
} from '../../types/admin'
import { filterApprovalItems, paginateApprovalItems } from '../../utils/admin'
import { getSubjectTagContextByLabel } from '../../utils/themes'
import {
  buildApprovalQueueQuery,
  mapContentApprovalItem,
  mapContentApprovalQueueResponse,
  mapGuardianApprovalItem,
  mapGuardianApprovalQueueResponse,
  type ApprovalQueueResponseDto,
  type ContentApprovalDto,
  type GuardianApprovalDto,
} from './admin-approval.mapper'

function formatRequestDateBadge(requestedAt: string) {
  return {
    id: `${requestedAt}-requested-at`,
    label: `Solicitação em ${requestedAt}`,
    tone: 'neutral' as const,
  }
}

function buildContentSubtitle(item: {
  requestedAt: string
  resourceType: 'exam' | 'task'
  subjectLabel: string
}) {
  return `${item.resourceType === 'exam' ? 'Prova' : 'Tarefa'} · ${
    item.subjectLabel
  } · ${item.requestedAt}`
}

export class HttpRequestError extends Error {
  constructor(
    public readonly status: number,
    statusText: string
  ) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpRequestError'
  }
}

export type ApprovalApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
}

export interface CreateAdminApprovalRepositoryOptions {
  allowFallback?: boolean
  client: ApprovalApiClient
}

let mockContentApprovalItems: ContentApprovalItem[] = [
  {
    id: 'content-1',
    kind: 'content',
    requestedAt: '22/03/2026',
    resourceType: 'task',
    subject: getSubjectTagContextByLabel('Matemática'),
    title: 'Lista de Equações do 7º ano',
    subtitle: 'Tarefa · Matemática · 22/03/2026',
    status: 'inReview',
    badges: [
      {
        id: 'content-1-origin',
        label: 'Upload de aluno',
        tone: 'neutral',
      },
    ],
  },
  {
    id: 'content-2',
    kind: 'content',
    requestedAt: '28/03/2026',
    resourceType: 'exam',
    subject: getSubjectTagContextByLabel('Português'),
    title: 'Prova mensal de interpretação',
    subtitle: 'Prova · Português · 28/03/2026',
    status: 'sent',
    badges: [
      {
        id: 'content-2-group',
        label: 'Alunos',
        tone: 'neutral',
      },
      {
        id: 'content-2-school',
        label: 'Escolas',
        tone: 'neutral',
      },
      {
        id: 'content-2-linked',
        label: '2 questões vinculadas',
        tone: 'danger',
      },
    ],
  },
  {
    id: 'content-3',
    kind: 'content',
    requestedAt: '01/04/2026',
    resourceType: 'task',
    subject: getSubjectTagContextByLabel('Português'),
    title: 'Produção textual argumentativa',
    subtitle: 'Tarefa · Português · 01/04/2026',
    status: 'approved',
    badges: [
      {
        id: 'content-3-school',
        label: 'Turma 7B',
        tone: 'info',
      },
    ],
  },
  {
    id: 'content-4',
    kind: 'content',
    requestedAt: '04/04/2026',
    resourceType: 'exam',
    subject: getSubjectTagContextByLabel('Ciências'),
    title: 'Simulado de Ciências naturais',
    subtitle: 'Prova · Ciências · 04/04/2026',
    status: 'rejected',
    badges: [
      {
        id: 'content-4-note',
        label: 'Correção obrigatória',
        tone: 'warning',
      },
    ],
  },
]

let mockGuardianApprovalItems: GuardianApprovalItem[] = [
  {
    id: 'guardian-1',
    kind: 'guardian',
    requestedAt: '01/04/2026',
    roleLabel: 'Mãe',
    title: 'Mariana Souza',
    subtitle: 'Solicitação em 01/04/2026',
    status: 'pendingValidation',
    badges: [formatRequestDateBadge('01/04/2026')],
    childName: 'Luiza Souza',
    validation: {
      hasDocument: false,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
  {
    id: 'guardian-2',
    kind: 'guardian',
    requestedAt: '02/04/2026',
    roleLabel: 'Pai',
    title: 'Carlos Santos',
    subtitle: 'Solicitação em 02/04/2026',
    status: 'pendingValidation',
    badges: [formatRequestDateBadge('02/04/2026')],
    childName: 'Rafael Santos',
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
  {
    id: 'guardian-3',
    kind: 'guardian',
    requestedAt: '03/04/2026',
    roleLabel: 'Mãe',
    title: 'Renata Lima',
    subtitle: 'Solicitação em 03/04/2026',
    status: 'approved',
    badges: [formatRequestDateBadge('03/04/2026')],
    childName: 'Gabriel Lima',
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
  {
    id: 'guardian-4',
    kind: 'guardian',
    requestedAt: '05/04/2026',
    roleLabel: 'Pai',
    title: 'Paulo Mendes',
    subtitle: 'Solicitação em 05/04/2026',
    status: 'rejected',
    badges: [formatRequestDateBadge('05/04/2026')],
    childName: 'Ana Mendes',
    validation: {
      hasDocument: true,
      relationshipConfirmed: false,
      studentLinked: true,
    },
  },
]

function shouldUseFallback(error: unknown, allowFallback: boolean) {
  if (!allowFallback) {
    return false
  }

  if (
    error instanceof HttpRequestError ||
    (typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof error.status === 'number')
  ) {
    return Number(error.status) >= 500
  }

  return error instanceof Error
}

function queryMockContentApprovals(
  query: ApprovalQueueQuery
): ApprovalQueueResult<ContentApprovalItem> {
  const filteredItems = filterApprovalItems(mockContentApprovalItems, query)

  return paginateApprovalItems(filteredItems, query)
}

function queryMockGuardianApprovals(
  query: ApprovalQueueQuery
): ApprovalQueueResult<GuardianApprovalItem> {
  const filteredItems = filterApprovalItems(mockGuardianApprovalItems, query)

  return paginateApprovalItems(filteredItems, query)
}

function updateMockContentStatus(
  id: string,
  status: ContentApprovalStatus
): ContentApprovalItem {
  let nextItem: ContentApprovalItem | undefined

  mockContentApprovalItems = mockContentApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    nextItem = {
      ...item,
      status,
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Content approval ${id} not found`)
  }

  return nextItem
}

function updateMockGuardianStatus(
  id: string,
  status: GuardianApprovalStatus
): GuardianApprovalItem {
  let nextItem: GuardianApprovalItem | undefined

  mockGuardianApprovalItems = mockGuardianApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    nextItem = {
      ...item,
      status,
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Guardian approval ${id} not found`)
  }

  return nextItem
}

function createMockContentDraft(input?: ContentApprovalDraftInput) {
  const itemId = `content-${Date.now()}`
  const requestedAt = input?.requestedAt ?? '10/04/2026'
  const resourceType = input?.resourceType ?? 'exam'
  const subject = input?.subject ?? getSubjectTagContextByLabel('Ciências')
  const nextItem: ContentApprovalItem = {
    id: itemId,
    kind: 'content',
    requestedAt,
    resourceType,
    subject,
    title: input?.title ?? 'Nova avaliação em preparação',
    subtitle: buildContentSubtitle({
      requestedAt,
      resourceType,
      subjectLabel: subject?.label ?? 'Geral',
    }),
    status: 'sent',
    badges: [
      {
        id: `${itemId}-badge-origin`,
        label: 'Cadastro manual',
        tone: 'info',
      },
      {
        id: `${itemId}-badge-audience`,
        label: '7º ano',
        tone: 'neutral',
      },
    ],
  }

  mockContentApprovalItems = [nextItem, ...mockContentApprovalItems]

  return nextItem
}

function createMockGuardianDraft(input?: GuardianApprovalDraftInput) {
  const itemId = `guardian-${Date.now()}`
  const requestedAt = input?.requestedAt ?? '07/04/2026'
  const roleLabel = input?.roleLabel ?? 'Responsável'
  const nextItem: GuardianApprovalItem = {
    id: itemId,
    kind: 'guardian',
    requestedAt,
    roleLabel,
    title: input?.title ?? 'Novo responsável em triagem',
    subtitle: `${roleLabel} · Solicitação em ${requestedAt}`,
    status: 'pendingValidation',
    badges: [formatRequestDateBadge(requestedAt)],
    childName: input?.childName ?? 'Aluno a confirmar',
    validation: {
      hasDocument: false,
      relationshipConfirmed: false,
      studentLinked: false,
    },
  }

  mockGuardianApprovalItems = [nextItem, ...mockGuardianApprovalItems]

  return nextItem
}

function removeMockContentItem(id: string) {
  mockContentApprovalItems = mockContentApprovalItems.filter(
    item => item.id !== id
  )
}

function removeMockGuardianItem(id: string) {
  mockGuardianApprovalItems = mockGuardianApprovalItems.filter(
    item => item.id !== id
  )
}

function updateMockContentItem(
  id: string,
  input: ContentApprovalDraftInput
): ContentApprovalItem {
  let nextItem: ContentApprovalItem | undefined

  mockContentApprovalItems = mockContentApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    const requestedAt = input.requestedAt ?? item.requestedAt ?? '10/04/2026'
    const resourceType = input.resourceType ?? item.resourceType ?? 'exam'
    const subject = input.subject ?? item.subject

    nextItem = {
      ...item,
      requestedAt,
      resourceType,
      subject,
      title: input.title,
      subtitle: buildContentSubtitle({
        requestedAt,
        resourceType,
        subjectLabel: subject?.label ?? 'Geral',
      }),
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Content approval ${id} not found`)
  }

  return nextItem
}

function updateMockGuardianItem(
  id: string,
  input: GuardianApprovalDraftInput
): GuardianApprovalItem {
  let nextItem: GuardianApprovalItem | undefined

  mockGuardianApprovalItems = mockGuardianApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    const requestedAt = input.requestedAt ?? item.requestedAt ?? '07/04/2026'

    nextItem = {
      ...item,
      badges: [formatRequestDateBadge(requestedAt)],
      childName: input.childName,
      requestedAt,
      roleLabel: input.roleLabel,
      subtitle: `${input.roleLabel} · Solicitação em ${requestedAt}`,
      title: input.title,
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Guardian approval ${id} not found`)
  }

  return nextItem
}

function requestMockContentCorrection(
  id: string,
  correction: ApprovalCorrectionInput
): ContentApprovalItem {
  let nextItem: ContentApprovalItem | undefined

  mockContentApprovalItems = mockContentApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    const correctionBadge = {
      id: `${item.id}-correction`,
      label: correction.note,
      tone: 'warning' as const,
    }

    nextItem = {
      ...item,
      badges: [
        correctionBadge,
        ...item.badges.filter(badge => badge.id !== correctionBadge.id),
      ],
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Content approval ${id} not found`)
  }

  return nextItem
}

export function createAdminApprovalRepository({
  allowFallback = false,
  client,
}: CreateAdminApprovalRepositoryOptions) {
  return {
    async getContentQueue(query: ApprovalQueueQuery) {
      try {
        const response = await client.get<
          ApprovalQueueResponseDto<ContentApprovalDto>
        >('admin/approvals/content', {
          query: buildApprovalQueueQuery(query),
        })

        return mapContentApprovalQueueResponse(response)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return queryMockContentApprovals(query)
      }
    },
    async getGuardianQueue(query: ApprovalQueueQuery) {
      try {
        const response = await client.get<
          ApprovalQueueResponseDto<GuardianApprovalDto>
        >('admin/approvals/guardians', {
          query: buildApprovalQueueQuery(query),
        })

        return mapGuardianApprovalQueueResponse(response)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return queryMockGuardianApprovals(query)
      }
    },
    async updateContentStatus(id: string, status: ContentApprovalStatus) {
      const remoteStatus = status === 'inReview' ? 'in_review' : status

      try {
        const response = await client.patch<ContentApprovalDto>(
          `admin/approvals/content/${id}/status`,
          { status: remoteStatus }
        )

        return mapContentApprovalItem(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return updateMockContentStatus(id, status)
      }
    },
    async updateGuardianStatus(id: string, status: GuardianApprovalStatus) {
      const remoteStatus =
        status === 'pendingValidation' ? 'pending_validation' : status

      try {
        const response = await client.patch<GuardianApprovalDto>(
          `admin/approvals/guardians/${id}/status`,
          { status: remoteStatus }
        )

        return mapGuardianApprovalItem(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return updateMockGuardianStatus(id, status)
      }
    },
    async createLocalContentDraft(input?: ContentApprovalDraftInput) {
      return createMockContentDraft(input)
    },
    async createLocalGuardianDraft(input?: GuardianApprovalDraftInput) {
      return createMockGuardianDraft(input)
    },
    async updateLocalContentItem(id: string, input: ContentApprovalDraftInput) {
      return updateMockContentItem(id, input)
    },
    async updateLocalGuardianItem(
      id: string,
      input: GuardianApprovalDraftInput
    ) {
      return updateMockGuardianItem(id, input)
    },
    async requestContentCorrection(
      id: string,
      correction: ApprovalCorrectionInput
    ) {
      return requestMockContentCorrection(id, correction)
    },
    async removeLocalContentItem(id: string) {
      removeMockContentItem(id)
    },
    async removeLocalGuardianItem(id: string) {
      removeMockGuardianItem(id)
    },
  }
}
