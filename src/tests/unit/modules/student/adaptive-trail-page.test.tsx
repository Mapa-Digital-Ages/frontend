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
  {
    id: 'math2',
    name: 'Geometria Basica',
    subject: { id: 'matematica', label: 'Matemática', color: '#F00' },
    description: 'Trilha de geometria.',
    progress: 100,
    steps: 2,
    completed: 2,
    time_estimate: '15 min',
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

test('StudentAdaptiveTrailPage renders one card per subject and reveals trails on expand', async () => {
  const user = userEvent.setup()
  renderPage()

  expect(
    await screen.findByRole('heading', { name: /trilhas adaptativas/i })
  ).toBeInTheDocument()

  // One card per subject (subject label is the card title). The two Matemática
  // trails collapse into a single Matemática card.
  await waitFor(() => {
    expect(screen.getByText('Matemática')).toBeInTheDocument()
  })
  expect(screen.getByText('Português')).toBeInTheDocument()
  expect(screen.getByText('Ciências')).toBeInTheDocument()
  expect(screen.getByText('História')).toBeInTheDocument()

  // Individual trails are hidden until the subject card is expanded.
  expect(
    screen.queryByRole('link', { name: /abrir trilha fundamentos de algebra/i })
  ).not.toBeInTheDocument()

  // Expanding Matemática reveals both of its trails.
  await user.click(
    screen.getByRole('button', { name: /ver trilhas de matemática/i })
  )
  expect(
    await screen.findByRole('link', {
      name: /abrir trilha fundamentos de algebra/i,
    })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /abrir trilha geometria basica/i })
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailPage trail rows link to the trail detail', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(
    await screen.findByRole('button', { name: /ver trilhas de matemática/i })
  )
  const link = await screen.findByRole('link', {
    name: /abrir trilha fundamentos de algebra/i,
  })
  expect(link).toHaveAttribute('href', buildStudentTrailRoute('math'))
})

test('StudentAdaptiveTrailPage filters subjects by search query', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByText('Ciências')

  await user.type(
    screen.getByPlaceholderText('Pesquisar trilhas...'),
    'ecossistemas'
  )

  await waitFor(() => {
    expect(screen.getByText('Ciências')).toBeInTheDocument()
    expect(screen.queryByText('Matemática')).not.toBeInTheDocument()
  })
})

test('StudentAdaptiveTrailPage shows empty state when no trails match search', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByText('Matemática')

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
