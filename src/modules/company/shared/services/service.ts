import type { CompanyStat } from '@/shared/types/common'

const companyStats: CompanyStat[] = [
  {
    id: 'supported-schools',
    label: 'Escolas Apoiadas',
    value: '3',
    description: 'escolas ativas no programa',
  },
  {
    id: 'impacted-students',
    label: 'Alunos Impactados',
    value: '370',
    description: 'alunos beneficiados',
  },
]

export const companyService = {
  getTitle(): string {
    return 'Impacto Educacional'
  },

  async getStats(): Promise<CompanyStat[]> {
    return Promise.resolve(companyStats)
  },
}
