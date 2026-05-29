import { expect, jest, test, beforeEach } from '@jest/globals'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildStudentTrailRoute } from '@/app/router/paths'
import StudentAdaptiveTrailPage from '@/modules/student/adaptivetrail/page/Page'
import { renderWithProviders } from '@/tests/helpers/render'

jest.mock('@/app/auth/core/service', () => ({
  authService: { getUserId: jest.fn(() => 'student-123') },
}))

jest.mock('@/shared/lib/http/client', () => ({
  httpClient: { get: jest.fn() },
}))

const MOCK_TRAILS_API = [
  {
    id: 'math',
    name: 'Fundamentos de Algebra',
    subject: { id: 'matematica', label: 'Matemática', color: '#F00' },
    description: 'Trilha de reforço com foco em equações.',
    progress: 33,
    steps: 3,
    completed: 1,
    time_estimate: '25 min',
  },
  {
    id: 'portuguese',
    name: 'Interpretacao de Textos',
    subject: { id: 'portugues', label: 'Português', color: '#00F' },
    description: 'Sequência por conteúdo para leitura crítica.',
    progress: 0,
    steps: 2,
    completed: 0,
    time_estimate: '19 min',
  },
  {
    id: 'science',
    name: 'Ecossistemas e Meio Ambiente',
    subject: { id: 'ciencias', label: 'Ciências', color: '#0F0' },
    description: 'Caminho por conteúdos para aprofundar fenômenos naturais.',
    progress: 0,
    steps: 2,
    completed: 0,
    time_estimate: '24 min',
  },
  {
    id: 'history',
    name: 'Brasil Colonia',
    subject: { id: 'historia', label: 'História', color: '#FF0' },
    description: 'Trilha com contexto histórico.',
    progress: 50,
    steps: 2,
    completed: 1,
    time_estimate: '23 min',
  },
]

function getHttpMock() {
  return jest.requireMock<{ httpClient: { get: ReturnType<typeof jest.fn> } }>(
    '@/shared/lib/http/client'
  ).httpClient.get
}

beforeEach(() => {
  getHttpMock().mockResolvedValue({ data: MOCK_TRAILS_API })
})

function renderPage() {
  renderWithProviders(<StudentAdaptiveTrailPage />)
}

test('StudentAdaptiveTrailPage renders trail metrics and all available trails', async () => {
  renderPage()

  // Wait for loading to finish — heading and trail cards appear
  expect(
    await screen.findByRole('heading', { name: /trilhas adaptativas/i })
  ).toBeInTheDocument()

  // TrailCard renders subject.label as title — check those visible texts
  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: /abrir trilha fundamentos de algebra/i })
    ).toBeInTheDocument()
  })
  expect(
    screen.getByRole('link', { name: /abrir trilha interpretacao de textos/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', {
      name: /abrir trilha ecossistemas e meio ambiente/i,
    })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /abrir trilha brasil colonia/i })
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailPage exposes trail cards as links to the trail flow', async () => {
  renderPage()

  const link = await screen.findByRole('link', {
    name: /abrir trilha fundamentos de algebra/i,
  })
  expect(link).toHaveAttribute('href', buildStudentTrailRoute('math'))
})

test('StudentAdaptiveTrailPage filters trails by search query', async () => {
  const user = userEvent.setup()
  renderPage()

  // Wait for cards to load
  await screen.findByRole('link', {
    name: /abrir trilha fundamentos de algebra/i,
  })

  await user.type(
    screen.getByPlaceholderText('Pesquisar trilhas...'),
    'ecossistemas'
  )

  await waitFor(() => {
    expect(
      screen.getByRole('link', {
        name: /abrir trilha ecossistemas e meio ambiente/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', {
        name: /abrir trilha fundamentos de algebra/i,
      })
    ).not.toBeInTheDocument()
  })
})

test('StudentAdaptiveTrailPage shows empty state when no trails match search', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByRole('link', {
    name: /abrir trilha fundamentos de algebra/i,
  })

  await user.type(screen.getByPlaceholderText('Pesquisar trilhas...'), 'xyzabc')

  await waitFor(() => {
    expect(screen.getByText('Nenhuma trilha encontrada.')).toBeInTheDocument()
  })
})

test('StudentAdaptiveTrailPage shows error state when fetch fails', async () => {
  getHttpMock().mockRejectedValueOnce(new Error('network error'))
  renderPage()

  await waitFor(() => {
    expect(
      screen.getByText(/não foi possível carregar as trilhas/i)
    ).toBeInTheDocument()
  })
})
