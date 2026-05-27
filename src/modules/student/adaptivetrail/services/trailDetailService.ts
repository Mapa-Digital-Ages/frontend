import { SUBJECTS } from '@/shared/utils/themes'
import { trails } from '../data/trails'
import type {
  AdaptiveTrailSession,
  RecommendedContent,
  TrailStepAnswerInput,
  TrailStepCompletionResult,
  TrailStepQuestionFlow,
} from '../types/types'

interface AdaptiveTrailDetailRepository {
  getTrailSession(trailId: string): Promise<AdaptiveTrailSession | null>
  getSubStepQuestionFlow(
    trailId: string,
    stepId: string,
    subStepId: string
  ): Promise<TrailStepQuestionFlow>
  saveStepAnswer(input: TrailStepAnswerInput): Promise<void>
  getCompletionRecommendations(
    trailId: string,
    stepTitle: string,
    correct: number,
    total: number
  ): Promise<TrailStepCompletionResult>
}

const mockTrailSessions: Record<string, AdaptiveTrailSession> = {
  math: {
    completedSteps: 0,
    description:
      'Trilha de reforço com foco em equações, variáveis e prática guiada.',
    id: 'math',
    levelLabel: 'Intermediário',
    progress: 33,
    subject: SUBJECTS.matematica,
    timeEstimate: '25 min',
    title: 'Fundamentos de Algebra',
    steps: [
      {
        id: 'equacoes-grau1',
        title: 'Equações do 1º Grau',
        description:
          'Revise igualdade, identifique o termo desconhecido e isole a variável com operações inversas.',
        order: 1,
        status: 'available',
        subSteps: [
          {
            id: 'eq-video',
            kind: 'video',
            title: 'Assistir: Introdução às Equações do 1º Grau',
            description:
              'Vídeo explicativo sobre o conceito de igualdade e isolamento de variável.',
            status: 'available',
            duration: '8 min',
            order: 1,
            questions: [],
          },
          {
            id: 'eq-quiz',
            kind: 'question',
            title: 'Questões de Equações do 1º Grau',
            description:
              'Resolva as questões para consolidar o aprendizado do vídeo.',
            status: 'locked',
            lockReason: 'Libera ao concluir o vídeo',
            duration: '4 min',
            order: 2,
            questions: [
              {
                id: 'math-q1',
                correctOptionId: 'opt-b',
                options: [
                  { id: 'opt-a', label: 'x = 2' },
                  { id: 'opt-b', label: 'x = 3' },
                  { id: 'opt-c', label: 'x = 7' },
                ],
                question: 'Quanto vale x em 2x + 4 = 10?',
                subject: SUBJECTS.matematica,
              },
              {
                id: 'math-q2',
                correctOptionId: 'opt-b',
                options: [
                  { id: 'opt-a', label: 'Somar 5 nos dois lados' },
                  { id: 'opt-b', label: 'Subtrair 5 dos dois lados' },
                  { id: 'opt-c', label: 'Multiplicar os dois lados por 5' },
                ],
                question: 'Qual é o primeiro passo para resolver x + 5 = 12?',
                subject: SUBJECTS.matematica,
              },
            ],
          },
        ],
      },
      {
        id: 'fracoes-decimais',
        title: 'Frações e Decimais',
        description:
          'Esta etapa consolida frações, decimais e problemas práticos.',
        order: 2,
        status: 'available',
        lockReason: 'Libera ao concluir a etapa anterior',
        subSteps: [
          {
            id: 'frac-texto',
            kind: 'question',
            title: 'Leitura: Frações e Números Decimais',
            description:
              'Texto explicativo sobre conversão e operações com frações e decimais.',
            status: 'available',
            lockReason: 'Libera ao concluir a etapa anterior',
            duration: '7 min',
            order: 1,
            questions: [],
          },
          {
            id: 'frac-quiz',
            kind: 'question',
            title: 'Questões sobre Frações',
            description:
              'Resolva os exercícios para fixar o conteúdo de frações.',
            status: 'locked',
            lockReason: 'Libera ao concluir a leitura',
            duration: '7 min',
            order: 2,
            questions: [
              {
                id: 'frac-q1',
                correctOptionId: 'opt-b',
                options: [
                  { id: 'opt-a', label: '0,25' },
                  { id: 'opt-b', label: '0,5' },
                  { id: 'opt-c', label: '0,75' },
                ],
                question: 'Qual é a forma decimal de 1/2?',
                subject: SUBJECTS.matematica,
              },
            ],
          },
        ],
      },
      {
        id: 'problemas-aplicados',
        title: 'Problemas Aplicados',
        description:
          'Resolução de problemas do cotidiano com uso de equações e frações.',
        order: 3,
        status: 'available',
        lockReason: 'Libera ao concluir a etapa anterior',
        subSteps: [
          {
            id: 'prob-quiz',
            kind: 'question',
            title: 'Exercícios de Problemas Aplicados',
            description:
              'Coloque em prática equações e frações em situações reais.',
            status: 'available',
            lockReason: 'Libera ao concluir a etapa anterior',
            duration: '12 min',
            order: 1,
            questions: [],
          },
        ],
      },
    ],
  },
  portuguese: {
    completedSteps: 0,
    description:
      'Sequência por conteúdo para leitura crítica, inferência e argumentação.',
    id: 'portuguese',
    levelLabel: 'Básico',
    progress: 0,
    subject: SUBJECTS.portugues,
    timeEstimate: '19 min',
    title: 'Interpretação de Textos',
    steps: [
      {
        id: 'leitura-compreensao',
        title: 'Leitura e Compreensão',
        description:
          'Aprenda a identificar a ideia central e as informações explícitas e implícitas.',
        order: 1,
        status: 'available',
        subSteps: [
          {
            id: 'leit-texto',
            kind: 'text',
            title: 'Leitura: Técnicas de Interpretação',
            description:
              'Material introdutório sobre leitura crítica e extração de sentido.',
            status: 'available',
            duration: '10 min',
            order: 1,
            questions: [],
          },
        ],
      },
      {
        id: 'argumentacao',
        title: 'Argumentação e Inferência',
        description:
          'Desenvolva argumentos sólidos com base em evidências textuais.',
        order: 2,
        status: 'locked',
        lockReason: 'Libera ao concluir a etapa anterior',
        subSteps: [
          {
            id: 'arg-quiz',
            kind: 'question',
            title: 'Questões de Argumentação',
            description:
              'Exercícios sobre inferência e argumentação em textos.',
            status: 'locked',
            lockReason: 'Libera ao concluir a etapa anterior',
            duration: '9 min',
            order: 1,
            questions: [],
          },
        ],
      },
    ],
  },
}

