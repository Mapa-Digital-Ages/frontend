import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import {
  registerRequestInterceptor,
  registerResponseInterceptor,
  runRequestInterceptors,
  runResponseInterceptors,
} from '@/shared/lib/http/interceptors'

test('request interceptors run in registration order and can be unregistered', async () => {
  const calls: string[] = []
  const unregisterFirst = registerRequestInterceptor(request => {
    calls.push('first')
    const headers = new Headers(request.headers)
    headers.set('X-First', '1')
    return new Request(request, { headers })
  })
  const unregisterSecond = registerRequestInterceptor(request => {
    calls.push('second')
    const headers = new Headers(request.headers)
    headers.set('X-Second', headers.get('X-First') ?? 'missing')
    return new Request(request, { headers })
  })

  try {
    const request = await runRequestInterceptors(
      new Request('https://example.test/api')
    )

    assert.deepEqual(calls, ['first', 'second'])
    assert.equal(request.headers.get('X-First'), '1')
    assert.equal(request.headers.get('X-Second'), '1')
  } finally {
    unregisterSecond()
    unregisterFirst()
  }

  calls.length = 0
  await runRequestInterceptors(new Request('https://example.test/api'))
  assert.deepEqual(calls, [])
})

test('response interceptors can transform response payloads before consumers read them', async () => {
  const unregister = registerResponseInterceptor(async response => {
    const payload = (await response.json()) as { value: number }

    return Response.json(
      { value: payload.value + 1 },
      { status: response.status }
    )
  })

  try {
    const response = await runResponseInterceptors(
      Response.json({ value: 41 }, { status: 200 })
    )
    const payload = (await response.json()) as { value: number }

    assert.equal(payload.value, 42)
    assert.equal(response.status, 200)
  } finally {
    unregister()
  }
})
