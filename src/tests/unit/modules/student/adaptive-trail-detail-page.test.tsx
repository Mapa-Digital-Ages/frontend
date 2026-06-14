import { expect, jest, test, beforeEach } from '@jest/globals'
import { ThemeProvider } from '@mui/material/styles'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createAppTheme } from '@/app/theme/core/theme'
import { APP_ROUTES, buildStudentSubjectTrailRoute } from '@/app/router/paths'
import type { AdaptiveTrailSession } from '@/modules/student/adaptivetrail/types/types'
import { SUBJECTS } from '@/shared/utils/themes'

const mockGetTrailSession =
  jest.fn<(id: string) => Promise<AdaptiveTrailSession | null>>()
const mockGetSubjectTrailSessions =
  jest.fn<(subjectId: string) => Promise<AdaptiveTrailSession[]>>()
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
const mockCompleteItem = jest.fn<(...args: unknown[]) => Promise<unknown>>()
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
const mockHttpGet = jest.fn<(...args: unknown[]) => Promise<unknown>>()

await jest.unstable_mockModule(
  '@/modules/student/adaptivetrail/services/trailDetailService',
  () => ({
    adaptiveTrailDetailService: {
      getTrailSession: (...args: unknown[]) =>
        mockGetTrailSession(args[0] as string),
      getSubjectTrailSessions: (...args: unknown[]) =>
        mockGetSubjectTrailSessions(args[0] as string),
      saveStepAnswer: (...args: unknown[]) => mockSaveStepAnswer(...args),
      getSubStepQuestionFlow: (...args: unknown[]) =>
        mockGetSubStepQuestionFlow(...args),
      completeStep: (...args: unknown[]) => mockCompleteStep(...args),
      completeItem: (...args: unknown[]) => mockCompleteItem(...args),
      getCompletionRecommendations: (...args: unknown[]) =>
        mockGetCompletionRecommendations(...args),
    },
  })
)

await jest.unstable_mockModule('@/shared/lib/http/client', () => ({
  httpClient: { get: mockHttpGet, post: jest.fn() },
}))

const mockGetStudentId = jest.fn<() => string | null>(() => null)
await jest.unstable_mockModule(
  '@/modules/student/adaptivetrail/services/service',
  () => ({
    studentService: { getStudentId: () => mockGetStudentId() },
  })
)

const { default: StudentAdaptiveTrailDetailPage } =
  await import('@/modules/student/adaptivetrail/detail/page/Page')

function getHttpGet() {
  return mockHttpGet
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
          itemId: 'item-video',
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
          itemId: 'item-quiz',
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
  mockGetSubjectTrailSessions.mockResolvedValue([MOCK_SESSION])
  mockCompleteItem.mockResolvedValue({
    correct: 0,
    passed: true,
    session: {
      ...MOCK_SESSION,
      steps: [
        {
          ...MOCK_SESSION.steps[0],
          subSteps: [
            { ...MOCK_SESSION.steps[0].subSteps[0], status: 'completed' },
            { ...MOCK_SESSION.steps[0].subSteps[1], status: 'available' },
          ],
        },
        ...MOCK_SESSION.steps.slice(1),
      ],
    },
    total: 0,
  })
  mockGetStudentId.mockReturnValue(null)
  getHttpGet().mockReset()
})

function renderPage(subjectId = 'matematica') {
  render(
    <ThemeProvider theme={createAppTheme('light')}>
      <MemoryRouter initialEntries={[buildStudentSubjectTrailRoute(subjectId)]}>
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

async function expandTrailCard(
  user: ReturnType<typeof userEvent.setup>,
  name = /fundamentos de algebra/i
) {
  const summary = await screen.findByRole('button', { name })
  expect(summary).toHaveAttribute('aria-expanded', 'false')

  await user.click(summary)

  await waitFor(() => {
    expect(summary).toHaveAttribute('aria-expanded', 'true')
  })
}

test('StudentAdaptiveTrailDetailPage starts trail cards collapsed', async () => {
  renderPage()

  expect(
    await screen.findByRole('heading', { name: /fundamentos de algebra/i })
  ).toBeInTheDocument()

  expect(
    screen.getByRole('button', { name: /fundamentos de algebra/i })
  ).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByText('Equações do 1º Grau')).not.toBeInTheDocument()
  expect(mockGetSubjectTrailSessions).toHaveBeenCalledWith('matematica')
  expect(mockGetTrailSession).not.toHaveBeenCalled()
})

test('StudentAdaptiveTrailDetailPage shows all steps after expanding the trail card', async () => {
  const user = userEvent.setup()

  renderPage()

  await expandTrailCard(user)

  expect(screen.getByText('Equações do 1º Grau')).toBeInTheDocument()
  expect(screen.getByText('Frações e Decimais')).toBeInTheDocument()
  expect(screen.getByText('Problemas Aplicados')).toBeInTheDocument()
  expect(screen.getByText('Libera ao concluir o vídeo')).toBeInTheDocument()
})

test('StudentAdaptiveTrailDetailPage shows sub-steps when active step is expanded', async () => {
  const user = userEvent.setup()

  renderPage()

  await expandTrailCard(user)

  expect(
    screen.getByText('Assistir: Introdução às Equações do 1º Grau')
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailDetailPage unlocks quiz sub-step after completing video', async () => {
  const user = userEvent.setup()

  renderPage()

  await expandTrailCard(user)

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

  await expandTrailCard(user)

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

test('StudentAdaptiveTrailDetailPage paginates same-subject trail cards in groups', async () => {
  const user = userEvent.setup()
  const geometrySession: AdaptiveTrailSession = {
    ...MOCK_SESSION,
    completedSteps: 2,
    description: 'Trilha de reforço com foco em geometria.',
    id: 'math2',
    progress: 100,
    title: 'Geometria Basica',
  }
  const functionsSession: AdaptiveTrailSession = {
    ...MOCK_SESSION,
    completedSteps: 0,
    description: 'Trilha de reforço com foco em funções.',
    id: 'math3',
    progress: 0,
    title: 'Funções Afins',
  }

  mockGetSubjectTrailSessions.mockResolvedValue([
    MOCK_SESSION,
    geometrySession,
    functionsSession,
  ])

  renderPage()

  expect(
    await screen.findByRole('heading', { name: /fundamentos de algebra/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /geometria basica/i })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('heading', { name: /funções afins/i })
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole('heading', { name: /interpretacao de textos/i })
  ).not.toBeInTheDocument()
  expect(mockGetSubjectTrailSessions).toHaveBeenCalledWith('matematica')
  expect(
    screen.getByRole('button', { name: /geometria basica/i })
  ).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.getByRole('button', { name: /go to page 2/i })
  ).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /go to page 2/i }))

  expect(
    await screen.findByRole('heading', { name: /funções afins/i })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('heading', { name: /fundamentos de algebra/i })
  ).not.toBeInTheDocument()
})
