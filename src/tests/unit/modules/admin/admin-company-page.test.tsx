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

async function goToCompanyView() {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByTestId('toggle-empresa'))

  return user
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('SchoolCompanyPage toggles to empresa view', async () => {
  await goToCompanyView()

  expect(screen.getByText('Empresas parceiras')).toBeInTheDocument()
  expect(screen.getByText('Lista de empresas')).toBeInTheDocument()
  expect(screen.getByText('Nova parceria')).toBeInTheDocument()
})

test('SchoolCompanyPage renders all company cards', async () => {
  await goToCompanyView()

  expect(screen.getAllByText('Tech Corp').length).toBeGreaterThan(0)
  expect(screen.getByText('Futuro S/A')).toBeInTheDocument()
  expect(screen.getByText('Educa Mais')).toBeInTheDocument()
})

test('SchoolCompanyPage shows details for the initially selected company', async () => {
  await goToCompanyView()

  expect(screen.getAllByText('Tech Corp').length).toBeGreaterThan(0)
  expect(screen.getByText('parcerias@techcorp.com')).toBeInTheDocument()
  expect(screen.getByText('Escola São Paulo')).toBeInTheDocument()
  expect(screen.getByText('Escola Rio Branco')).toBeInTheDocument()
  expect(screen.getByText('Escola Horizonte')).toBeInTheDocument()
})

test('SchoolCompanyPage changes company details when another company is selected', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Futuro S/A'))

  expect(screen.getByText('contato@futurosa.com')).toBeInTheDocument()
  expect(screen.getByText('Escola Monte Azul')).toBeInTheDocument()
})

test('SchoolCompanyPage shows empty requests message for company without requests', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Educa Mais'))

  expect(screen.getByText('parcerias@educamais.com')).toBeInTheDocument()
  expect(
    screen.getByText(
      'Essa empresa ainda não solicitou apoio para nenhuma escola.'
    )
  ).toBeInTheDocument()
})

test('SchoolCompanyPage filters companies by search query', async () => {
  const user = await goToCompanyView()

  await user.type(
    screen.getByPlaceholderText('Pesquisar empresas...'),
    'Futuro'
  )

  expect(screen.getByText('Futuro S/A')).toBeInTheDocument()
  expect(screen.queryByText('Educa Mais')).not.toBeInTheDocument()
})

test('SchoolCompanyPage opens new partner modal', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Nova parceria'))

  expect(screen.getByText('Criar parceria')).toBeInTheDocument()
  expect(
    screen.getByPlaceholderText('Ex.: Instituto Futuro')
  ).toBeInTheDocument()
  expect(
    screen.getByPlaceholderText('Ex.: contato@empresa.com')
  ).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Ex.: Patrocínio')).toBeInTheDocument()
})

test('SchoolCompanyPage keeps create partner button disabled with invalid form', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Nova parceria'))

  await user.type(
    screen.getByPlaceholderText('Ex.: Instituto Futuro'),
    'Empresa Teste'
  )
  await user.type(
    screen.getByPlaceholderText('Ex.: contato@empresa.com'),
    'email-invalido'
  )

  expect(
    screen.getByText('Digite um e-mail válido com @ e domínio.')
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Criar parceria' })).toBeDisabled()
})

test('SchoolCompanyPage creates a new company partner', async () => {
  const user = await goToCompanyView()

  jest
    .spyOn(crypto, 'randomUUID')
    .mockReturnValue('00000000-0000-4000-8000-000000000004')
  await user.click(screen.getByText('Nova parceria'))

  await user.type(
    screen.getByPlaceholderText('Ex.: Instituto Futuro'),
    'Instituto Solar'
  )
  await user.type(
    screen.getByPlaceholderText('Ex.: contato@empresa.com'),
    'contato@solar.com'
  )
  await user.type(screen.getByPlaceholderText('Ex.: Patrocínio'), 'Patrocínio')
  await user.type(
    screen.getByPlaceholderText('Mínimo 8 caracteres'),
    'Senha123'
  )
  await user.type(
    screen.getByPlaceholderText('Digite a senha novamente'),
    'Senha123'
  )

  await user.click(screen.getByRole('button', { name: 'Criar parceria' }))

  expect(screen.getAllByText('Instituto Solar').length).toBeGreaterThan(0)
  expect(screen.getByText('contato@solar.com')).toBeInTheDocument()
  expect(
    screen.getByText(
      'Empresa recém-cadastrada aguardando solicitações de parceria.'
    )
  ).toBeInTheDocument()
})
