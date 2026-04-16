import type { UserRole } from '@/shared/types/user'

export const USER_ROLES: UserRole[] = [
  'aluno',
  'responsavel',
  'admin',
  'empresa',
  'escola',
  'escola_empresa',
]

export const ROLE_LABELS: Record<UserRole, string> = {
  aluno: 'Aluno',
  responsavel: 'Responsável',
  admin: 'Administrador',
  empresa: 'Empresa',
  escola: 'Escola',
  escola_empresa: 'Escola & Empresa',
}
