import dayjs from 'dayjs'
import type { SummaryMetric, WeeklyMoodEntry } from '@/shared/types/common'
import type { StudentDisciplineProgress } from '../types/types'
import type { Task } from '@/modules/student/shared/components/Planner'

// NOTE: temporary mock — replace each field with real API data as endpoints become available
export const MOCK_METRICS: SummaryMetric[] = [
  {
    id: 'streak',
    title: 'Sequência de dias',
    value: 7,
    helperText: 'dias consecutivos',
  },
  {
    id: 'completed',
    title: 'Atividades concluídas',
    value: 12,
    helperText: 'esta semana',
  },
  { id: 'pending', title: 'Pendências', value: 3, helperText: 'a entregar' },
]

export const MOCK_DISCIPLINES: StudentDisciplineProgress[] = [
  { subjectId: 'mat', subjectLabel: 'Matemática', progress: 78 },
  { subjectId: 'por', subjectLabel: 'Português', progress: 85 },
  { subjectId: 'cie', subjectLabel: 'Ciências', progress: 62 },
  { subjectId: 'his', subjectLabel: 'História', progress: 90 },
  { subjectId: 'geo', subjectLabel: 'Geografia', progress: 71 },
]

const today = dayjs()

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-001',
    date: today.subtract(2, 'day').toDate(),
    title: 'Lista de exercícios – Frações',
    status: 'done',
    subject: {
      id: 'mat',
      label: 'Matemática',
      color: '#4CAF50',
      contrastColor: '#fff',
    },
  },
  {
    id: 'task-002',
    date: today.subtract(1, 'day').toDate(),
    title: 'Redação sobre meio ambiente',
    status: 'adjust',
    subject: {
      id: 'por',
      label: 'Português',
      color: '#2196F3',
      contrastColor: '#fff',
    },
  },
  {
    id: 'task-003',
    date: today.toDate(),
    title: 'Experimento de fotossíntese',
    status: 'pending',
    subject: {
      id: 'cie',
      label: 'Ciências',
      color: '#FF9800',
      contrastColor: '#fff',
    },
  },
  {
    id: 'task-004',
    date: today.add(1, 'day').toDate(),
    title: 'Linha do tempo – Revolução Industrial',
    status: 'pending',
    subject: {
      id: 'his',
      label: 'História',
      color: '#9C27B0',
      contrastColor: '#fff',
    },
  },
  {
    id: 'task-005',
    date: today.add(3, 'day').toDate(),
    title: 'Mapa dos biomas brasileiros',
    status: 'pending',
    subject: {
      id: 'geo',
      label: 'Geografia',
      color: '#00BCD4',
      contrastColor: '#fff',
    },
  },
]

const MOOD_SEQUENCE: Array<WeeklyMoodEntry['mood']> = [
  'good',
  'good',
  'regular',
  'bad',
  'regular',
  'good',
  'good',
  'good',
  'regular',
  'good',
  'good',
  'good',
  'regular',
  'good',
  'bad',
  'regular',
  'good',
  'good',
  'good',
  'regular',
  'good',
  'good',
  'good',
  null,
  'good',
  'regular',
  'good',
  'good',
]

export const MOCK_WELL_BEING: WeeklyMoodEntry[] = MOOD_SEQUENCE.map(
  (mood, i) => ({
    date: today.subtract(27 - i, 'day').format('YYYY-MM-DD'),
    mood,
  })
)
