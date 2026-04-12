import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('EmotionalContainer uses theme tokens and no empty JSX expressions', () => {
  const source = readFileSync(
    new URL('../src/components/ui/EmotionalContainer.tsx', import.meta.url),
    'utf8'
  )

  assert.doesNotMatch(source, /\{\}/)
  assert.doesNotMatch(source, /backgroundColor: 'white'/)
  assert.doesNotMatch(source, /color: 'black'/)
})
