import { expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import type {
  AuthCredentials,
  RegisterCredentials,
} from '@/app/auth/core/types'
import LoginForm from '@/modules/auth/login/components/LoginForm'
import { renderWithProviders } from '@/tests/helpers/render'

type LoginSubmitValues = AuthCredentials | RegisterCredentials

test('login form exposes accessible labels for its required fields', () => {
  const onSubmit = jest.fn<(values: LoginSubmitValues) => Promise<void>>()

  renderWithProviders(<LoginForm mode="login" onSubmit={onSubmit} />)

  expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /mostrar senha/i })
  ).toBeInTheDocument()
})

test('register form exposes accessible labels for name, surname and password confirmation', () => {
  const onSubmit = jest.fn<(values: LoginSubmitValues) => Promise<void>>()

  renderWithProviders(<LoginForm mode="register" onSubmit={onSubmit} />)

  expect(screen.getByLabelText(/^nome$/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/sobrenome/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument()
})
