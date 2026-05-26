import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('forgot password validates matching passwords and redirects to login after saving', () => {
  const source = readSource('modules/auth/forgot-password/page/Page.tsx')

  assert.match(source, /forgotPasswordService\.requestReset/)
  assert.match(source, /forgotPasswordService\.confirmReset/)
  assert.match(source, /password !== confirmPassword/)
  assert.match(source, /As senhas devem ser iguais\./)
  assert.match(source, /navigate\(APP_ROUTES\.auth\.login\)/)
  assert.match(source, /setCodeError\('Código inválido ou expirado\.'\)/)
  assert.doesNotMatch(source, /123456/)
})

test('forgot password service calls password reset API endpoints', () => {
  const source = readSource('modules/auth/forgot-password/services/service.ts')

  assert.match(source, /password-reset\/request/)
  assert.match(source, /password-reset\/confirm/)
  assert.match(source, /skipAuth: true/)
})
