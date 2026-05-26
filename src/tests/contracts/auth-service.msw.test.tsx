import { afterAll, afterEach, beforeAll, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { authService } from '@/app/auth/core/service'
import { ParentStatusError } from '@/app/auth/core/types'
import { COOKIE_KEYS } from '@/shared/constants/storage'
import { getCookie, removeCookie } from '@/shared/lib/storage/cookies'

const server = setupServer()

function clearAuthCookies() {
  Object.values(COOKIE_KEYS).forEach(removeCookie)
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  clearAuthCookies()
})
afterAll(() => server.close())

test('authService.login posts credentials and persists the authenticated session', async () => {
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

  const result = await authService.login({
    email: 'user@test.com',
    password: '12345678',
  })

  expect(result).toMatchObject({
    email: 'user@test.com',
    name: 'Usuário Teste',
    role: 'responsavel',
    token: 'token-123',
  })
  expect(getCookie(COOKIE_KEYS.authToken)).toBe('token-123')
  expect(authService.getUser()).toMatchObject({
    email: 'user@test.com',
    name: 'Usuário Teste',
    role: 'responsavel',
  })
})

test('authService.login blocks pending parent accounts without persisting a token', async () => {
  server.use(
    rest.post('http://localhost:8000/login', (_req, res, ctx) =>
      res(
        ctx.json({
          data: {
            email: 'pending@test.com',
            name: 'Responsável Pendente',
            role: 'responsavel',
            status: 'aguardando',
            token: 'pending-token',
          },
          message: 'OK',
          success: true,
        })
      )
    )
  )

  await expect(
    authService.login({
      email: 'pending@test.com',
      password: '12345678',
    })
  ).rejects.toMatchObject({
    parentStatus: 'AGUARDANDO',
  } satisfies Partial<ParentStatusError>)
  expect(getCookie(COOKIE_KEYS.authToken)).toBeNull()
})

test('authService.login maps forbidden parent responses to ParentStatusError', async () => {
  server.use(
    rest.post('http://localhost:8000/login', (_req, res, ctx) =>
      res(ctx.status(403), ctx.json({ detail: 'Cadastro negado' }))
    )
  )

  await expect(
    authService.login({
      email: 'denied@test.com',
      password: '12345678',
    })
  ).rejects.toBeInstanceOf(ParentStatusError)
  await expect(
    authService.login({
      email: 'denied@test.com',
      password: '12345678',
    })
  ).rejects.toMatchObject({
    parentStatus: 'NEGADO',
  } satisfies Partial<ParentStatusError>)
})
