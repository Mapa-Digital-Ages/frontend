import { afterAll, afterEach, beforeAll, expect, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { AuthProvider } from '@/app/auth/context'
import { useAuth } from '@/app/auth/hook'
import { COOKIE_KEYS } from '@/shared/constants/storage'
import { getCookie, removeCookie } from '@/shared/lib/storage/cookies'
import { renderWithProviders } from '@/tests/helpers/render'

const server = setupServer()

function clearAuthCookies() {
  Object.values(COOKIE_KEYS).forEach(removeCookie)
}

function AuthProbe() {
  const { isAuthenticated, login, logout, status, user } = useAuth()

  return (
    <section>
      <p>Status: {status}</p>
      <p>Autenticado: {isAuthenticated ? 'sim' : 'nao'}</p>
      <p>Usuário: {user?.email ?? 'visitante'}</p>
      <button
        type="button"
        onClick={() =>
          login({
            email: 'user@test.com',
            password: '12345678',
          })
        }
      >
        Entrar
      </button>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </section>
  )
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  clearAuthCookies()
})
afterAll(() => server.close())

test('AuthProvider authenticates through authService and clears session on logout', async () => {
  const user = userEvent.setup()

  server.use(
    rest.post('http://localhost:8000/login', async (req, res, ctx) => {
      await expect(req.json()).resolves.toEqual({
        email: 'user@test.com',
        password: '12345678',
      })

      return res(
        ctx.json({
          data: {
            email: 'user@test.com',
            name: 'Usuário Teste',
            role: 'responsavel',
            token: 'token-123',
          },
          message: 'OK',
          success: true,
        })
      )
    })
  )

  renderWithProviders(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>
  )

  expect(screen.getByText('Status: unauthenticated')).toBeInTheDocument()
  expect(screen.getByText('Autenticado: nao')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  expect(await screen.findByText('Status: authenticated')).toBeInTheDocument()
  expect(screen.getByText('Autenticado: sim')).toBeInTheDocument()
  expect(screen.getByText('Usuário: user@test.com')).toBeInTheDocument()
  expect(getCookie(COOKIE_KEYS.authToken)).toBe('token-123')

  await user.click(screen.getByRole('button', { name: 'Sair' }))

  expect(screen.getByText('Status: unauthenticated')).toBeInTheDocument()
  expect(screen.getByText('Autenticado: nao')).toBeInTheDocument()
  expect(screen.getByText('Usuário: visitante')).toBeInTheDocument()
  expect(getCookie(COOKIE_KEYS.authToken)).toBeNull()
})
