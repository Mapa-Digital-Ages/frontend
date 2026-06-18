import { SUBJECTS } from '@/shared/utils/themes'
import type { FilterOption } from '@/modules/student/shared/types/types'
import type { ContentTrail } from '../types/types'
import { TagContext } from '@/shared/types/common'

export const contentTrails: ContentTrail[] = [
  {
    articleCount: 2,
    completedSteps: 1,
    description:
      'Trilha de reforço com foco em equações, variáveis e prática guiada.',
    id: 'math-fundamentos-algebra',
    name: 'Fundamentos de Algebra',
    progress: 33,
    steps: 3,
    subject: SUBJECTS.matematica,
    timeEstimate: '25 min',
    videoCount: 1,
  },
  {
    articleCount: 1,
    completedSteps: 0,
    description:
      'Sequência por conteúdo para leitura crítica, inferência e argumentação.',
    id: 'portuguese-interpretacao-textos',
    name: 'Interpretacao de Textos',
    progress: 0,
    steps: 2,
    subject: SUBJECTS.portugues,
    timeEstimate: '19 min',
    videoCount: 1,
  },
  {
    articleCount: 1,
    completedSteps: 0,
    description:
      'Caminho por conteúdos para aprofundar fenômenos naturais e sustentabilidade.',
    id: 'science-ecossistemas-meio-ambiente',
    name: 'Ecossistemas e Meio Ambiente',
    progress: 0,
    steps: 2,
    subject: SUBJECTS.ciencias,
    timeEstimate: '24 min',
    videoCount: 1,
  },
  {
    articleCount: 1,
    completedSteps: 1,
    description:
      'Trilha com contexto histórico, linha do tempo e leitura de fontes.',
    id: 'history-brasil-colonia',
    name: 'Brasil Colonia',
    progress: 50,
    steps: 2,
    subject: SUBJECTS.historia,
    timeEstimate: '23 min',
    videoCount: 1,
  },
]

export function getContentFilterOptions(): FilterOption[] {
  return [
    { label: 'Todos', subject: null, value: 'all' },
    ...Object.values(SUBJECTS)
      .filter((subject): subject is TagContext & { id: string } => !!subject.id)
      .map(subject => ({
        label: subject.label,
        subject,
        value: subject.id,
      })),
  ]
}
