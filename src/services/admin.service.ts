import type { AdminStat, AdminUser } from '@/types/common'

const adminStats: AdminStat[] = [
  {
    id: 'users',
    label: 'Usuários cadastrados',
    value: '1.248',
    description: 'Base unificada de perfis',
  },
  {
    id: 'schools',
    label: 'Escolas conectadas',
    value: '32',
    description: 'Organizações com dados ativos',
  },
  {
    id: 'uptime',
    label: 'Disponibilidade',
    value: '99,9%',
    description: 'Indicador operacional do ambiente',
  },
]

const adminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Equipe Administrativa',
    email: 'admin@mapadigital.com',
    role: 'admin',
    organization: 'Gestão Mapa Digital',
    lastAccess: '2026-03-08T09:30:00',
  },
  {
    id: 'school-1',
    name: 'Juliana Mota',
    email: 'escola@mapadigital.com',
    role: 'school',
    organization: 'Escola Horizonte',
    lastAccess: '2026-03-07T18:15:00',
  },
  {
    id: 'partner-1',
    name: 'Instituto Ponte',
    email: 'partner@mapadigital.com',
    role: 'partner',
    organization: 'Rede Parceira',
    lastAccess: '2026-03-06T15:00:00',
  },
]

export const adminService = {
  async getStats() {
    return Promise.resolve(adminStats)
  },
  async getUsers() {
    return Promise.resolve(adminUsers)
  },
}