const recommendedContentBySubject: Record<string, RecommendedContent[]> = {
  mathematics: [
    {
      id: 'mat-c1',
      title: 'Isolamento de variável passo a passo',
      description:
        'Revisão visual do conceito de isolar incógnitas em equações simples.',
      kind: 'video',
    },
    {
      id: 'mat-c2',
      title: 'Propriedades das equações lineares',
      description: 'Resumo teórico sobre igualdade e operações inversas.',
      kind: 'text',
    },
    {
      id: 'mat-c3',
      title: 'Isolamento de variável passo a passo',
      description:
        'Revisão visual do conceito de isolar incógnitas em equações simples.',
      kind: 'video',
    },
    {
      id: 'mat-c4',
      title: 'Propriedades das equações lineares',
      description: 'Resumo teórico sobre igualdade e operações inversas.',
      kind: 'text',
    },
    {
      id: 'mat-c5',
      title: 'Isolamento de variável passo a passo',
      description:
        'Revisão visual do conceito de isolar incógnitas em equações simples.',
      kind: 'video',
    },
    {
      id: 'mat-c6',
      title: 'Propriedades das equações lineares',
      description: 'Resumo teórico sobre igualdade e operações inversas.',
      kind: 'text',
    },
    {
      id: 'mat-c7',
      title: 'Isolamento de variável passo a passo',
      description:
        'Revisão visual do conceito de isolar incógnitas em equações simples.',
      kind: 'video',
    },
    {
      id: 'mat-c8',
      title: 'Propriedades das equações lineares',
      description: 'Resumo teórico sobre igualdade e operações inversas.',
      kind: 'text',
    },
  ],
  portuguese: [
    {
      id: 'por-c1',
      title: 'Como identificar a ideia central de um texto',
      description:
        'Técnicas práticas para leitura crítica e extração de sentido.',
      kind: 'video',
    },
    {
      id: 'por-c2',
      title: 'Inferência e argumentação textual',
      description:
        'Guia de como construir argumentos baseados em evidências do texto.',
      kind: 'text',
    },
  ],
  science: [
    {
      id: 'sci-c1',
      title: 'Cadeias alimentares e ecossistemas',
      description: 'Revisão dos principais conceitos de ecologia aplicada.',
      kind: 'video',
    },
    {
      id: 'sci-c2',
      title: 'Sustentabilidade e ciclos naturais',
      description:
        'Leitura sobre a interdependência dos seres vivos no meio ambiente.',
      kind: 'text',
    },
  ],
  history: [
    {
      id: 'his-c1',
      title: 'Brasil Colonial: contexto histórico',
      description:
        'Linha do tempo e principais eventos da colonização portuguesa.',
      kind: 'video',
    },
    {
      id: 'his-c2',
      title: 'Leitura de fontes históricas primárias',
      description: 'Como interpretar documentos e relatos da época colonial.',
      kind: 'text',
    },
  ],
}

