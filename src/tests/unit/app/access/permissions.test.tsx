import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { accessService } from '@/app/access/core/service'
import { hasRequiredRole } from '@/app/access/core/permissions'

test('hasRequiredRole denies unauthenticated users before checking allowed roles', () => {
  assert.equal(hasRequiredRole(undefined, ['admin']), false)
})

test('hasRequiredRole allows only roles explicitly listed for a route', () => {
  assert.equal(hasRequiredRole('admin', ['admin']), true)
  assert.equal(hasRequiredRole('responsavel', ['admin']), false)
  assert.equal(hasRequiredRole('escola_empresa', ['escola', 'empresa']), false)
})

test('accessService delegates role decisions to the shared permission rule', () => {
  assert.equal(accessService.userHasRole('aluno', ['aluno']), true)
  assert.equal(accessService.userHasRole('aluno', ['responsavel']), false)
})
