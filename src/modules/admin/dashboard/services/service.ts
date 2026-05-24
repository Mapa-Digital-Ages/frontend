import { httpClient } from '@/shared/lib/http/client'
import type { Stat } from '@/shared/types/common'

export const adminService = {
  async getStats(): Promise<Stat[]> {
    const [studentsRes, companiesRes, schoolsRes, guardiansRes] =
      await Promise.allSettled([
        httpClient.get<{ total: number }>('student/count'),
        httpClient.get<{ total: number }>('company/count'),
        httpClient.get<{ items: unknown[]; total: number }>('school', {
          query: { page: 1, size: 1 },
        }),
        httpClient.get<{ items: unknown[]; total: number }>('guardian', {
          query: { guardian_status: 'waiting', page: 1, size: 1 },
        }),
      ])

    const getTotal = (
      result: PromiseSettledResult<{ data: { total: number } }>
    ) => (result.status === 'fulfilled' ? result.value.data.total : 0)

    return [
      {
        id: 'students-count',
        label: 'Alunos Cadastrados',
        value: String(getTotal(studentsRes)),
        description: 'total de alunos cadastrados',
      },
      {
        id: 'companies-count',
        label: 'Empresas',
        value: String(getTotal(companiesRes)),
        description: 'empresas cadastradas',
      },
      {
        id: 'schools-count',
        label: 'Escolas',
        value: String(getTotal(schoolsRes)),
        description: 'escolas cadastradas',
      },
      {
        id: 'pending-guardians',
        label: 'Responsáveis Pendentes',
        value: String(getTotal(guardiansRes)),
        description: 'responsáveis aguardando aprovação',
      },
    ]
  },
}
