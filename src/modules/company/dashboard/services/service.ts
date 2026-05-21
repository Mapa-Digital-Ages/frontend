import type { CompanyStat } from '@/shared/types/common'
import type { SupportRequest, SupportedSchool } from '../types/types'

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

const supportRequests: SupportRequest[] = [
  {
    id: 'request-1',
    schoolName: 'Escola São Paulo',
    description: 'Estamos solicitando apoio para 200 alunos da nossa escola..',
    status: 'aguardando',
  },
  {
    id: 'request-2',
    schoolName: 'Escola São Paulo',
    description: 'Estamos solicitando apoio para 200 alunos da nossa escola..',
    status: 'aguardando',
  },
]

const supportedSchools: SupportedSchool[] = [
  {
    id: 'school-1',
    schoolName: 'Escola São Paulo',
    description: 'Estamos solicitando apoio para 200 alunos da nossa escola..',
    status: 'apoiada',
  },
]

export const companyDashboardService = {
  getTitle(): string {
    return 'Impacto Educacional'
  },

  async getStats(): Promise<CompanyStat[]> {
    return Promise.resolve(companyStats)
  },

  async getSupportRequests(): Promise<SupportRequest[]> {
    return Promise.resolve(supportRequests)
  },

  async getSupportedSchools(): Promise<SupportedSchool[]> {
    return Promise.resolve(supportedSchools)
  },
}
