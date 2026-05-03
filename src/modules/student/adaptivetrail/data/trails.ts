export interface Trail {
  id: string
  name: string
  category: string
  description: string
  progress: number
  steps: number
  completed: number
  timeEstimate: string
  color: string
}

export const trails: Trail[] = [
  {
    id: 'math',
    name: 'Fundamentos de Algebra',
    category: 'Matemática',
    description:
      'Trilha de reforço com foco em equações, variáveis e prática guiada.',
    progress: 33,
    steps: 3,
    completed: 1,
    timeEstimate: '25 min',
    color: 'rgb(100, 150, 200)',
  },
  {
    id: 'portuguese',
    name: 'Interpretacao de Textos',
    category: 'Português',
    description:
      'Sequência por conteúdo para leitura crítica, inferência e argumentação.',
    progress: 0,
    steps: 2,
    completed: 0,
    timeEstimate: '19 min',
    color: 'rgb(180, 100, 200)',
  },
  {
    id: 'science',
    name: 'Ecossistemas e Meio Ambiente',
    category: 'Ciências',
    description:
      'Caminho por conteúdos para aprofundar fenômenos naturais e sustentabilidade.',
    progress: 0,
    steps: 2,
    completed: 0,
    timeEstimate: '24 min',
    color: 'rgb(100, 180, 100)',
  },
  {
    id: 'history',
    name: 'Brasil Colonia',
    category: 'História',
    description:
      'Trilha com contexto histórico, linha do tempo e leitura de fontes.',
    progress: 50,
    steps: 2,
    completed: 1,
    timeEstimate: '23 min',
    color: 'rgb(230, 150, 80)',
  },
]
