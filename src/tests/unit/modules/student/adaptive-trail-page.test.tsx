import { test, expect } from '@jest/globals'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
