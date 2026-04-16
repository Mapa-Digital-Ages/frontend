import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalCorrectionInput,
  ContentCorrectionMessageInput,
  ContentCorrectionSession,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ContentApprovalDraftInput,
  ContentApprovalItem,
  ContentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import {
  filterApprovalItems,
  paginateApprovalItems,
} from '@/modules/admin/parent/utils/utils'
import { getSubjectTagContextByLabel } from '@/shared/utils/themes'
import {
  buildApprovalQueueQuery,
  mapContentApprovalItem,
  mapContentApprovalQueueResponse,
  type ApprovalQueueResponseDto,
  type ContentApprovalDto,
} from './mapper'

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
  post<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
}

export interface CreateContentApprovalRepositoryOptions {
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

const mockContentCorrectionMessages: Record<
  string,
  ContentCorrectionSession['messages']
> = {
  'content-1': [
    {
      author: 'aluno',
      body: 'Enviei a resolução da lista. Fiquei em dúvida na questão 4.',
      createdAt: '22/03/2026 14:22',
      id: 'message-content-1-1',
    },
    {
      author: 'admin',
      body: 'Vou revisar seu upload e te aviso por aqui o que precisa ajustar.',
      createdAt: '22/03/2026 14:36',
      id: 'message-content-1-2',
    },
  ],
}

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

function getMockContentCorrectionSession(id: string): ContentCorrectionSession {
  const item = mockContentApprovalItems.find(
    contentItem => contentItem.id === id
  )

  if (!item) {
    throw new Error(`Content approval ${id} not found`)
  }

  return {
    contentId: item.id,
    messages: mockContentCorrectionMessages[item.id] ?? [
      {
        author: 'aluno',
        body: 'Atividade enviada para correção.',
        createdAt: item.requestedAt ?? 'Agora',
        id: `${item.id}-message-student`,
      },
    ],
    requestedAt: item.requestedAt,
    resourceType: item.resourceType,
    status:
      item.status === 'correctionInProgress'
        ? 'inProgress'
        : item.status === 'approved'
          ? 'completed'
          : 'pending',
    subject: item.subject,
    subtitle: item.subtitle,
    title: item.title,
    uploadFileName: `${item.title}.pdf`,
  }
}

function markMockContentCorrectionInProgress(
  id: string
): ContentCorrectionSession {
  updateMockContentStatus(id, 'correctionInProgress')

  const currentMessages = mockContentCorrectionMessages[id] ?? []

  if (
    !currentMessages.some(message =>
      message.body.includes('Correção iniciada pelo administrador')
    )
  ) {
    mockContentCorrectionMessages[id] = [
      ...currentMessages,
      {
        author: 'admin',
        body: 'Correção iniciada pelo administrador.',
        createdAt: 'Agora',
        id: `${id}-message-in-progress`,
      },
    ]
  }

  return getMockContentCorrectionSession(id)
}

function sendMockContentCorrectionMessage(
  id: string,
  input: ContentCorrectionMessageInput
): ContentCorrectionSession {
  const body = input.body.trim()

  if (!body) {
    return getMockContentCorrectionSession(id)
  }

  mockContentCorrectionMessages[id] = [
    ...(mockContentCorrectionMessages[id] ?? []),
    {
      author: 'admin',
      body,
      createdAt: 'Agora',
      id: `${id}-message-${Date.now()}`,
    },
  ]

  return getMockContentCorrectionSession(id)
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

function removeMockContentItem(id: string) {
  mockContentApprovalItems = mockContentApprovalItems.filter(
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

function formatCorrectionOutcomeLabel(
  outcome: ApprovalCorrectionInput['outcome']
) {
  switch (outcome) {
    case 'completed':
      return 'Atividade corrigida'
    case 'completedWithNotes':
      return 'Corrigida com observações'
    case 'redo':
      return 'Refazer atividade'
    default:
      return 'Correção registrada'
  }
}

function applyMockContentCorrection(
  id: string,
  correction: ApprovalCorrectionInput
): ContentApprovalItem {
  let nextItem: ContentApprovalItem | undefined

  mockContentApprovalItems = mockContentApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    const correctionBadges = [
      {
        id: `${item.id}-correction-outcome`,
        label: formatCorrectionOutcomeLabel(correction.outcome),
        tone:
          correction.outcome === 'redo'
            ? ('warning' as const)
            : ('success' as const),
      },
      {
        id: `${item.id}-correction-feedback`,
        label: correction.feedback,
        tone: 'neutral' as const,
      },
    ]

    nextItem = {
      ...item,
      badges: [
        ...correctionBadges,
        ...item.badges.filter(
          badge =>
            badge.id !== `${item.id}-correction-outcome` &&
            badge.id !== `${item.id}-correction-feedback`
        ),
      ],
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Content approval ${id} not found`)
  }

  return nextItem
}

export function createContentApprovalRepository({
  allowFallback = false,
  client,
}: CreateContentApprovalRepositoryOptions) {
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
    async updateContentStatus(id: string, status: ContentApprovalStatus) {
      const remoteStatus =
        status === 'inReview'
          ? 'in_review'
          : status === 'correctionInProgress'
            ? 'correction_in_progress'
            : status

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
    async createLocalContentDraft(input?: ContentApprovalDraftInput) {
      return createMockContentDraft(input)
    },
    async updateLocalContentItem(id: string, input: ContentApprovalDraftInput) {
      return updateMockContentItem(id, input)
    },
    async applyContentCorrection(
      id: string,
      correction: ApprovalCorrectionInput
    ) {
      return applyMockContentCorrection(id, correction)
    },
    async getContentCorrectionSession(id: string) {
      try {
        const response = await client.get<ContentCorrectionSession>(
          `admin/approvals/content/${id}/correction`
        )

        return response.data
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return getMockContentCorrectionSession(id)
      }
    },
    async markContentCorrectionInProgress(id: string) {
      try {
        const response = await client.patch<ContentCorrectionSession>(
          `admin/approvals/content/${id}/correction/status`,
          { status: 'correction_in_progress' }
        )

        return response.data
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return markMockContentCorrectionInProgress(id)
      }
    },
    async sendContentCorrectionMessage(
      id: string,
      input: ContentCorrectionMessageInput
    ) {
      try {
        const response = await client.post<ContentCorrectionSession>(
          `admin/approvals/content/${id}/correction/messages`,
          input
        )

        return response.data
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return sendMockContentCorrectionMessage(id, input)
      }
    },
    async removeLocalContentItem(id: string) {
      removeMockContentItem(id)
    },
  }
}
