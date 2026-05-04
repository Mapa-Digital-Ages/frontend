import { afterAll, afterEach, beforeAll, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { COOKIE_KEYS } from '@/shared/constants/storage'
import { HttpClient, HttpRequestError } from '@/shared/lib/http/client-core'
import { setCookie, removeCookie } from '@/shared/lib/storage/cookies'

const server = setupServer()
const httpClient = new HttpClient('http://localhost:8000/')

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  removeCookie(COOKIE_KEYS.authToken)
})
afterAll(() => server.close())

test('httpClient sends auth headers, query params and JSON body through fetch', async () => {
  setCookie(COOKIE_KEYS.authToken, 'token-123')

  server.use(
    rest.post('http://localhost:8000/admin/users', async (req, res, ctx) => {
      const body = (await req.json()) as { name: string }
      const url = new URL(req.url)

      expect(req.headers.get('authorization')).toBe('Bearer token-123')
      expect(req.headers.get('content-type')).toContain('application/json')
      expect(url.searchParams.get('role')).toBe('responsavel')
      expect(url.searchParams.has('empty')).toBe(false)
      expect(body).toEqual({ name: 'Maria' })

      return res(
        ctx.json({
          data: { id: 1 },
          message: 'created',
          success: true,
        })
      )
    })
  )

  const response = await httpClient.post<{ id: number }>(
    'admin/users',
    { name: 'Maria' },
    { query: { empty: undefined, role: 'responsavel' } }
  )

  expect(response.data.id).toBe(1)
  expect(response.message).toBe('created')
})

test('httpClient preserves path prefixes when base URL has no trailing slash', async () => {
  const apiClient = new HttpClient('http://localhost:8000/api')

  server.use(
    rest.get('http://localhost:8000/api/login', (_req, res, ctx) =>
      res(ctx.json({ ok: true }))
    )
  )

  const response = await apiClient.get<{ ok: boolean }>('login', {
    skipAuth: true,
  })

  expect(response.data.ok).toBe(true)
})

test('httpClient can skip auth and normalizes non-envelope JSON responses', async () => {
  setCookie(COOKIE_KEYS.authToken, 'token-123')

  server.use(
    rest.get('http://localhost:8000/public/info', (req, res, ctx) => {
      expect(req.headers.get('authorization')).toBeNull()

      return res(ctx.json({ version: '1.0.0' }))
    })
  )

  const response = await httpClient.get<{ version: string }>('public/info', {
    skipAuth: true,
  })

  expect(response).toEqual({
    data: { version: '1.0.0' },
    message: 'OK',
    success: true,
  })
})

test('httpClient throws HttpRequestError with status and response on API errors', async () => {
  server.use(
    rest.get('http://localhost:8000/private/failure', (_req, res, ctx) =>
      res(ctx.status(403), ctx.json({ detail: 'Forbidden' }))
    )
  )

  await expect(httpClient.get('private/failure')).rejects.toMatchObject({
    name: 'HttpRequestError',
    status: 403,
  } satisfies Partial<HttpRequestError>)
})

test('httpClient encodes query params with spaces and special characters', async () => {
  server.use(
    rest.get('http://localhost:8000/admin/search', (req, res, ctx) => {
      const url = new URL(req.url)

      expect(url.searchParams.get('query')).toBe(' matemática avançada ')
      expect(url.searchParams.get('tag')).toBe('7º ano')

      return res(ctx.json({ results: [] }))
    })
  )

  const response = await httpClient.get<{ results: unknown[] }>(
    'admin/search',
    {
      query: {
        query: ' matemática avançada ',
        tag: '7º ano',
      },
    }
  )

  expect(response.data.results).toEqual([])
})

test('httpClient normalizes 204 responses without parsing JSON', async () => {
  server.use(
    rest.delete('http://localhost:8000/admin/users/42', (_req, res, ctx) =>
      res(ctx.status(204))
    )
  )

  await expect(httpClient.delete('admin/users/42')).resolves.toEqual({
    data: null,
    message: 'No content',
    success: true,
  })
})

test.each([401, 422, 500])(
  'httpClient preserves %i response status on API errors',
  async status => {
    server.use(
      rest.get('http://localhost:8000/private/status', (_req, res, ctx) =>
        res(ctx.status(status), ctx.json({ detail: `HTTP ${status}` }))
      )
    )

    await expect(httpClient.get('private/status')).rejects.toMatchObject({
      name: 'HttpRequestError',
      status,
    } satisfies Partial<HttpRequestError>)
  }
)
