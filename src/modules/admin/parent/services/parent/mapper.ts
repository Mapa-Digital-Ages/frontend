import type { HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'

export type ParentApprovalUserStatusDto = 'waiting' | 'approved' | 'rejected'
export type ParentApprovalUserRoleDto = 'admin' | 'guardian' | 'student'

export interface ParentApprovalUserDto {
  created_at: string
  email: string
  first_name?: string
  id: string
  is_superadmin: boolean
  last_name?: string
  name: string
  role: ParentApprovalUserRoleDto
  status: ParentApprovalUserStatusDto
}

const parentStatusMap: Record<
  ParentApprovalUserStatusDto,
  ParentApprovalStatus
> = {
  approved: 'approved',
  rejected: 'rejected',
  waiting: 'pendingValidation',
}

const parentStatusDtoMap: Record<
  Exclude<ParentApprovalStatus, 'pendingValidation'>,
  ParentApprovalUserStatusDto
> = {
  approved: 'approved',
  rejected: 'rejected',
}

const statusQueryMap: Partial<
  Record<ParentApprovalStatus, ParentApprovalUserStatusDto>
> = {
  approved: 'approved',
  pendingValidation: 'waiting',
  rejected: 'rejected',
}

const roleLabelMap: Record<ParentApprovalUserRoleDto, string> = {
  admin: 'Administrador',
  guardian: 'Responsável',
  student: 'Aluno',
}

function formatBrazilianDate(value: string) {
  const datePart = value.split('T')[0] ?? value
  const [year, month, day] = datePart.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

function splitDisplayName(name: string) {
  const [firstName = '', ...lastNameParts] = name.trim().split(/\s+/)

  return {
    firstName,
    lastName: lastNameParts.join(' '),
  }
}

function getParentNames(user: ParentApprovalUserDto) {
  const fallback = splitDisplayName(user.name)

  return {
    firstName: user.first_name?.trim() || fallback.firstName,
    lastName: user.last_name?.trim() || fallback.lastName,
  }
}

export function buildParentApprovalQuery(query: ApprovalQueueQuery) {
  const userStatus =
    query.status === 'approved' ||
    query.status === 'pendingValidation' ||
    query.status === 'rejected'
      ? statusQueryMap[query.status]
      : undefined

  return {
    role: 'guardian',
    user_status: userStatus,
  } satisfies HttpRequestOptions['query']
}

export function mapParentStatusToParentApprovalUserStatus(
  status: ParentApprovalStatus
): ParentApprovalUserStatusDto {
  if (status === 'pendingValidation') {
    throw new Error(
      'Não é possível retornar um usuário para aguardando pela fila de aprovação.'
    )
  }

  return parentStatusDtoMap[status]
}

export function mapParentApprovalUserToParentApprovalItem(
  user: ParentApprovalUserDto
): ParentApprovalItem {
  const requestedAt = formatBrazilianDate(user.created_at)
  const roleLabel = roleLabelMap[user.role]
  const name = getParentNames(user)

  return {
    badges: [
      {
        id: `${user.email}-email`,
        label: user.email,
        tone: 'neutral',
      },
      {
        id: `${user.email}-requested-at`,
        label: `Solicitação em ${requestedAt}`,
        tone: 'info',
      },
    ],
    childName: 'Aluno a confirmar',
    id: user.id,
    kind: 'parent',
    name,
    requestedAt,
    roleLabel,
    status: parentStatusMap[user.status],
    subtitle: `${roleLabel} · Solicitação em ${requestedAt}`,
    title: user.name,
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  }
}
