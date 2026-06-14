import { afterEach, expect, jest, test } from '@jest/globals'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateStudentModal from '@/modules/admin/shared/components/CreateStudentModal'
import { studentFormOptionsService } from '@/modules/admin/shared/constants/studentOptions'
import { renderWithProviders } from '@/tests/helpers/render'

afterEach(() => {
  jest.restoreAllMocks()
})

test('CreateStudentModal validates the surname while the user types', async () => {
  const user = userEvent.setup()
  const onConfirm = jest.fn()

  jest.spyOn(studentFormOptionsService, 'getSchools').mockResolvedValue([])
  jest.spyOn(studentFormOptionsService, 'getGuardians').mockResolvedValue([])

  renderWithProviders(
    <CreateStudentModal
      defaultSchool={{ label: 'Escola Mapa', value: 'school-1' }}
      onClose={jest.fn()}
      onConfirm={onConfirm}
      open
    />
  )

  const nameInput = screen.getByLabelText('Nome do aluno')

  expect(
    screen.queryByText('Informe o sobrenome do aluno.')
  ).not.toBeInTheDocument()

  await user.type(nameInput, 'Sofia')

  expect(screen.getByText('Informe o sobrenome do aluno.')).toBeInTheDocument()

  await user.type(nameInput, ' Almeida')

  expect(
    screen.queryByText('Informe o sobrenome do aluno.')
  ).not.toBeInTheDocument()

  await user.type(screen.getByLabelText('E-mail'), 'sofia@mapa.com')
  await user.type(screen.getByLabelText('Senha'), '12345678')
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /^criar aluno$/i,
    })
  )

  expect(onConfirm).toHaveBeenCalledTimes(1)

  await user.clear(nameInput)

  expect(screen.getByText('Informe o nome do aluno.')).toBeInTheDocument()
})

test('CreateStudentModal rejects an invalid email while the user types', async () => {
  const user = userEvent.setup()
  const onConfirm = jest.fn()

  jest.spyOn(studentFormOptionsService, 'getSchools').mockResolvedValue([])
  jest.spyOn(studentFormOptionsService, 'getGuardians').mockResolvedValue([])

  renderWithProviders(
    <CreateStudentModal
      defaultSchool={{ label: 'Escola Mapa', value: 'school-1' }}
      onClose={jest.fn()}
      onConfirm={onConfirm}
      open
    />
  )

  await user.type(screen.getByLabelText('Nome do aluno'), 'Sofia Almeida')
  await user.type(screen.getByLabelText('Senha'), '12345678')

  const emailInput = screen.getByLabelText('E-mail')
  await user.type(emailInput, 'sofia@mapa.com,')

  expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()

  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /^criar aluno$/i,
    })
  )

  expect(onConfirm).not.toHaveBeenCalled()

  await user.clear(emailInput)
  await user.type(emailInput, 'sofia@mapa.com')

  expect(
    screen.queryByText('Informe um e-mail válido.')
  ).not.toBeInTheDocument()
})
