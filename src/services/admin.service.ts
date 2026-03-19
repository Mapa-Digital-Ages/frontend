import type { AdminStat } from '@/types/common'

const adminStats: AdminStat[] = [
  {
    id: 'users-active',
    label: 'Usuários Ativos',
    value: '1.248',
    description: 'últimas 24h',
  },
  {
    id: 'critical-alerts',
    label: 'Alertas Críticos',
    value: '12',
    description: 'monitoramento em tempo real',
  },
  {
    id: 'pending-actions',
    label: 'Ações Pendentes',
    value: '34',
    description: 'fila de revisão',
  },
  {
    id: 'uptime',
    label: 'Disponibilidade',
    value: '99,9%',
    description: 'últimos 30 dias',
  },
]

export const adminService = {
  async getStats() {
    return Promise.resolve(adminStats)
  },
}
