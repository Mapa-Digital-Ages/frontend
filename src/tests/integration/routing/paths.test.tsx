import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import {
  APP_ROUTES,
  buildAdminCorrectionRoute,
  buildParentStudentDetailsRoute,
  DEFAULT_ROUTE_BY_ROLE,
} from '../../../app/router/paths'

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

test('route builders encode dynamic path segments safely', () => {
  assert.equal(
    buildAdminCorrectionRoute('content/2026 março'),
    '/admin/corrections/content%2F2026%20mar%C3%A7o'
  )
  assert.equal(
    buildParentStudentDetailsRoute('student/7 ano'),
    '/parent/students/student%2F7%20ano'
  )
})
