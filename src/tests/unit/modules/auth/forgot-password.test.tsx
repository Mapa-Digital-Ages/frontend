import { assert } from '@/tests/helpers/assert'
import { afterEach, expect, jest, test } from '@jest/globals'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Outlet, Route, Routes } from 'react-router-dom'
import { readSource } from '@/tests/helpers/source'
import ForgotPasswordPage from '@/modules/auth/forgot-password/page/Page'
import { forgotPasswordService } from '@/modules/auth/forgot-password/services/service'
import { renderWithProviders } from '@/tests/helpers/render'

afterEach(() => {
  jest.restoreAllMocks()
})

test('forgot password validates matching passwords and redirects to login after saving', () => {
  const source = readSource('modules/auth/forgot-password/page/Page.tsx')

  assert.match(source, /forgotPasswordService\.requestReset/)
  assert.match(source, /forgotPasswordService\.confirmReset/)
  assert.match(source, /password !== confirmPassword/)
  assert.match(source, /As senhas devem ser iguais\./)
  assert.match(source, /navigate\(APP_ROUTES\.auth\.login\)/)
  assert.match(source, /setCodeError\('Código inválido ou expirado\.'\)/)
  assert.match(source, /parsePasswordResetLink/)
  assert.match(source, /resetLink \? 3 : 1/)
  assert.match(source, /InputProps=\{\{ readOnly: true \}\}/)
  assert.doesNotMatch(source, /123456/)
})

test('forgot password service calls password reset API endpoints', () => {
  const source = readSource('modules/auth/forgot-password/services/service.ts')

  assert.match(source, /password-reset\/request/)
  assert.match(source, /password-reset\/confirm/)
  assert.match(source, /skipAuth: true/)
})

test('password reset email link opens the new-password step with email and code prefilled', async () => {
  const setMode = jest.fn()
  const confirmReset = jest
    .spyOn(forgotPasswordService, 'confirmReset')
    .mockResolvedValue()
  const user = userEvent.setup()

  renderWithProviders(
    <Routes>
      <Route element={<Outlet context={{ setMode }} />}>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>,
    {
      initialEntries: [
        '/forgot-password#email=novo.usuario%40example.com&code=123456',
      ],
    }
  )

  const emailInput = screen.getByLabelText('E-mail') as HTMLInputElement
  expect(emailInput).toHaveValue('novo.usuario@example.com')
  expect(emailInput.readOnly).toBe(true)
  expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument()
  expect(screen.queryByLabelText(/dígito 1 do código/i)).not.toBeInTheDocument()

  await user.type(screen.getByLabelText(/^senha$/i), 'nova-senha-123')
  await user.type(screen.getByLabelText(/confirmar senha/i), 'nova-senha-123')
  await user.click(screen.getByRole('button', { name: /salvar senha/i }))

  await waitFor(() => {
    expect(confirmReset).toHaveBeenCalledWith({
      email: 'novo.usuario@example.com',
      code: '123456',
      newPassword: 'nova-senha-123',
    })
  })
})
