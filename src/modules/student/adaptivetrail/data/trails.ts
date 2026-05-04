import type { TagContext } from '@/shared/types/common'
import { SUBJECTS } from '@/shared/utils/themes'

export interface Trail {
  id: string
  name: string
  subject?: TagContext
  description: string
  progress: number
  steps: number
  completed: number
  timeEstimate: string
}

export const trails: Trail[] = [
  {
    id: 'math',
    name: 'Fundamentos de Algebra',
    subject: SUBJECTS.matematica,
    description:
      'Trilha de reforço com foco em equações, variáveis e prática guiada.',
    progress: 33,
    steps: 3,
    completed: 1,
    timeEstimate: '25 min',
  },
  {
    id: 'portuguese',
    name: 'Interpretacao de Textos',
    subject: SUBJECTS.portugues,
    description:
      'Sequência por conteúdo para leitura crítica, inferência e argumentação.',
    progress: 0,
    steps: 2,
    completed: 0,
    timeEstimate: '19 min',
  },
  {
    id: 'science',
    name: 'Ecossistemas e Meio Ambiente',
    subject: SUBJECTS.ciencias,
    description:
      'Caminho por conteúdos para aprofundar fenômenos naturais e sustentabilidade.',
    progress: 0,
    steps: 2,
    completed: 0,
    timeEstimate: '24 min',
  },
  {
    id: 'history',
    name: 'Brasil Colonia',
    subject: SUBJECTS.historia,
    description:
      'Trilha com contexto histórico, linha do tempo e leitura de fontes.',
    progress: 50,
    steps: 2,
    completed: 1,
    timeEstimate: '23 min',
  },
]

export interface TrailMetric {
  id: string
  title: string
  value: number
}

export function getTrailMetrics(): TrailMetric[] {
  const inProgress = trails.filter(
    trail => trail.progress > 0 && trail.progress < 100
  ).length
  const completed = trails.filter(trail => trail.progress >= 100).length
  const available = trails.filter(trail => trail.progress === 0).length
  const subjects = new Set(trails.map(trail => trail.subject?.id)).size

  return [
    { id: 'progress', title: 'Em Andamento', value: inProgress },
    { id: 'complete', title: 'Concluídas', value: completed },
    { id: 'available', title: 'Disponíveis', value: available },
    { id: 'subjects', title: 'Matérias', value: subjects },
  ]
}
