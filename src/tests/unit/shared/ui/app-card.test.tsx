import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('app card merges consumer sx with its default card styles', () => {
  const cardSource = readSource('shared/ui/AppCard.tsx')

  assert.match(cardSource, /sx,/)
  assert.match(
    cardSource,
    /\.\.\.\(Array\.isArray\(sx\) \? sx : sx \? \[sx\] : \[\]\)/
  )
})
