import type { UserRole } from '@/types/user'

export const USER_ROLES: UserRole[] = [
  'aluno',
  'responsavel',
  'admin',
  'empresa',
  'escola',
]

export const ROLE_LABELS: Record<UserRole, string> = {
  aluno: 'Aluno',
  responsavel: 'Responsável',
  admin: 'Administrador',
  empresa: 'Empresa',
  escola: 'Escola',
}
