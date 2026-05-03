import { expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {
  AuthCredentials,
  RegisterCredentials,
} from '@/app/auth/core/types'
import LoginForm from '@/modules/auth/login/components/LoginForm'
import { renderWithProviders } from '@/tests/helpers/render'

type LoginSubmitValues = AuthCredentials | RegisterCredentials

test('login form blocks invalid credentials before calling submit', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn<(values: LoginSubmitValues) => Promise<void>>()

  renderWithProviders(<LoginForm mode="login" onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/e-mail/i), 'invalid-email')
  await user.type(screen.getByLabelText(/^senha$/i), '123')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  expect(onSubmit).not.toHaveBeenCalled()
  expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
  expect(
    screen.getByText('A senha deve ter pelo menos 8 caracteres.')
  ).toBeInTheDocument()
})

test('login form submits normalized credentials when fields are valid', async () => {
  const user = userEvent.setup()
  const onSubmit = jest
    .fn<(values: LoginSubmitValues) => Promise<void>>()
    .mockResolvedValue(undefined)

  renderWithProviders(<LoginForm mode="login" onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/e-mail/i), '  user@example.com  ')
  await user.type(screen.getByLabelText(/^senha$/i), '12345678')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'user@example.com',
    password: '12345678',
  })
})

test('login form disables submit while submission is in progress', () => {
  const onSubmit = jest.fn<(values: LoginSubmitValues) => Promise<void>>()

  renderWithProviders(
    <LoginForm mode="login" isSubmitting onSubmit={onSubmit} />
  )

  expect(screen.getByRole('button', { name: 'Processando...' })).toBeDisabled()
})

test('login form toggles password visibility with an accessible button', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn<(values: LoginSubmitValues) => Promise<void>>()

  renderWithProviders(<LoginForm mode="login" onSubmit={onSubmit} />)

  const passwordInput = screen.getByLabelText(/^senha$/i)
  expect(passwordInput).toHaveAttribute('type', 'password')

  await user.click(screen.getByRole('button', { name: /mostrar senha/i }))

  expect(passwordInput).toHaveAttribute('type', 'text')
  expect(
    screen.getByRole('button', { name: /ocultar senha/i })
  ).toBeInTheDocument()
})

test('register form requires matching password confirmation before submit', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn<(values: LoginSubmitValues) => Promise<void>>()

  renderWithProviders(<LoginForm mode="register" onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/^nome$/i), 'Maria')
  await user.type(screen.getByLabelText(/sobrenome/i), 'Responsável')
  await user.type(screen.getByLabelText(/e-mail/i), 'maria@example.com')
  await user.type(screen.getByLabelText(/^senha$/i), '12345678')
  await user.type(screen.getByLabelText(/confirmar senha/i), '87654321')
  await user.click(screen.getByRole('button', { name: 'Criar conta' }))

  expect(onSubmit).not.toHaveBeenCalled()
  expect(screen.getByText('As senhas devem ser iguais.')).toBeInTheDocument()
})
