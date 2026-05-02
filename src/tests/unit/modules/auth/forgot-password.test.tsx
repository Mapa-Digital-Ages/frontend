import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('forgot password validates matching passwords and redirects to login after saving', () => {
  const source = readSource('modules/auth/forgot-password/page/Page.tsx')

  assert.match(source, /password !== confirmPassword/)
  assert.match(source, /As senhas devem ser iguais\./)
  assert.match(source, /navigate\(APP_ROUTES\.auth\.login\)/)
})
