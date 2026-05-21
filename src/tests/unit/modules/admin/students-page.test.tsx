import { afterEach, expect, jest, test } from '@jest/globals'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/tests/helpers/render'
import StudentsPage from '@/modules/admin/student/page/Page'
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
      <StudentsPage />
    </AuthContext.Provider>
  )
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('StudentsPage renders metrics cards and students list', () => {
  renderPage()

  expect(screen.getByText('Alunos Visíveis')).toBeInTheDocument()
  expect(screen.getByText('Sem Turma')).toBeInTheDocument()
  expect(screen.getByText('Risco Alto')).toBeInTheDocument()
  expect(screen.getByText('Escolas')).toBeInTheDocument()

  expect(screen.getByTestId('student-row-1')).toBeInTheDocument()
  expect(screen.getByTestId('student-row-2')).toBeInTheDocument()
})

test('StudentsPage filters students by search text', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(
    screen.getByPlaceholderText(
      'Pesquisar alunos, responsáveis, escola ou turma...'
    ),
    'Lucas'
  )

  expect(screen.getByText('Lucas Silva')).toBeInTheDocument()

  expect(screen.queryByText('Marina Costa')).not.toBeInTheDocument()
})

test('StudentsPage filters students by status', async () => {
  const user = userEvent.setup()

  renderPage()

  const filter = screen.getByRole('combobox')

  await user.click(filter)
  await user.click(screen.getByRole('option', { name: 'Inativo' }))

  expect(screen.getByText('Lucas Silva')).toBeInTheDocument()

  expect(screen.queryByText('Marina Costa')).not.toBeInTheDocument()
})

test('StudentsPage opens create student modal', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(
    screen.getByRole('button', {
      name: /criar aluno/i,
    })
  )

  expect(
    screen.getByText(
      'Cadastre um novo aluno e vincule a uma turma, se desejar.'
    )
  ).toBeInTheDocument()
})

test('StudentsPage creates a new student', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(
    screen.getByRole('button', {
      name: /criar aluno/i,
    })
  )

  await user.type(
    screen.getByPlaceholderText('Ex.: Sofia Almeida'),
    'Pedro Lima'
  )

  await user.type(
    screen.getByPlaceholderText('Ex.: Camila Almeida'),
    'Fernanda Lima'
  )

  const dialog = screen.getByRole('dialog')

  await user.click(
    within(dialog).getByRole('button', {
      name: /^criar aluno$/i,
    })
  )

  expect(screen.getByText('Pedro Lima')).toBeInTheDocument()
})

test('StudentsPage opens action menu', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByTestId('student-menu-1'))

  expect(screen.getByText('Transferir aluno')).toBeInTheDocument()

  expect(screen.getByText(/Tornar/i)).toBeInTheDocument()

  expect(screen.getByText('Excluir aluno')).toBeInTheDocument()
})

test('StudentsPage toggles student status', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByTestId('student-menu-1'))

  await user.click(screen.getByTestId('toggle-status-action'))

  expect(screen.getAllByText('Ativo').length).toBeGreaterThan(0)
})

test('StudentsPage opens transfer modal', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByTestId('student-menu-1'))

  await user.click(screen.getByTestId('transfer-student-action'))

  expect(
    screen.getByText(/Selecione um aluno já cadastrado/i)
  ).toBeInTheDocument()
})

test('StudentsPage opens delete modal', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.click(screen.getByTestId('student-menu-1'))

  await user.click(screen.getByTestId('delete-student-action'))

  expect(screen.getByText(/Deseja remover/i)).toBeInTheDocument()
})

test('StudentsPage deletes a student', async () => {
  const user = userEvent.setup()

  renderPage()

  expect(screen.getByText('Lucas Silva')).toBeInTheDocument()

  await user.click(screen.getByTestId('student-menu-1'))

  await user.click(screen.getByTestId('delete-student-action'))

  await user.click(
    screen.getByRole('button', {
      name: /confirmar exclusão/i,
    })
  )

  expect(screen.queryByText('Lucas Silva')).not.toBeInTheDocument()
})
