import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('app card merges consumer sx with its default card styles', () => {
  const cardSource = readFileSync(
    new URL('../../../src/components/ui/AppCard.tsx', import.meta.url),
    'utf8'
  )

  assert.match(cardSource, /sx,/)
  assert.match(
    cardSource,
    /\.\.\.\(Array\.isArray\(sx\) \? sx : sx \? \[sx\] : \[\]\)/
  )
})
