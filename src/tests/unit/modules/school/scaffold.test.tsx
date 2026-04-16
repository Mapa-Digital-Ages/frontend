import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('school module exposes dashboard route entry', () => {
  const source = readSource('modules/school/route.tsx')

  assert.match(source, /school\.dashboard/)
  assert.match(source, /allowedRoles=\{\['escola'\]\}/)
})
