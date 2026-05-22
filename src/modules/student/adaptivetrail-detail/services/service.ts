import { SUBJECTS } from '@/shared/utils/themes'
import type {
  AdaptiveTrailSession,
  TrailStepAnswerInput,
  TrailStepQuestionFlow,
} from '../types/types'

interface AdaptiveTrailDetailRepository {
  getTrailSession(trailId: string): Promise<AdaptiveTrailSession | null>
  getStepQuestionFlow(
    trailId: string,
    stepId: string
  ): Promise<TrailStepQuestionFlow>
  saveStepAnswer(input: TrailStepAnswerInput): Promise<void>
}

const mockTrailSessions: Record<string, AdaptiveTrailSession> = {
  math: {
    completedSteps: 0,
    description:
      'Sequência base para reforço e progressão em resolução de problemas matemáticos.',
    id: 'math',
    levelLabel: 'Intermediário',
    progress: 0,
    subject: SUBJECTS.matematica,
    timeEstimate: '26 min',
    title: 'Trilha adaptativa de Matemática',
    steps: [
      {
        content: {
          body: 'Revise a ideia de igualdade, identifique o termo desconhecido e isole a variável com operações inversas.',
          title: 'Conteúdo liberado para continuar',
        },
        duration: '12 min',
        id: 'equacoes-introducao',
        kind: 'video',
        order: 1,
        questions: [
          {
            id: 'math-step-1-question-1',
            options: [
              { id: 'option-1', label: 'x = 2' },
              { id: 'option-2', label: 'x = 3' },
              { id: 'option-3', label: 'x = 7' },
            ],
            question: 'Quanto vale x em 2x + 4 = 10?',
            subject: SUBJECTS.matematica,
          },
          {
            id: 'math-step-1-question-2',
            options: [
              { id: 'option-1', label: 'Somar 5 nos dois lados' },
              { id: 'option-2', label: 'Subtrair 5 dos dois lados' },
              { id: 'option-3', label: 'Multiplicar os dois lados por 5' },
            ],
            question: 'Qual é o primeiro passo para resolver x + 5 = 12?',
            subject: SUBJECTS.matematica,
          },
        ],
        status: 'available',
        title: 'Equações do 1º Grau - Introdução',
      },
      {
        content: {
          body: 'Esta etapa consolida frações, decimais e problemas práticos. Ela fica indisponível até a conclusão da etapa anterior.',
          title: 'Conteúdo bloqueado',
        },
        duration: '14 min',
        id: 'fracoes-decimais',
        kind: 'text',
        lockReason: 'Libera ao concluir a etapa anterior',
        order: 2,
        questions: [
          {
            id: 'math-step-2-question-1',
            options: [
              { id: 'option-1', label: '0,25' },
              { id: 'option-2', label: '0,5' },
              { id: 'option-3', label: '0,75' },
            ],
            question: 'Qual é a forma decimal de 1/2?',
            subject: SUBJECTS.matematica,
          },
        ],
        status: 'locked',
        title: 'Frações e Decimais',
      },
    ],
  },
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

    async getStepQuestionFlow(trailId, stepId) {
      const session = mockTrailSessions[trailId]
      const step = session?.steps.find(currentStep => currentStep.id === stepId)

      if (!session || !step || step.status === 'locked') {
        throw new Error('Etapa indisponível para resposta.')
      }

      return {
        assessmentId: `${trailId}-${stepId}`,
        questions: JSON.parse(JSON.stringify(step.questions)),
        stepId: step.id,
        stepTitle: step.title,
        trailId,
      }
    },

    async saveStepAnswer() {
      return Promise.resolve()
    },
  }
}

export const adaptiveTrailDetailService = createAdaptiveTrailDetailRepository()
