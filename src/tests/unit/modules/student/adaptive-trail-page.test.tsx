import { test, expect } from '@jest/globals'
import { screen, within } from '@testing-library/react'
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

  const trailList = screen.getByRole('list', { name: /trilhas disponíveis/i })
  expect(within(trailList).getAllByRole('listitem')).toHaveLength(4)
  expect(screen.getByText('Fundamentos de Algebra')).toBeInTheDocument()
  expect(screen.getByText('Interpretacao de Textos')).toBeInTheDocument()
  expect(screen.getByText('Ecossistemas e Meio Ambiente')).toBeInTheDocument()
  expect(screen.getByText('Brasil Colonia')).toBeInTheDocument()
})

test('StudentAdaptiveTrailPage exposes trail cards as links to the trail flow', () => {
  renderPage()

  expect(
    screen.getByRole('link', {
      name: /abrir trilha fundamentos de algebra/i,
    })
  ).toHaveAttribute('href', buildStudentTrailRoute('math'))
})

test('StudentAdaptiveTrailPage filters trails by search and subject chip', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(
    screen.getByPlaceholderText('Pesquisar conteúdos...'),
    'ecossistemas'
  )

  expect(screen.getByText('Ecossistemas e Meio Ambiente')).toBeInTheDocument()
  expect(screen.queryByText('Fundamentos de Algebra')).not.toBeInTheDocument()
  expect(screen.getByText('1 resultado')).toBeInTheDocument()

  await user.clear(screen.getByPlaceholderText('Pesquisar conteúdos...'))
  await user.click(screen.getByRole('button', { name: 'Português' }))

  expect(screen.getByText('Interpretacao de Textos')).toBeInTheDocument()
  expect(screen.queryByText('Brasil Colonia')).not.toBeInTheDocument()
  expect(screen.getByText('1 resultado')).toBeInTheDocument()
})

test('StudentAdaptiveTrailPage shows empty state when no trails match', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(
    screen.getByPlaceholderText('Pesquisar conteúdos...'),
    'xyzabc'
  )

  expect(screen.getByText('Nenhuma trilha encontrada.')).toBeInTheDocument()
  expect(screen.getByText('0 resultados')).toBeInTheDocument()
})

test('StudentAdaptiveTrailPage resets to all trails when Todos is clicked', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByRole('button', { name: 'Matemática' }))
  expect(screen.queryByText('Brasil Colonia')).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Todos' }))

  const trailList = screen.getByRole('list', { name: /trilhas disponíveis/i })
  expect(within(trailList).getAllByRole('listitem')).toHaveLength(4)
})

test('StudentAdaptiveTrailPage shows no results when search does not match filter', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByRole('button', { name: 'Matemática' }))
  await user.type(
    screen.getByPlaceholderText('Pesquisar conteúdos...'),
    'ecossistemas'
  )

  expect(screen.getByText('Nenhuma trilha encontrada.')).toBeInTheDocument()
})
