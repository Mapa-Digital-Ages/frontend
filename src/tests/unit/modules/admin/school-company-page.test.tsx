import { afterEach, expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/tests/helpers/render'
import SchoolCompanyPage from '@/modules/admin/school-company/page/Page'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  logout: jest.fn(),
  status: 'authenticated',
  token: 'token-123',
  user: {
    email: 'admin@mapa.local',
    name: 'Admin Local',
    role: 'admin',
  },
}

function renderPage() {
  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <SchoolCompanyPage />
    </AuthContext.Provider>
  )
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('SchoolCompanyPage renders banner title and toggle buttons', () => {
  renderPage()

  expect(screen.getByText('Gestão de Escolas e Empresas')).toBeInTheDocument()
  expect(screen.getByTestId('toggle-escola')).toBeInTheDocument()
  expect(screen.getByTestId('toggle-empresa')).toBeInTheDocument()
})

test('SchoolCompanyPage renders escola view by default with all action buttons', () => {
  renderPage()

  expect(screen.getByTestId('escola-view')).toBeInTheDocument()
  expect(screen.getByTestId('add-new-school')).toBeInTheDocument()
  expect(screen.getByTestId('add-new-class')).toBeInTheDocument()
  expect(screen.getByTestId('add-new-student')).toBeInTheDocument()
})

test('SchoolCompanyPage renders all school cards', () => {
  renderPage()

  expect(screen.getByTestId('school-item-1')).toBeInTheDocument()
  expect(screen.getByTestId('school-item-2')).toBeInTheDocument()
  expect(screen.getByTestId('school-item-3')).toBeInTheDocument()
  expect(screen.getAllByText('Escola São Paulo').length).toBeGreaterThan(0)
  expect(screen.getByText('Escola Rio Branco')).toBeInTheDocument()
  expect(screen.getByText('Escola Horizonte')).toBeInTheDocument()
})

test('SchoolCompanyPage shows metrics for the initially selected school', () => {
  renderPage()

  expect(screen.getByTestId('school-metrics')).toBeInTheDocument()
  expect(screen.getByText('75%')).toBeInTheDocument()
})

test('SchoolCompanyPage renders classes for the initially selected school', () => {
  renderPage()

  expect(screen.getByTestId('class-item-c1')).toBeInTheDocument()
  expect(screen.getByTestId('class-item-c2')).toBeInTheDocument()
  expect(screen.getByText('7º A')).toBeInTheDocument()
  expect(screen.getByText('6º A')).toBeInTheDocument()
})

test('SchoolCompanyPage changes classes when another school is selected', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByTestId('school-item-3'))

  expect(screen.getByTestId('class-item-c5')).toBeInTheDocument()
  expect(screen.getByText('8º A')).toBeInTheDocument()
})

test('SchoolCompanyPage filters schools by search query', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.type(screen.getByPlaceholderText('Pesquisar escolas...'), 'Rio')

  expect(screen.getByTestId('school-item-2')).toBeInTheDocument()
  expect(screen.queryByTestId('school-item-1')).not.toBeInTheDocument()
})

test('SchoolCompanyPage toggles to empresa view', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByTestId('toggle-empresa'))

  expect(screen.getByTestId('empresa-view')).toBeInTheDocument()
  expect(screen.queryByTestId('escola-view')).not.toBeInTheDocument()
})
