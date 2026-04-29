import { SUBJECTS } from '@/shared/utils/themes'
import type { ParentDashboardData } from '../types/types'

const weekDay = (weekOffset: number, dayOffset: number): string => {
  const d = new Date()
  // anchor on Monday of current week
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  d.setDate(d.getDate() + weekOffset * 7 + dayOffset)
  return d.toISOString().slice(0, 10)
}

export const PARENT_DASHBOARD_MOCK: ParentDashboardData = {
  child: {
    id: 'mock-student-1',
    name: 'Lucas Silva',
    grade: '7º Ano',
  },
  children: [
    { id: 'mock-student-1', name: 'Lucas Silva', grade: '7º Ano' },
    { id: 'mock-student-2', name: 'Ana Silva', grade: '5º Ano' },
  ],
  metrics: [
    { id: 'streak', title: 'Sequência do Aluno', value: '5 dias' },
    { id: 'activities', title: 'Atividades Feitas', value: 18 },
  ],
  disciplines: [
    { subjectId: 'matematica', subjectLabel: 'Matemática', progress: 78 },
    { subjectId: 'portugues', subjectLabel: 'Português', progress: 82 },
    { subjectId: 'ciencias', subjectLabel: 'Ciências', progress: 68 },
    { subjectId: 'historia', subjectLabel: 'História', progress: 70 },
  ],
  tasks: [
    {
      id: 'mock-task-1',
      date: (() => {
        const d = new Date()
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
        return d
      })(),
      title: 'Revisão de equações',
      status: 'done',
      subject: SUBJECTS.matematica,
    },
    {
      id: 'mock-task-2',
      date: (() => {
        const d = new Date()
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 1)
        return d
      })(),
      title: 'Leitura e interpretação',
      status: 'done',
      subject: SUBJECTS.portugues,
    },
    {
      id: 'mock-task-3',
      date: (() => {
        const d = new Date()
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3)
        return d
      })(),
      title: 'Exercícios de Brasil Colônia',
      status: 'done',
      subject: SUBJECTS.historia,
    },
  ],
  wellBeing: [
    // current week (Mon–Fri)
    { date: weekDay(0, 0), mood: 'good' },
    { date: weekDay(0, 1), mood: 'good' },
    { date: weekDay(0, 2), mood: 'regular' },
    { date: weekDay(0, 3), mood: 'bad' },
    { date: weekDay(0, 4), mood: 'good' },
    // previous week
    { date: weekDay(-1, 0), mood: 'good' },
    { date: weekDay(-1, 1), mood: 'good' },
    { date: weekDay(-1, 2), mood: 'good' },
    { date: weekDay(-1, 3), mood: 'regular' },
    { date: weekDay(-1, 4), mood: 'good' },
  ],
}