function cloneSession(session: AdaptiveTrailSession): AdaptiveTrailSession {
  return JSON.parse(JSON.stringify(session)) as AdaptiveTrailSession
}

export function createAdaptiveTrailDetailRepository(): AdaptiveTrailDetailRepository {
  return {
    async getTrailSession(trailId) {
      const session = mockTrailSessions[trailId]
      return session ? cloneSession(session) : null
    },

    async getSubStepQuestionFlow(trailId, stepId, subStepId) {
      const session = mockTrailSessions[trailId]
      const step = session?.steps.find(s => s.id === stepId)
      const subStep = step?.subSteps.find(ss => ss.id === subStepId)

      if (!session || !step || !subStep) {
        throw new Error('Sub-etapa não encontrada.')
      }

      return {
        assessmentId: `${trailId}-${stepId}-${subStepId}`,
        questions: JSON.parse(JSON.stringify(subStep.questions)),
        stepId,
        subStepId,
        stepTitle: subStep.title,
        trailId,
      }
    },

    async saveStepAnswer() {
      return Promise.resolve()
    },

    async getCompletionRecommendations(trailId, stepTitle, correct, total) {
      const session = mockTrailSessions[trailId]
      const subjectId = session?.subject?.id ?? ''

      const prioritizedTrails = [
        ...trails.filter(t => t.id !== trailId && t.subject?.id === subjectId),
        ...trails.filter(t => t.id !== trailId && t.subject?.id !== subjectId),
      ]
      const recommendedTrails = prioritizedTrails.slice(0, 2).map(t => ({
        id: t.id,
        name: t.name,
        subject: t.subject as AdaptiveTrailSession['subject'] | undefined,
        steps: t.steps,
        timeEstimate: t.timeEstimate,
      }))

      const content = recommendedContentBySubject[subjectId] ?? []

      return {
        stepTitle,
        correct,
        total,
        subject: session?.subject ?? SUBJECTS.matematica,
        trailTitle: session?.title ?? '',
        recommendedTrails: recommendedTrails,
        recommendedContent: content,
      }
    },
  }
}

export const adaptiveTrailDetailService = createAdaptiveTrailDetailRepository()
