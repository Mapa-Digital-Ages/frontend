import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import SchoolStudentsPage from '@/modules/school/students/page/Page'
import { studentService } from '@/modules/admin/student/services/service'
import { studentFormOptionsService } from '@/modules/admin/shared/constants/studentOptions'
import { authService } from '@/app/auth/core/service'
import { renderWithProviders } from '@/tests/helpers/render'

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  logout: jest.fn(),
  status: 'authenticated',
  token: 'token-123',
  user: {
    email: 'escola@mapa.local',
    name: 'Escola São Paulo',
    role: 'escola',
  },
}

beforeEach(() => {
  jest.spyOn(authService, 'getUserId').mockReturnValue('school-1')
  jest.spyOn(studentService, 'getStudents').mockResolvedValue({
    items: [],
    total: 0,
    hasMore: false,
  })
  jest.spyOn(studentService, 'countStudents').mockResolvedValue(0)
  jest
    .spyOn(studentFormOptionsService, 'getSchools')
    .mockResolvedValue([{ label: 'Escola São Paulo', value: 'school-1' }])
  jest
    .spyOn(studentFormOptionsService, 'getGuardians')
    .mockResolvedValue([{ label: 'Fernanda Silva', value: 'guardian-1' }])
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('SchoolStudentsPage filters students and count by school ID and opens create student modal with school pre-selected and disabled', async () => {
  const user = userEvent.setup()

  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <SchoolStudentsPage />
    </AuthContext.Provider>
  )

  await waitFor(() => {
    expect(studentService.getStudents).toHaveBeenCalledWith(
      expect.objectContaining({
        schoolId: 'school-1',
      })
    )
    expect(studentService.countStudents).toHaveBeenCalledWith(
      undefined,
      'school-1'
    )
  })

  await user.click(screen.getByRole('button', { name: /criar aluno/i }))

  const dialog = screen.getByRole('dialog')
  const dropdowns = within(dialog).getAllByRole('combobox')
  const schoolDropdown = dropdowns[1]
  expect(schoolDropdown).toHaveAttribute('aria-disabled', 'true')
  expect(schoolDropdown).toHaveTextContent('Escola São Paulo')
})

test('SchoolStudentsPage immediately shows the selected guardian after creating a student', async () => {
  const user = userEvent.setup()
  jest.spyOn(studentService, 'createStudent').mockResolvedValue({
    id: 'student-1',
    name: 'Ana Souza',
    email: 'ana@example.com',
    guardian: null,
    guardianId: null,
    school: 'Escola São Paulo',
    schoolId: 'school-1',
    year: '5º Ano',
    status: 'ativo',
  })

  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <SchoolStudentsPage />
    </AuthContext.Provider>
  )

  await user.click(screen.getByRole('button', { name: /criar aluno/i }))
  const dialog = screen.getByRole('dialog')
  await user.type(within(dialog).getByLabelText('Nome do aluno'), 'Ana Souza')
  await user.type(within(dialog).getByLabelText('E-mail'), 'ana@example.com')
  await user.type(within(dialog).getByLabelText('Senha'), 'senha1234')
  await user.type(
    within(dialog).getByLabelText('Data de nascimento'),
    '2014-01-10'
  )

  const guardianDropdown = within(dialog).getAllByRole('combobox')[2]
  await user.click(guardianDropdown)
  await user.click(screen.getByRole('option', { name: 'Fernanda Silva' }))
  await user.click(within(dialog).getByRole('button', { name: 'Criar aluno' }))

  expect(await screen.findByTestId('student-row-student-1')).toHaveTextContent(
    'Responsável: Fernanda Silva'
  )
})
