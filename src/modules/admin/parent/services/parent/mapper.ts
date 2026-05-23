import type { HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  GuardianItem,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'

export type GuardianStatusDto = 'waiting' | 'approved' | 'rejected'

export interface GuardianStudentDto {
  user_id: string
  first_name: string
  last_name: string
  email: string
  birth_date: string
  student_class: string
}

export interface GuardianResponseDto {
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  guardian_status: GuardianStatusDto
  is_active: boolean
  created_at: string | null
  deactivated_at: string | null
  students: GuardianStudentDto[]
}

export interface GuardianListPaginatedDto {
  items: GuardianResponseDto[]
  total: number
  page: number
  size: number
}

const guardianStatusMap: Record<GuardianStatusDto, ParentApprovalStatus> = {
  waiting: 'pendingValidation',
  approved: 'approved',
  rejected: 'rejected',
}

const guardianStatusDtoMap: Record<
  Exclude<ParentApprovalStatus, 'pendingValidation'>,
  GuardianStatusDto
> = {
  approved: 'approved',
  rejected: 'rejected',
}

export function buildGuardianListQuery(
  query: ApprovalQueueQuery
): HttpRequestOptions['query'] {
  const guardianStatus: GuardianStatusDto | undefined =
    query.status === 'approved'
      ? 'approved'
      : query.status === 'pendingValidation'
        ? 'waiting'
        : query.status === 'rejected'
          ? 'rejected'
          : undefined

  return {
    page: query.page,
    size: query.pageSize,
    name: query.query.trim() || undefined,
    guardian_status: guardianStatus,
  }
}

function formatBrazilianDate(value: string | null): string {
  if (!value) return 'Data desconhecida'
  const datePart = value.split('T')[0] ?? value
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function getFirstLinkedStudentName(students: GuardianStudentDto[]): string {
  if (students.length === 0) return 'Aluno a confirmar'
  const s = students[0]!
  return `${s.first_name} ${s.last_name}`.trim()
}

function buildGuardianItem(dto: GuardianResponseDto): GuardianItem {
  return {
    email: dto.email,
    first_name: dto.first_name,
    last_name: dto.last_name,
    phone_number: dto.phone_number ?? '',
  }
}

export function mapGuardianResponseToParentApprovalItem(
  dto: GuardianResponseDto
): ParentApprovalItem {
  const requestedAt = formatBrazilianDate(dto.created_at)
  const guardian = buildGuardianItem(dto)
  const fullName =
    `${dto.first_name} ${dto.last_name}`.trim() || 'Responsável sem nome'
  const childName = getFirstLinkedStudentName(dto.students)

  return {
    badges: [
      {
        id: `${dto.user_id}-email`,
        label: dto.email,
        tone: 'neutral',
      },
      {
        id: `${dto.user_id}-requested-at`,
        label: `Solicitação em ${requestedAt}`,
        tone: 'info',
      },
    ],
    childName,
    guardian,
    id: dto.user_id,
    kind: 'parent',
    name: {
      firstName: guardian.first_name,
      lastName: guardian.last_name,
    },
    requestedAt,
    roleLabel: 'Responsável',
    status: guardianStatusMap[dto.guardian_status],
    subtitle: `Responsável · Solicitação em ${requestedAt}`,
    title: fullName,
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: dto.students.length > 0,
    },
  }
}

export function mapParentStatusToGuardianStatusDto(
  status: ParentApprovalStatus
): GuardianStatusDto {
  if (status === 'pendingValidation') {
    throw new Error(
      'Não é possível retornar um responsável para aguardando pela fila de aprovação.'
    )
  }
  return guardianStatusDtoMap[status]
}
