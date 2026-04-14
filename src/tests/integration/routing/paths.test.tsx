import assert from 'node:assert/strict'
import test from 'node:test'
import { APP_ROUTES, DEFAULT_ROUTE_BY_ROLE } from '../../../app/router/paths'

test('APP_ROUTES exposes auth, student, parent, admin, school and company paths', () => {
  assert.equal(typeof APP_ROUTES.auth.login, 'string')
  assert.equal(typeof APP_ROUTES.auth.forgotPassword, 'string')
  assert.equal(typeof APP_ROUTES.student.adaptiveTrail, 'string')
  assert.equal(typeof APP_ROUTES.student.contents, 'string')
  assert.equal(typeof APP_ROUTES.student.components, 'string')
  assert.equal(typeof APP_ROUTES.parent.dashboard, 'string')
  assert.equal(typeof APP_ROUTES.school.dashboard, 'string')
  assert.equal(typeof APP_ROUTES.company.dashboard, 'string')
  assert.equal(typeof APP_ROUTES.schoolCompany.dashboard, 'string')
})

test('DEFAULT_ROUTE_BY_ROLE maps every UserRole to a string route', () => {
  const roles = [
    'aluno',
    'responsavel',
    'admin',
    'empresa',
    'escola',
    'escola_empresa',
  ] as const
  for (const role of roles) {
    assert.equal(typeof DEFAULT_ROUTE_BY_ROLE[role], 'string')
    assert.ok((DEFAULT_ROUTE_BY_ROLE[role] as string).startsWith('/'))
  }
})
