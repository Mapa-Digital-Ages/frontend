import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('EmotionalContainer uses theme tokens and no empty JSX expressions', () => {
  const source = readSource('shared/ui/EmotionalContainer.tsx')

  assert.match(source, /alpha/)
  assert.doesNotMatch(source, /\{\}/)
  assert.doesNotMatch(source, /backgroundColor: 'white'/)
  assert.doesNotMatch(source, /color: 'black'/)
})

test('EmotionalContainer summary mode delegates to ParentEmotionalSummary', () => {
  const source = readSource('shared/ui/EmotionalContainer.tsx')

  assert.match(source, /ParentEmotionalSummary/)
  assert.match(source, /mode.*checkin.*summary|mode.*summary.*checkin/)
})
