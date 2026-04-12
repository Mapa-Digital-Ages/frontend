import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

test('app action modal exists as a reusable common component', () => {
  const modalPath = new URL(
    '../../../src/components/common/AppActionModal.tsx',
    import.meta.url
  )

  assert.equal(existsSync(modalPath), true)

  const modalSource = readFileSync(modalPath, 'utf8')

  assert.match(modalSource, /variant\?: 'form' \| 'confirm'/)
  assert.match(modalSource, /onConfirm/)
  assert.match(modalSource, /confirmLabel/)
  assert.match(modalSource, /cancelLabel/)
  assert.match(modalSource, /children/)
  assert.match(modalSource, /Dialog/)
  assert.match(modalSource, /DialogActions/)
})
