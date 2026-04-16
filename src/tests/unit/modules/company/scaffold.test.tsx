import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('company module exposes dashboard route entry', () => {
  const source = readSource('modules/company/route.tsx')

  assert.match(source, /company\.dashboard/)
  assert.match(source, /allowedRoles=\{\['empresa'\]\}/)
})
