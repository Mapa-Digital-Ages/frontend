import type { StudentRecord, StudentIndicator } from '../types/types'

const students: StudentRecord[] = [
  {
    id: 'student-1',
    name: 'Lucas Silva',
    responsible: 'Maria Silva',
    school: 'Escola São Paulo',
    year: '7º',
    attendance: 92,
    risk: 'médio',
    status: 'atenção',
  },
  {
    id: 'student-2',
    name: 'Carlos Nunes',
    responsible: 'Roberta Nunes',
    school: 'Escola São Paulo',
    year: '8º',
    attendance: 88,
    risk: 'médio',
    status: 'atenção',
  },
  {
    id: 'student-3',
    name: 'Lívia Santos',
    responsible: 'Paulo Santos',
    school: 'Escola São Paulo',
    year: '6º',
    attendance: 97,
    risk: 'baixo',
    status: 'estável',
  },
]

const indicators: StudentIndicator[] = [
  {
    id: 'visible-students',
    title: 'Alunos Visíveis',
    value: 3,
  },
  {
    id: 'no-class',
    title: 'Sem Turma',
    value: 0,
  },
  {
    id: 'high-risk',
    title: 'Risco Alto',
    value: 0,
  },
  {
    id: 'schools',
    title: 'Escolas',
    value: 1,
  },
]

export const studentsService = {
  getTitle(): string {
    return 'Escola | Gestão de Alunos'
  },

  getSubtitle(): string {
    return 'Cadastre alunos, mova entre turmas e ajuste vínculos quando necessário.'
  },

  getIndicators(): StudentIndicator[] {
    return indicators
  },

  async getStudents(): Promise<StudentRecord[]> {
    return Promise.resolve(students)
  },
}
