import type { SchoolStudent, SummaryMetric } from '@/types/common'

const schoolSummary: SummaryMetric[] = [
  {
    id: 'students',
    title: 'Estudantes ativos',
    value: 432,
    helperText: 'Distribuídos em 16 turmas',
  },
  {
    id: 'adoption',
    title: 'Adoção da plataforma',
    value: '84%',
    helperText: 'Crescimento desde o último bimestre',
  },
]

const schoolStudents: SchoolStudent[] = [
  {
    id: 'student-1',
    name: 'Ana Ferreira',
    className: '8º A',
    engagement: 94,
  },
  {
    id: 'student-2',
    name: 'Lucas Almeida',
    className: '7º B',
    engagement: 88,
  },
  {
    id: 'student-3',
    name: 'Marina Costa',
    className: '9º A',
    engagement: 79,
  },
]

export const schoolService = {
  async getSummary() {
    return Promise.resolve(schoolSummary)
  },
  async getStudents() {
    return Promise.resolve(schoolStudents)
  },
}
