import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import SchoolCompanyPage from '@/modules/admin/school-company/page/Page'
import {
  adminCompanyService,
  adminSchoolService,
} from '@/modules/admin/school-company/services/service'
import type {
  Company,
  CreateCompanyPayload,
} from '@/modules/admin/school-company/types/types'
import { renderWithProviders } from '@/tests/helpers/render'

const companies: Company[] = [
  {
    id: 'company-1',
    name: 'Tech Corp',
    email: 'parcerias@techcorp.com',
    type: 'Empresa parceira',
    status: 'ativa',
    description: '',
    requests: [],
    spots: 0,
  },
  {
    id: 'company-2',
    name: 'Futuro S/A',
    email: 'contato@futurosa.com',
    type: 'Empresa parceira',
    status: 'ativa',
    description: '',
    requests: [],
    spots: 0,
  },
  {
    id: 'company-3',
    name: 'Educa Mais',
    email: 'parcerias@educamais.com',
    type: 'Empresa parceira',
    status: 'ativa',
    description: '',
    requests: [],
    spots: 0,
  },
]

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
  await screen.findByTestId('company-item-company-1')

  return user
}

beforeEach(() => {
  jest
    .spyOn(adminSchoolService, 'listSchools')
    .mockResolvedValue({ items: [], total: 0 })
  jest
    .spyOn(adminCompanyService, 'listCompanies')
    .mockImplementation(async (_page, _size, name) => {
      const normalizedName = name?.toLowerCase() ?? ''
      return companies.filter(company =>
        company.name.toLowerCase().includes(normalizedName)
      )
    })
  jest
    .spyOn(adminCompanyService, 'countCompanies')
    .mockImplementation(async name => {
      const normalizedName = name?.toLowerCase() ?? ''
      return companies.filter(company =>
        company.name.toLowerCase().includes(normalizedName)
      ).length
    })
  jest
    .spyOn(adminCompanyService, 'createCompany')
    .mockImplementation(async (payload: CreateCompanyPayload) => ({
      id: 'company-4',
      name: payload.name,
      email: payload.email,
      type: 'Empresa parceira',
      status: 'ativa',
      description: '',
      requests: [],
      spots: 0,
    }))
  jest.spyOn(adminCompanyService, 'deleteCompany').mockResolvedValue()
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('SchoolCompanyPage toggles to empresa view', async () => {
  await goToCompanyView()

  expect(screen.getByText('Empresas parceiras')).toBeInTheDocument()
  expect(screen.getByText('Lista de empresas')).toBeInTheDocument()
  expect(screen.getByText('Nova empresa')).toBeInTheDocument()
})

test('SchoolCompanyPage renders all company cards', async () => {
  await goToCompanyView()

  expect(screen.getAllByText('Tech Corp').length).toBeGreaterThan(0)
  expect(screen.getByText('Futuro S/A')).toBeInTheDocument()
  expect(screen.getByText('Educa Mais')).toBeInTheDocument()
})

test('SchoolCompanyPage shows details for the initially selected company', async () => {
  await goToCompanyView()

  expect(screen.getByText('parcerias@techcorp.com')).toBeInTheDocument()
  expect(screen.getByText('Solicitações de parceria')).toBeInTheDocument()
  expect(screen.getByText('Nenhuma escola solicitada')).toBeInTheDocument()
})

test('SchoolCompanyPage changes company details when another company is selected', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByTestId('company-item-company-2'))

  expect(screen.getByText('contato@futurosa.com')).toBeInTheDocument()
})

test('SchoolCompanyPage shows empty requests message', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByTestId('company-item-company-3'))

  expect(screen.getByText('parcerias@educamais.com')).toBeInTheDocument()
  expect(
    screen.getByText('Ainda não há pedidos de apoio para esta empresa.')
  ).toBeInTheDocument()
})

test('SchoolCompanyPage filters companies by search query', async () => {
  const user = await goToCompanyView()

  await user.type(
    screen.getByPlaceholderText('Pesquisar empresas...'),
    'Futuro'
  )

  await waitFor(() => {
    expect(screen.getAllByText('Futuro S/A').length).toBeGreaterThan(0)
    expect(screen.queryByText('Educa Mais')).not.toBeInTheDocument()
  })
})

test('SchoolCompanyPage opens new company modal', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Nova empresa'))

  const dialog = screen.getByRole('dialog')

  expect(
    within(dialog).getByRole('button', { name: 'Criar empresa' })
  ).toBeInTheDocument()
  expect(
    within(dialog).getByPlaceholderText('Ex: Instituto Futuro')
  ).toBeInTheDocument()
  expect(
    within(dialog).getByPlaceholderText('Ex: contato@empresa.com')
  ).toBeInTheDocument()
  expect(
    within(dialog).getByText('Selecione o tipo de parceria')
  ).toBeInTheDocument()
})

test('SchoolCompanyPage keeps create company button disabled with invalid form', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Nova empresa'))
  await user.type(
    screen.getByPlaceholderText('Ex: Instituto Futuro'),
    'Empresa Teste'
  )
  await user.type(
    screen.getByPlaceholderText('Ex: contato@empresa.com'),
    'email-invalido'
  )

  expect(
    screen.getByText('Digite um e-mail válido com @ e domínio.')
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Criar empresa' })).toBeDisabled()
})

test('SchoolCompanyPage creates a new company', async () => {
  const user = await goToCompanyView()

  await user.click(screen.getByText('Nova empresa'))

  const dialog = screen.getByRole('dialog')
  await user.type(
    within(dialog).getByPlaceholderText('Ex: Instituto Futuro'),
    'Instituto Solar'
  )
  await user.type(
    within(dialog).getByPlaceholderText('Ex: contato@empresa.com'),
    'contato@solar.com'
  )
  await user.click(within(dialog).getByRole('combobox'))
  await user.click(screen.getByRole('option', { name: 'Patrocínio' }))
  await user.type(
    within(dialog).getByPlaceholderText('Digite a senha'),
    'Senha123'
  )
  await user.type(
    within(dialog).getByPlaceholderText('Digite a senha novamente'),
    'Senha123'
  )
  await user.click(
    within(dialog).getByRole('button', { name: 'Criar empresa' })
  )

  expect(await screen.findByText('contato@solar.com')).toBeInTheDocument()
  expect(screen.getAllByText('Instituto Solar').length).toBeGreaterThan(0)
  expect(adminCompanyService.createCompany).toHaveBeenCalledWith({
    name: 'Instituto Solar',
    email: 'contato@solar.com',
    password: 'Senha123',
    type: 'Patrocínio',
  })
})
