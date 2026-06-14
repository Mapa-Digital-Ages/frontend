import { expect, jest, test, beforeEach } from '@jest/globals'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildStudentSubjectTrailRoute } from '@/app/router/paths'
import { renderWithProviders } from '@/tests/helpers/render'

await jest.unstable_mockModule('@/app/auth/core/service', () => ({
  authService: { getUserId: () => 'student-123' },
}))

await jest.unstable_mockModule(
  '@/modules/student/adaptivetrail/services/service',
  () => ({
    studentService: { getStudentId: () => 'student-123' },
  })
)

const mockHttpGet = jest.fn<(...args: unknown[]) => Promise<unknown>>()
await jest.unstable_mockModule('@/shared/lib/http/client', () => ({
  httpClient: { get: mockHttpGet },
}))

const { default: StudentAdaptiveTrailPage } =
  await import('@/modules/student/adaptivetrail/page/Page')

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
  return mockHttpGet
}

beforeEach(() => {
  getHttpMock().mockResolvedValue({ data: MOCK_TRAILS_API })
})

function renderPage() {
  renderWithProviders(<StudentAdaptiveTrailPage />)
}

test('StudentAdaptiveTrailPage renders one clickable card per subject', async () => {
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

  // The subject card itself is a link into all trails from that subject.
  const matCard = screen.getByRole('link', {
    name: /abrir trilhas de matemática/i,
  })
  expect(matCard).toHaveAttribute(
    'href',
    buildStudentSubjectTrailRoute('matematica')
  )
})

test('StudentAdaptiveTrailPage subject card links to the subject trail collection', async () => {
  renderPage()

  const link = await screen.findByRole('link', {
    name: /abrir trilhas de matemática/i,
  })
  expect(link).toHaveAttribute(
    'href',
    buildStudentSubjectTrailRoute('matematica')
  )
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
