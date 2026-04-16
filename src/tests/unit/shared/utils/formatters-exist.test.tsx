import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('shared formatters module exists', () => {
  const source = readSource('shared/utils/formatters.ts')

  assert.ok(source.length > 0)
})
