import type { UserRole } from '@/types/user'

export const USER_ROLES: UserRole[] = ['student', 'parent', 'admin']

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Aluno',
  parent: 'Responsáveis',
  admin: 'Administrador',
}
