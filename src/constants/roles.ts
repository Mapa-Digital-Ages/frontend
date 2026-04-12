import type { UserRole } from '@/types/user'

export const USER_ROLES: UserRole[] = ['student', 'parent', 'admin', 'empresa', 'escola']

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Aluno',
  parent: 'Responsável',
  admin: 'Administrador',
  empresa: 'Empresa',
  escola: 'Escola',
}
