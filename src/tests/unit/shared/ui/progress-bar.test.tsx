import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('ProgressBar supports subject valueLabelVariant with headerSlot', () => {
  const source = readSource('shared/ui/ProgressBar.tsx')

  assert.match(source, /subject/)
  assert.match(source, /headerSlot/)
  assert.match(source, /valueLabelVariant === 'subject'/)
})

test('ProgressBar uses white track and fill for header variant', () => {
  const source = readSource('shared/ui/ProgressBar.tsx')

  assert.match(source, /isHeaderValueLabel/)
  assert.match(source, /rgba\(255,255,255,0\.25\)/)
  assert.match(source, /rgba\(255,255,255,0\.85\)/)
})
