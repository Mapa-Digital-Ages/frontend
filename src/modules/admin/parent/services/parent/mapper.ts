import type { HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import type { UserRole } from '@/shared/types/user'

export type ParentApprovalUserStatusDto = 'aguardando' | 'aprovado' | 'negado'

export interface ParentApprovalUserDto {
  created_at: string
  email: string
  id: number
  is_superadmin: boolean
  name: string
  role: UserRole
  status: ParentApprovalUserStatusDto
}

const parentStatusMap: Record<
  ParentApprovalUserStatusDto,
  ParentApprovalStatus
> = {
  aguardando: 'pendingValidation',
  aprovado: 'approved',
  negado: 'rejected',
}

const parentStatusDtoMap: Record<
  Exclude<ParentApprovalStatus, 'pendingValidation'>,
  ParentApprovalUserStatusDto
> = {
  approved: 'aprovado',
  rejected: 'negado',
}

const statusQueryMap: Partial<
  Record<ParentApprovalStatus, ParentApprovalUserStatusDto>
> = {
  approved: 'aprovado',
  pendingValidation: 'aguardando',
  rejected: 'negado',
}

const roleLabelMap: Record<UserRole, string> = {
  admin: 'Administrador',
  aluno: 'Aluno',
  empresa: 'Empresa',
  escola: 'Escola',
  escola_empresa: 'Escola & Empresa',
  responsavel: 'Responsável',
}

function formatBrazilianDate(value: string) {
  const datePart = value.split('T')[0] ?? value
  const [year, month, day] = datePart.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

export function buildParentApprovalQuery(query: ApprovalQueueQuery) {
  const userStatus =
    query.status === 'approved' ||
    query.status === 'pendingValidation' ||
    query.status === 'rejected'
      ? statusQueryMap[query.status]
      : undefined

  return {
    role: 'responsavel',
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
    id: user.email,
    kind: 'parent',
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
