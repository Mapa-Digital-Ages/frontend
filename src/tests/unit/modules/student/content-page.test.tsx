import { test, expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentContentsPage from '@/modules/student/contents/page/Page'
import { renderWithProviders } from '@/tests/helpers/render'

function renderPage() {
  renderWithProviders(<StudentContentsPage />)
}

test('StudentContentsPage renders the header and all available contents', async () => {
  renderPage()

  expect(
    screen.getByRole('heading', { name: /conteúdos/i })
  ).toBeInTheDocument()

  expect(
    await screen.findByTestId('content-card-math-fundamentos-algebra')
  ).toBeInTheDocument()
  expect(
    screen.getByTestId('content-card-portuguese-interpretacao-textos')
  ).toBeInTheDocument()
  expect(
    screen.getByTestId('content-card-science-ecossistemas-meio-ambiente')
  ).toBeInTheDocument()
  expect(
    screen.getByTestId('content-card-history-brasil-colonia')
  ).toBeInTheDocument()
})

test('StudentContentsPage shows the content banner', async () => {
  renderPage()

  expect(await screen.findByTestId('contents-banner')).toHaveTextContent(
    'Abra outras jornadas sem pausar as atuais'
  )
})

test('StudentContentsPage filters contents by search', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('content-card-math-fundamentos-algebra')

  await user.type(screen.getByPlaceholderText('Pesquisar conteúdos...'), 'eco')

  expect(
    screen.getByTestId('content-card-science-ecossistemas-meio-ambiente')
  ).toBeInTheDocument()
  expect(
    screen.queryByTestId('content-card-math-fundamentos-algebra')
  ).not.toBeInTheDocument()
})

test('StudentContentsPage filters contents by subject pill', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('content-card-math-fundamentos-algebra')

  await user.click(screen.getByTestId('content-filter-history'))

  expect(screen.getByTestId('content-filter-history')).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(
    screen.getByTestId('content-card-history-brasil-colonia')
  ).toBeInTheDocument()
  expect(
    screen.queryByTestId('content-card-math-fundamentos-algebra')
  ).not.toBeInTheDocument()
})

test('StudentContentsPage shows empty state when nothing matches', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('content-card-math-fundamentos-algebra')

  await user.type(
    screen.getByPlaceholderText('Pesquisar conteúdos...'),
    'xyzabc'
  )

  expect(screen.getByTestId('contents-empty-state')).toBeInTheDocument()
  expect(
    screen.queryByTestId('content-card-math-fundamentos-algebra')
  ).not.toBeInTheDocument()
})

test('StudentContentsPage resets to all contents when search is cleared', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('content-card-math-fundamentos-algebra')

  const searchInput = screen.getByPlaceholderText('Pesquisar conteúdos...')
  await user.type(searchInput, 'algebra')

  expect(
    screen.queryByTestId('content-card-history-brasil-colonia')
  ).not.toBeInTheDocument()

  await user.clear(searchInput)

  expect(
    screen.getByTestId('content-card-history-brasil-colonia')
  ).toBeInTheDocument()
})

test('StudentContentsPage searches by subject name', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('content-card-math-fundamentos-algebra')

  await user.type(
    screen.getByPlaceholderText('Pesquisar conteúdos...'),
    'interpretação'
  )

  expect(
    screen.getByTestId('content-card-portuguese-interpretacao-textos')
  ).toBeInTheDocument()
  expect(
    screen.queryByTestId('content-card-math-fundamentos-algebra')
  ).not.toBeInTheDocument()
})
