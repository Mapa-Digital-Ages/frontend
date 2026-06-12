import { expect, jest, test, beforeEach } from '@jest/globals'
import { ThemeProvider } from '@mui/material/styles'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createAppTheme } from '@/app/theme/core/theme'
import { APP_ROUTES, buildStudentTrailRoute } from '@/app/router/paths'
import StudentAdaptiveTrailDetailPage from '@/modules/student/adaptivetrail/detail/page/Page'
import type { AdaptiveTrailSession } from '@/modules/student/adaptivetrail/types/types'
import { SUBJECTS } from '@/shared/utils/themes'

const mockGetTrailSession =
  jest.fn<(id: string) => Promise<AdaptiveTrailSession | null>>()
const mockSaveStepAnswer = jest
  .fn<(...args: unknown[]) => Promise<void>>()
  .mockResolvedValue()
const mockGetSubStepQuestionFlow =
  jest.fn<(...args: unknown[]) => Promise<unknown>>()
const mockCompleteStep = jest
  .fn<(...args: unknown[]) => Promise<unknown>>()
  .mockResolvedValue({
    correct: 1,
    total: 1,
    passed: true,
    currentSubPath: 8,
    pathStatus: 'on_going',
  })
const mockGetCompletionRecommendations = jest
  .fn<(...args: unknown[]) => Promise<unknown>>()
  .mockResolvedValue({
    stepTitle: '',
    correct: 0,
    total: 0,
    subject: { label: '' },
    trailTitle: '',
    recommendedTrails: [],
    recommendedContent: [],
  })

jest.mock(
  '@/modules/student/adaptivetrail/services/trailDetailService',
  () => ({
    adaptiveTrailDetailService: {
      getTrailSession: (...args: unknown[]) =>
        mockGetTrailSession(args[0] as string),
      saveStepAnswer: (...args: unknown[]) => mockSaveStepAnswer(...args),
      getSubStepQuestionFlow: (...args: unknown[]) =>
        mockGetSubStepQuestionFlow(...args),
      completeStep: (...args: unknown[]) => mockCompleteStep(...args),
      getCompletionRecommendations: (...args: unknown[]) =>
        mockGetCompletionRecommendations(...args),
    },
  })
)

jest.mock('@/shared/lib/http/client', () => ({
  httpClient: { get: jest.fn(), post: jest.fn() },
}))

const mockGetStudentId = jest.fn<() => string | null>(() => null)
jest.mock('@/modules/student/adaptivetrail/services/service', () => ({
  studentService: { getStudentId: () => mockGetStudentId() },
}))

function getHttpGet() {
  return jest.requireMock<{ httpClient: { get: ReturnType<typeof jest.fn> } }>(
    '@/shared/lib/http/client'
  ).httpClient.get
}

const MOCK_SESSION: AdaptiveTrailSession = {
  completedSteps: 0,
  description: 'Trilha de reforço com foco em equações.',
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
      description: 'Revise igualdade.',
      order: 1,
      status: 'available',
      subSteps: [
        {
          id: 'eq-video',
          kind: 'video',
          title: 'Assistir: Introdução às Equações do 1º Grau',
          description: 'Vídeo explicativo.',
          status: 'available',
          duration: '8 min',
          order: 1,
          questions: [],
        },
        {
          id: 'eq-quiz',
          kind: 'question',
          title: 'Questões de Equações do 1º Grau',
          description: 'Resolva as questões.',
          status: 'locked',
          lockReason: 'Libera ao concluir o vídeo',
          duration: '4 min',
          order: 2,
          questions: [],
        },
      ],
    },
    {
      id: 'fracoes-decimais',
      title: 'Frações e Decimais',
      description: 'Esta etapa consolida frações.',
      order: 2,
      status: 'locked',
      lockReason: 'Libera ao concluir a etapa anterior',
      subSteps: [],
    },
    {
      id: 'problemas-aplicados',
      title: 'Problemas Aplicados',
      description: 'Resolução de problemas.',
      order: 3,
      status: 'locked',
      lockReason: 'Libera ao concluir a etapa anterior',
      subSteps: [],
    },
  ],
}

beforeEach(() => {
  mockGetTrailSession.mockResolvedValue(MOCK_SESSION)
  mockGetStudentId.mockReturnValue(null)
  getHttpGet().mockReset()
})

