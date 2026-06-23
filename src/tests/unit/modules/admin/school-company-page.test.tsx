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
import type { School } from '@/modules/admin/school-company/types/types'
import type { StudentItem } from '@/modules/admin/student/types/types'
import { renderWithProviders } from '@/tests/helpers/render'

const schools: School[] = [
  {
    id: '1',
    name: 'Escola São Paulo',
    email: 'contato@saopaulo.edu.br',
    isPrivate: false,
    requestedSpots: null,
    isActive: true,
    studentCount: 2,
    deactivatedAt: null,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Escola Rio Branco',
    email: 'contato@riobranco.edu.br',
    isPrivate: true,
    requestedSpots: null,
    isActive: true,
    studentCount: 1,
    deactivatedAt: null,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Escola Horizonte',
    email: 'contato@horizonte.edu.br',
    isPrivate: false,
    requestedSpots: null,
    isActive: true,
    studentCount: 1,
    deactivatedAt: null,
    createdAt: '2026-01-03T00:00:00Z',
  },
]

const studentsBySchool: Record<string, StudentItem[]> = {
  '1': [
    {
      id: 's1',
      name: 'Lucas Silva',
      email: 'lucas@mapa.com',
      guardian: 'Marina Silva',
      guardianId: 'guardian-1',
      school: 'Escola São Paulo',
      schoolId: '1',
      year: '7º Ano',
      status: 'ativo',
    },
    {
      id: 's2',
      name: 'Carlos Nunes',
      email: 'carlos@mapa.com',
      guardian: 'Paula Nunes',
      guardianId: 'guardian-2',
      school: 'Escola São Paulo',
      schoolId: '1',
      year: '8º Ano',
      status: 'ativo',
    },
  ],
  '2': [
    {
      id: 's3',
      name: 'Marina Costa',
      email: 'marina@mapa.com',
      guardian: null,
      guardianId: null,
      school: 'Escola Rio Branco',
      schoolId: '2',
      year: '6º Ano',
      status: 'ativo',
    },
  ],
  '3': [
    {
      id: 's6',
      name: 'Pedro Henrique',
      email: 'pedro@mapa.com',
      guardian: null,
      guardianId: null,
      school: 'Escola Horizonte',
      schoolId: '3',
      year: '9º Ano',
      status: 'ativo',
    },
  ],
}

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

function renderPage(initialEntries = ['/']) {
  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <SchoolCompanyPage />
    </AuthContext.Provider>,
    { initialEntries }
  )
}

beforeEach(() => {
  jest
    .spyOn(adminSchoolService, 'listSchools')
    .mockImplementation(async (_page, _size, name) => {
      const normalizedName = name?.toLowerCase() ?? ''
      const items = schools.filter(school =>
        school.name.toLowerCase().includes(normalizedName)
      )
      return { items, total: items.length }
    })
  jest
    .spyOn(adminSchoolService, 'listStudentsBySchool')
    .mockImplementation(async (schoolId, _page, _size, name) => {
      const normalizedName = name?.toLowerCase() ?? ''
      const items = (studentsBySchool[schoolId] ?? []).filter(student =>
        student.name.toLowerCase().includes(normalizedName)
      )
      return { items, total: items.length, hasMore: false }
    })
  jest.spyOn(adminCompanyService, 'listCompanies').mockResolvedValue([])
  jest.spyOn(adminCompanyService, 'countCompanies').mockResolvedValue(0)
  jest.spyOn(adminCompanyService, 'listPartnerships').mockResolvedValue([])
  jest.spyOn(adminCompanyService, 'updatePartnershipStatus').mockResolvedValue({
    id: 'partnership-1',
    schoolId: 'school-1',
    schoolName: 'Escola São Paulo',
    companyId: 'company-1',
    companyName: 'Empresa',
    requestId: 'request-1',
    requestTitle: 'Pedido de bolsas',
    requestedSpots: 10,
    remainingSpots: 5,
    grantedSpots: 5,
    status: 'approved',
    createdAt: '2026-01-01T00:00:00Z',
  })
})

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
  expect(screen.getByTestId('add-new-student')).toBeInTheDocument()
})

