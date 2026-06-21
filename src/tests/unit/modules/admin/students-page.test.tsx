import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import StudentsPage from '@/modules/admin/student/page/Page'
import { studentService } from '@/modules/admin/student/services/service'
import type {
  CreateStudentInput,
  StudentItem,
} from '@/modules/admin/student/types/types'
import { studentFormOptionsService } from '@/modules/admin/shared/constants/studentOptions'
import { renderWithProviders } from '@/tests/helpers/render'

const students: StudentItem[] = [
  {
    id: '1',
    name: 'Lucas Silva',
    email: 'lucas@mapa.com',
    guardian: 'Fernanda Silva',
    guardianId: null,
    school: 'Escola São Paulo',
    schoolId: null,
    year: '7º Ano',
    status: 'ativo',
  },
  {
    id: '2',
    name: 'Marina Costa',
    email: 'marina@mapa.com',
    guardian: null,
    guardianId: null,
    school: 'Escola Horizonte',
    schoolId: null,
    year: '8º Ano',
    status: 'inativo',
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
      <StudentsPage />
    </AuthContext.Provider>
  )
}

beforeEach(() => {
  jest.spyOn(studentService, 'getStudents').mockImplementation(async query => {
    const normalizedQuery = query.query?.toLowerCase() ?? ''
    const items = students.filter(student =>
      student.name.toLowerCase().includes(normalizedQuery)
    )
    return { items, total: items.length, hasMore: false }
  })
  jest
    .spyOn(studentService, 'createStudent')
    .mockImplementation(async (input: CreateStudentInput) => ({
      id: '3',
      name: input.name,
      email: input.email,
      guardian: null,
      guardianId: input.guardianId,
      school: 'Escola São Paulo',
      schoolId: input.schoolId,
      year: '7º Ano',
      status: input.status,
    }))
  jest
    .spyOn(studentService, 'updateStudent')
    .mockImplementation(
      async id => students.find(student => student.id === id)!
    )
  jest.spyOn(studentService, 'deleteStudent').mockResolvedValue()
  jest.spyOn(studentFormOptionsService, 'getSchools').mockResolvedValue([
    { label: 'Escola São Paulo', value: 'school-1' },
    { label: 'Escola Horizonte', value: 'school-2' },
  ])
  jest
    .spyOn(studentFormOptionsService, 'getGuardians')
    .mockResolvedValue([{ label: 'Fernanda Silva', value: 'guardian-1' }])
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('StudentsPage renders metrics cards and students list', async () => {
  renderPage()

  expect(screen.getByText('Total de Alunos')).toBeInTheDocument()
  expect(screen.getByText('Escolas')).toBeInTheDocument()
  expect(await screen.findByTestId('student-row-1')).toBeInTheDocument()
  expect(screen.getByTestId('student-row-2')).toBeInTheDocument()
})

test('StudentsPage filters students by search text', async () => {
  const user = userEvent.setup()
  renderPage()

  await screen.findByTestId('student-row-1')
  await user.type(
    screen.getByPlaceholderText('Pesquisar alunos por nome...'),
    'Lucas'
  )

  await waitFor(() => {
    expect(screen.getByText('Lucas Silva')).toBeInTheDocument()
    expect(screen.queryByText('Marina Costa')).not.toBeInTheDocument()
  })
})

test('StudentsPage opens create student modal', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(
    screen.getByRole('button', {
      name: /^criar aluno$/i,
    })
  )

  expect(
    screen.getByText(
      'Cadastre um novo aluno. Vincule-o a uma escola e/ou a um responsável'
    )
  ).toBeInTheDocument()
})

test('StudentsPage creates a new student', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByRole('button', { name: /^criar aluno$/i }))

  const dialog = screen.getByRole('dialog')
  await user.type(
    within(dialog).getByPlaceholderText('Ex.: Sofia Almeida'),
    'Pedro Lima'
  )
  await user.type(
    within(dialog).getByPlaceholderText('Ex.: voce@exemplo.com'),
    'pedro@mapa.com'
  )
  await user.type(
    within(dialog).getByPlaceholderText('Mínimo 8 caracteres'),
    'Senha123'
  )

  const dropdowns = within(dialog).getAllByRole('combobox')
  await user.click(dropdowns[1])
  await user.click(screen.getByRole('option', { name: 'Escola São Paulo' }))
  await user.click(
    within(dialog).getByRole('button', {
      name: /^criar aluno$/i,
    })
  )

  expect(await screen.findByText('Pedro Lima')).toBeInTheDocument()
  expect(studentService.createStudent).toHaveBeenCalled()
})

