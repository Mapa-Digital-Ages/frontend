import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import {
  filterApprovalItems,
  paginateApprovalItems,
} from '@/modules/admin/parent/utils/utils'
import {
  buildParentApprovalQuery,
  mapParentApprovalUserToParentApprovalItem,
  mapParentStatusToParentApprovalUserStatus,
  type ParentApprovalUserDto,
} from './mapper'

export type ParentApprovalApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
  ): Promise<ApiResponse<T>>
}

export interface CreateParentApprovalRepositoryOptions {
  client: ParentApprovalApiClient
}

function buildUserStatusPath(email: string) {
  return `admin/users/${encodeURIComponent(email)}/status`
}

const localParentApprovalItems: ParentApprovalItem[] = []
const removedParentApprovalIds = new Set<string>()
const parentApprovalOverrides = new Map<
  string,
  Partial<Pick<ParentApprovalItem, 'childName' | 'requestedAt' | 'title'>>
>()

function buildParentSubtitle(requestedAt?: string) {
  return requestedAt
    ? `Responsável · Solicitação em ${requestedAt}`
    : 'Responsável · Cadastro manual'
}

function applyParentLocalState(items: ParentApprovalItem[]) {
  const remoteItems = items
    .filter(item => !removedParentApprovalIds.has(item.id))
    .map(item => {
      const override = parentApprovalOverrides.get(item.id)

      if (!override) {
        return item
      }

      const requestedAt = override.requestedAt ?? item.requestedAt

      return {
        ...item,
        ...override,
        requestedAt,
        subtitle: buildParentSubtitle(requestedAt),
      }
    })

  const remoteIds = new Set(remoteItems.map(item => item.id))
  const localOnlyItems = localParentApprovalItems.filter(
    item => !remoteIds.has(item.id) && !removedParentApprovalIds.has(item.id)
  )

  return [...localOnlyItems, ...remoteItems]
}

function createLocalParentApprovalItem(
  input: ParentApprovalDraftInput
): ParentApprovalItem {
  const id = input.email?.trim() || `parent-${Date.now()}`
  const requestedAt = input.requestedAt ?? 'Agora'
  const nextItem: ParentApprovalItem = {
    badges: [
      {
        id: `${id}-manual`,
        label: 'Cadastro manual',
        tone: 'info',
      },
    ],
    childName: input.childName?.trim() || 'Aluno a confirmar',
    id,
    kind: 'parent',
    requestedAt,
    roleLabel: 'Responsável',
    status: 'pendingValidation',
    subtitle: buildParentSubtitle(requestedAt),
    title: input.title.trim() || 'Novo responsável',
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  }

  localParentApprovalItems.unshift(nextItem)
  removedParentApprovalIds.delete(id)

  return nextItem
}

function updateLocalParentApprovalItem(
  id: string,
  input: ParentApprovalDraftInput
): ParentApprovalItem {
  let nextItem: ParentApprovalItem | undefined
  const update = {
    childName: input.childName?.trim() || 'Aluno a confirmar',
    requestedAt: input.requestedAt,
    title: input.title.trim() || 'Responsável sem nome',
  }

  for (const [index, item] of localParentApprovalItems.entries()) {
    if (item.id !== id) {
      continue
    }

    const requestedAt = update.requestedAt ?? item.requestedAt
    nextItem = {
      ...item,
      ...update,
      requestedAt,
      subtitle: buildParentSubtitle(requestedAt),
    }
    localParentApprovalItems[index] = nextItem
    break
  }

  if (!nextItem) {
    parentApprovalOverrides.set(id, update)
    nextItem = {
      badges: [],
      childName: update.childName,
      id,
      kind: 'parent',
      requestedAt: update.requestedAt,
      roleLabel: 'Responsável',
      status: 'pendingValidation',
      subtitle: buildParentSubtitle(update.requestedAt),
      title: update.title,
      validation: {
        hasDocument: true,
        relationshipConfirmed: true,
        studentLinked: true,
      },
    }
  }

  return nextItem
}

function removeLocalParentApprovalItem(id: string) {
  removedParentApprovalIds.add(id)

  const index = localParentApprovalItems.findIndex(item => item.id === id)

  if (index >= 0) {
    localParentApprovalItems.splice(index, 1)
  }
}

export function createParentApprovalRepository({
  client,
}: CreateParentApprovalRepositoryOptions) {
  return {
    async getParentQueue(query: ApprovalQueueQuery) {
      const response = await client.get<ParentApprovalUserDto[]>(
        'admin/users',
        {
          query: buildParentApprovalQuery(query),
        }
      )
      const items = response.data.map(mapParentApprovalUserToParentApprovalItem)
      const filteredItems = filterApprovalItems(
        applyParentLocalState(items),
        query
      )

      return paginateApprovalItems(filteredItems, query)
    },
    async createParentRegistration(
      input: ParentApprovalDraftInput
    ): Promise<void> {
      try {
        await client.post<unknown>(
          'register',
          {
            email: input.email,
            name: input.title,
            password: input.password,
          },
          { skipAuth: true }
        )
      } catch {
        // Mantem o fluxo de cadastro funcional na tela enquanto a API final de responsável não cobre edição/exclusão.
      }

      createLocalParentApprovalItem(input)
    },
    async updateLocalParentRegistration(
      id: string,
      input: ParentApprovalDraftInput
    ): Promise<ParentApprovalItem> {
      return updateLocalParentApprovalItem(id, input)
    },
    async removeLocalParentRegistration(id: string): Promise<void> {
      removeLocalParentApprovalItem(id)
    },
    async updateParentStatus(
      email: string,
      status: ParentApprovalStatus
    ): Promise<ParentApprovalItem> {
      const response = await client.patch<ParentApprovalUserDto>(
        buildUserStatusPath(email),
        {
          status: mapParentStatusToParentApprovalUserStatus(status),
        }
      )

      return mapParentApprovalUserToParentApprovalItem(response.data)
    },
  }
}