function renderPage(trailId = 'math') {
  render(
    <ThemeProvider theme={createAppTheme('light')}>
      <MemoryRouter initialEntries={[buildStudentTrailRoute(trailId)]}>
        <Routes>
          <Route
            element={<StudentAdaptiveTrailDetailPage />}
            path={APP_ROUTES.student.adaptiveTrailDetail}
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

test('StudentAdaptiveTrailDetailPage shows the trail title and all steps', async () => {
  renderPage()

  expect(
    await screen.findByRole('heading', { name: /fundamentos de algebra/i })
  ).toBeInTheDocument()

  expect(screen.getByText('Equações do 1º Grau')).toBeInTheDocument()
  expect(screen.getByText('Frações e Decimais')).toBeInTheDocument()
  expect(screen.getByText('Problemas Aplicados')).toBeInTheDocument()
  expect(
    screen.getAllByText('Libera ao concluir a etapa anterior').length
  ).toBeGreaterThan(0)
})

test('StudentAdaptiveTrailDetailPage shows sub-steps when active step is expanded', async () => {
  renderPage()

  await screen.findByRole('heading', { name: /fundamentos de algebra/i })

  expect(
    screen.getByText('Assistir: Introdução às Equações do 1º Grau')
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailDetailPage unlocks quiz sub-step after completing video', async () => {
  const user = userEvent.setup()

  renderPage()

  const videoButton = await screen.findByRole('button', {
    name: /responder etapa assistir: introdução às equações do 1º grau/i,
  })

  await user.click(videoButton)

  await waitFor(() => {
    expect(
      screen.getByRole('button', {
        name: /responder etapa questões de equações do 1º grau/i,
      })
    ).toBeInTheDocument()
  })
})

test('StudentAdaptiveTrailDetailPage fetches the question flow when opening the quiz', async () => {
  mockGetSubStepQuestionFlow.mockResolvedValue({
    assessmentId: 'eq-quiz',
    trailId: 'math',
    stepId: 'equacoes-grau1',
    subStepId: 'eq-quiz',
    stepTitle: 'Questões de Equações do 1º Grau',
    questions: [
      {
        id: 'q1',
        question: 'Quanto vale x em 2x + 4 = 10?',
        options: [
          { id: 'o1', label: 'x = 2' },
          { id: 'o2', label: 'x = 3' },
        ],
        subject: SUBJECTS.matematica,
      },
    ],
  })

  const user = userEvent.setup()
  renderPage()

  const videoButton = await screen.findByRole('button', {
    name: /responder etapa assistir: introdução às equações do 1º grau/i,
  })
  await user.click(videoButton)

  const quizButton = await screen.findByRole('button', {
    name: /responder etapa questões de equações do 1º grau/i,
  })
  await user.click(quizButton)

  await waitFor(() => {
    expect(mockGetSubStepQuestionFlow).toHaveBeenCalled()
  })
})

test('StudentAdaptiveTrailDetailPage shows other trails of the same subject as a switcher', async () => {
  mockGetStudentId.mockReturnValue('student-1')
  getHttpGet().mockResolvedValue({
    data: [
      {
        id: 'math',
        name: 'Fundamentos de Algebra',
        subject: SUBJECTS.matematica,
        description: '',
        progress: 33,
        steps: 2,
        completed: 0,
        time_estimate: null,
      },
      {
        id: 'math2',
        name: 'Geometria Basica',
        subject: SUBJECTS.matematica,
        description: '',
        progress: 100,
        steps: 2,
        completed: 2,
        time_estimate: null,
      },
      {
        id: 'port1',
        name: 'Interpretacao de Textos',
        subject: SUBJECTS.portugues,
        description: '',
        progress: 0,
        steps: 2,
        completed: 0,
        time_estimate: null,
      },
    ],
  })

  renderPage()

  // The sibling trail of the same subject is offered and links to its detail.
  const link = await screen.findByRole('link', {
    name: /abrir trilha geometria basica/i,
  })
  expect(link).toHaveAttribute('href', buildStudentTrailRoute('math2'))

  // A trail from a different subject is not offered here.
  expect(
    screen.queryByRole('link', {
      name: /abrir trilha interpretacao de textos/i,
    })
  ).not.toBeInTheDocument()
})
