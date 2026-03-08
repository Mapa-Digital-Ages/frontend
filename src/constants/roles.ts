import type { UserRole } from '@/types/user'

export const USER_ROLES: UserRole[] = [
  'student',
  'parent',
  'school',
  'partner',
  'admin',
]

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Aluno',
  parent: 'Responsável',
  school: 'Escola',
  partner: 'Parceiro',
  admin: 'Administrador',
}
