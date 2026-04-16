import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('router guards re-export access guards', () => {
  const source = readSource('app/router/guards.tsx')

  assert.match(source, /ProtectedRoute/)
  assert.match(source, /RoleRoute/)
})
