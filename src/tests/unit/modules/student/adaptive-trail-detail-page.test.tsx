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
const mockSaveStepAnswer = jest.fn().mockResolvedValue(undefined)
const mockGetSubStepQuestionFlow = jest.fn()
const mockGetCompletionRecommendations = jest.fn().mockResolvedValue({
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
      getCompletionRecommendations: (...args: unknown[]) =>
        mockGetCompletionRecommendations(...args),
    },
  })
)

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