test('StudentsPage opens action menu', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(await screen.findByTestId('student-menu-1'))

  expect(screen.getByText('Editar aluno')).toBeInTheDocument()
  expect(screen.getByText('Excluir aluno')).toBeInTheDocument()
})

test('StudentsPage opens edit modal', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(await screen.findByTestId('student-menu-1'))
  await user.click(screen.getByTestId('edit-student-action'))

  const dialog = screen.getByRole('dialog')
  expect(
    within(dialog).getByText('Editando dados do aluno')
  ).toBeInTheDocument()
  expect(
    within(dialog).getByPlaceholderText('Deixe em branco para não alterar')
  ).toBeInTheDocument()
})

test('StudentsPage opens delete modal', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(await screen.findByTestId('student-menu-1'))
  await user.click(screen.getByTestId('delete-student-action'))

  expect(screen.getByText(/Deseja remover "Lucas Silva"/i)).toBeInTheDocument()
})

test('StudentsPage deletes a student', async () => {
  const user = userEvent.setup()
  renderPage()

  expect(await screen.findByText('Lucas Silva')).toBeInTheDocument()
  await user.click(screen.getByTestId('student-menu-1'))
  await user.click(screen.getByTestId('delete-student-action'))
  await user.click(
    screen.getByRole('button', {
      name: /confirmar exclusão/i,
    })
  )

  await waitFor(() => {
    expect(screen.queryByText('Lucas Silva')).not.toBeInTheDocument()
  })
  expect(studentService.deleteStudent).toHaveBeenCalledWith('1')
})

test('StudentsPage shows the batch button inside the create modal', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByRole('button', { name: /^criar aluno$/i }))

  const dialog = screen.getByRole('dialog')
  expect(
    within(dialog).getByRole('button', { name: /cadastrar em lote/i })
  ).toBeInTheDocument()
})

test('StudentsPage opens the batch upload modal from the create modal', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByRole('button', { name: /^criar aluno$/i }))

  const createDialog = screen.getByRole('dialog')
  await user.click(
    within(createDialog).getByRole('button', { name: /cadastrar em lote/i })
  )

  expect(screen.getByText('Cadastrar alunos em lote')).toBeInTheDocument()
  expect(
    screen.getByText('Apenas arquivos .csv são aceitos.')
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /enviar arquivo/i })
  ).toBeInTheDocument()
})

test('StudentsPage keeps the send button disabled until a csv is chosen', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByRole('button', { name: /^criar aluno$/i }))
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /cadastrar em lote/i,
    })
  )

  expect(screen.getByRole('button', { name: /enviar arquivo/i })).toBeDisabled()
})

test('StudentsPage accepts a csv file and shows its name', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByRole('button', { name: /^criar aluno$/i }))
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /cadastrar em lote/i,
    })
  )

  const fileInput = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement
  const csv = new File(['nome,email'], 'alunos.csv', { type: 'text/csv' })
  await user.upload(fileInput, csv)

  expect(await screen.findByText('alunos.csv')).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /enviar arquivo/i })
  ).not.toBeDisabled()
})

test('StudentsPage shows the success message after sending the file', async () => {
  const user = userEvent.setup()
  renderPage()

  await user.click(screen.getByRole('button', { name: /^criar aluno$/i }))
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /cadastrar em lote/i,
    })
  )

  const fileInput = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement
  const csv = new File(['nome,email'], 'alunos.csv', { type: 'text/csv' })
  await user.upload(fileInput, csv)

  await user.click(screen.getByRole('button', { name: /enviar arquivo/i }))

  expect(
    await screen.findByText(/Arquivo enviado com sucesso/i)
  ).toBeInTheDocument()
})
