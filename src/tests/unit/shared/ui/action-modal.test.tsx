import { test } from '@jest/globals'
import { assert } from '@/tests/helpers/assert'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('app action modal exists as a reusable common component', () => {
  const modalSourcePath = 'shared/ui/AppActionModal.tsx'

  assert.equal(sourceExists(modalSourcePath), true)

  const modalSource = readSource(modalSourcePath)

  assert.match(modalSource, /variant\?: 'form' \| 'confirm'/)
  assert.match(modalSource, /onConfirm/)
  assert.match(modalSource, /confirmLabel/)
  assert.match(modalSource, /cancelLabel/)
  assert.match(modalSource, /children/)
  assert.match(modalSource, /Dialog/)
  assert.match(modalSource, /DialogActions/)
  assert.match(modalSource, /confirmTextColor = '#ffffff'/)
  assert.match(modalSource, /accentSoftColor \?\?/)
  assert.doesNotMatch(modalSource, /AppColors/)
  assert.doesNotMatch(modalSource, /role: UserRole/)
})
