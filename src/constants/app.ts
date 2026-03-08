import type { UserRole } from '@/types/user'

export const APP_CONFIG = {
  name: 'Mapa Digital',
  description:
    'Base frontend escalável com navegação por perfis, dashboards e autenticação mock.',
  drawerWidth: 288,
  defaultRole: 'student' as UserRole,
}

export const ROLE_DASHBOARD_TITLE: Record<UserRole, string> = {
  student: 'Painel do Aluno',
  parent: 'Painel do Responsável',
  school: 'Painel da Escola',
  partner: 'Painel do Parceiro',
  admin: 'Painel Administrativo',
}