test('SchoolCompanyPage renders all school cards', async () => {
  renderPage()

  expect(await screen.findByTestId('school-item-1')).toBeInTheDocument()
  expect(screen.getByTestId('school-item-2')).toBeInTheDocument()
  expect(screen.getByTestId('school-item-3')).toBeInTheDocument()
  expect(screen.getAllByText('Escola São Paulo').length).toBeGreaterThan(0)
  expect(screen.getByText('Escola Rio Branco')).toBeInTheDocument()
  expect(screen.getByText('Escola Horizonte')).toBeInTheDocument()
})

test('SchoolCompanyPage shows metrics for the initially selected school', async () => {
  renderPage()

  const metrics = await screen.findByTestId('school-metrics')

  expect(within(metrics).getByText('Escola São Paulo')).toBeInTheDocument()
  expect(within(metrics).getByText('2')).toBeInTheDocument()
})

test('SchoolCompanyPage renders students for the initially selected school', async () => {
  renderPage()

  expect(await screen.findByTestId('student-item-s1')).toBeInTheDocument()
  expect(screen.getByTestId('student-item-s2')).toBeInTheDocument()
  expect(screen.getByText('Lucas Silva')).toBeInTheDocument()
  expect(screen.getByText('Carlos Nunes')).toBeInTheDocument()
})

test('SchoolCompanyPage changes students when another school is selected', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(await screen.findByTestId('school-item-3'))

  expect(await screen.findByTestId('student-item-s6')).toBeInTheDocument()
  expect(screen.getByText('Pedro Henrique')).toBeInTheDocument()
})

test('SchoolCompanyPage filters schools by search query', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('school-item-1')
  await user.type(screen.getByPlaceholderText('Pesquisar escolas...'), 'Rio')

  await waitFor(() => {
    expect(screen.getByTestId('school-item-2')).toBeInTheDocument()
    expect(screen.queryByTestId('school-item-1')).not.toBeInTheDocument()
  })
})

test('SchoolCompanyPage toggles to empresa view', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByTestId('toggle-empresa'))

  expect(screen.getByTestId('empresa-view')).toBeInTheDocument()
  expect(screen.queryByTestId('escola-view')).not.toBeInTheDocument()
})

test('SchoolCompanyPage opens school creation from dashboard shortcut', () => {
  renderPage(['/admin/schools-companies?create=school'])

  expect(
    screen.getByText('Cadastre uma escola para iniciar processo de ativação.')
  ).toBeInTheDocument()
})

test('SchoolCompanyPage opens company creation from dashboard shortcut', () => {
  renderPage(['/admin/schools-companies?create=company'])

  expect(screen.getByTestId('empresa-view')).toBeInTheDocument()
  expect(
    screen.getByText('Cadastre uma nova empresa parceira.')
  ).toBeInTheDocument()
})

test('SchoolCompanyPage opens new school modal and verifies current fields', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByTestId('add-new-school'))

  const dialog = screen.getByRole('dialog')
  const nameInput = within(dialog).getByPlaceholderText('Ex: Escola São Paulo')
  const emailInput = within(dialog).getByPlaceholderText(
    'Ex: contato@escola.edu.br'
  )

  await user.type(nameInput, 'Escola de Teste')
  await user.type(emailInput, 'contato@teste.edu.br')

  expect(nameInput).toHaveValue('Escola de Teste')
  expect(emailInput).toHaveValue('contato@teste.edu.br')
  expect(within(dialog).getByTestId('new-school-type')).toBeInTheDocument()
  expect(
    within(dialog).getByRole('button', { name: /Criar escola/i })
  ).toBeInTheDocument()
  expect(
    within(dialog).getByRole('button', { name: /Cancelar/i })
  ).toBeInTheDocument()
})
