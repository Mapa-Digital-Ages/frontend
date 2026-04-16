import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('auth route registers login and forgot-password', () => {
  const source = readSource('modules/auth/route.tsx')

  assert.match(source, /forgotPassword/)
  assert.match(source, /login\/page\/Page/)
  assert.match(source, /forgot-password\/page\/Page/)
})
