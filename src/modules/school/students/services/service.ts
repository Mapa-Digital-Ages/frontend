import type { SchoolStudentsData } from '../types/types'

const MOCK_DATA: SchoolStudentsData = {
  visibleStudents: 3,
  schools: 1,
  students: [
    {
      id: '1',
      name: 'Lucas Silva',
      guardian: 'Maria Silva',
      school: 'Escola São Paulo',
      grade: '7º',
      status: 'Ativo',
    },
    {
      id: '2',
      name: 'Carlos Nunes',
      guardian: 'Roberta Nunes',
      school: 'Escola São Paulo',
      grade: '7º',
      status: 'Inativo',
    },
    {
      id: '3',
      name: 'Lívia Santos',
      guardian: 'Paula Santos',
      school: 'Escola São Paulo',
      grade: '6º',
      status: 'Ativo',
    },
  ],
}

export const schoolStudentsService = {
  async getStudentsData(): Promise<SchoolStudentsData> {
    return Promise.resolve(MOCK_DATA)
  },
}
