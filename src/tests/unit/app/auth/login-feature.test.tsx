import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('login feature exposes Page, service and wraps authService', () => {
  const pageSource = readSource('modules/auth/login/page/Page.tsx')
  const serviceSource = readSource('modules/auth/login/services/service.ts')

  assert.match(pageSource, /export default function Page/)
  assert.match(serviceSource, /loginService/)
  assert.match(serviceSource, /authService/)
})
