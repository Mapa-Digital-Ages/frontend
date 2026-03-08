import type { StudentTask, SummaryMetric } from '@/types/common'

const studentSummary: SummaryMetric[] = [
  {
    id: 'completed',
    title: 'Atividades concluídas',
    value: 18,
    helperText: '3 a mais que na semana passada',
  },
  {
    id: 'engagement',
    title: 'Engajamento',
    value: '92%',
    helperText: 'Meta mensal atingida',
  },
]

const studentTasks: StudentTask[] = [
  {
    id: 'task-1',
    title: 'Revisar geografia do Brasil',
    subject: 'Geografia',
    dueDate: '2026-03-12',
    status: 'pending',
  },
  {
    id: 'task-2',
    title: 'Enviar exercício de matemática',
    subject: 'Matemática',
    dueDate: '2026-03-10',
    status: 'inProgress',
  },
  {
    id: 'task-3',
    title: 'Leitura orientada',
    subject: 'Português',
    dueDate: '2026-03-09',
    status: 'completed',
  },
]

export const studentService = {
  async getSummary() {
    return Promise.resolve(studentSummary)
  },
  async getTasks() {
    return Promise.resolve(studentTasks)
  },
}
