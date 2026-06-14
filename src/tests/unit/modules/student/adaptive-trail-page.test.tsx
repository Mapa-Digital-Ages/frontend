import { test, expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildStudentTrailRoute } from '@/app/router/paths'
import StudentAdaptiveTrailPage from '@/modules/student/adaptivetrail/page/Page'
import { renderWithProviders } from '@/tests/helpers/render'

function renderPage() {
  renderWithProviders(<StudentAdaptiveTrailPage />)
}

test('StudentAdaptiveTrailPage renders trail metrics and all available trails', () => {
  renderPage()

  expect(
    screen.getByRole('heading', { name: /trilhas adaptativas/i })
  ).toBeInTheDocument()
  expect(
    screen.getByText(/em andamento/i).closest('.MuiCard-root')
  ).toHaveTextContent('2')
  expect(
    screen.getByText('Concluídas').closest('.MuiCard-root')
  ).toHaveTextContent('0')
  expect(
    screen.getByText('Disponíveis').closest('.MuiCard-root')
  ).toHaveTextContent('2')
  expect(
    screen.getByText('Matérias').closest('.MuiCard-root')
  ).toHaveTextContent('4')

  expect(screen.getAllByRole('link', { name: /abrir trilha/i })).toHaveLength(4)
  expect(
    screen.getByRole('link', { name: /fundamentos de algebra/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /interpretacao de textos/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /ecossistemas e meio ambiente/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /brasil colonia/i })
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailPage exposes trail cards as links to the trail flow', () => {
  renderPage()

  expect(
    screen.getByRole('link', {
      name: /abrir trilha fundamentos de algebra/i,
    })
  ).toHaveAttribute('href', buildStudentTrailRoute('math'))
})

test('StudentAdaptiveTrailPage filters trails by search', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(screen.getByPlaceholderText('Pesquisar trilhas...'), 'eco')

  expect(
    screen.getByRole('link', { name: /ecossistemas e meio ambiente/i })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: /fundamentos de algebra/i })
  ).not.toBeInTheDocument()
  expect(screen.getAllByText('1 resultado').length).toBeGreaterThan(0)
})

test('StudentAdaptiveTrailPage shows empty state when no trails match', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(screen.getByPlaceholderText('Pesquisar trilhas...'), 'xyzabc')

  expect(screen.getByText('Nenhuma trilha encontrada.')).toBeInTheDocument()
  expect(screen.getAllByText('0 resultados').length).toBeGreaterThan(0)
})

test('StudentAdaptiveTrailPage resets to all trails when search is cleared', async () => {
  const user = userEvent.setup()

  renderPage()

  const searchInput = screen.getByPlaceholderText('Pesquisar trilhas...')

  await user.type(searchInput, 'matemática')
  expect(screen.getAllByRole('link', { name: /abrir trilha/i })).toHaveLength(1)

  await user.clear(searchInput)

  expect(screen.getAllByRole('link', { name: /abrir trilha/i })).toHaveLength(4)
})

test('StudentAdaptiveTrailPage searches by subject name', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(
    screen.getByPlaceholderText('Pesquisar trilhas...'),
    'português'
  )

  expect(
    screen.getByRole('link', { name: /interpretacao de textos/i })
  ).toBeInTheDocument()
  expect(screen.getAllByText('1 resultado').length).toBeGreaterThan(0)
})
