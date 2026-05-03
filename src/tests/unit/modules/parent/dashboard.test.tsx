import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('parent dashboard uses useParentDashboard hook', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')

  assert.match(source, /useParentDashboard/)
  assert.match(source, /ParentEmotionalSummary/)
  assert.match(source, /Planner/)
  assert.match(source, /EmptyState/)
  assert.match(source, /Nenhum aluno vinculado/)
  assert.match(source, /MetricsCard/)
  assert.match(source, /ProgressBar/)
  assert.match(source, /valueLabelVariant="subject"/)
  assert.doesNotMatch(source, /DISCIPLINE_PROGRESS/)
  assert.doesNotMatch(source, /useState.*tasks/)
})

test('parent dashboard has child selector in PageHeader actions', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')

  assert.match(source, /actions=/)
  assert.match(source, /selectChild/)
  assert.match(source, /ChildSwitcher/)
  assert.match(source, /children=\{children\}/)
})

test('parent dashboard delegates child registration to ChildRegistrationModal', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')
  const serviceSource = readSource(
    'modules/parent/dashboard/services/service.ts'
  )

  assert.match(source, /ChildRegistrationModal/)
  assert.match(source, /registerChild/)
  assert.match(source, /setModalOpen\(true\)/)
  assert.match(source, /first_name/)
  assert.match(source, /last_name/)
  assert.match(source, /birth_date/)
  assert.match(source, /student_class/)
  assert.match(serviceSource, /post<RegisterStudentApiResponse>\(\s*'student'/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/summary`/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/disciplines`/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/tasks`/)
  assert.doesNotMatch(serviceSource, /register\/student/)
  assert.doesNotMatch(serviceSource, /parent\/student/)
  assert.doesNotMatch(source, /ApprovalActionModal/)
})

test('parent settings uses real student endpoints and no local mock fallback', () => {
  const serviceSource = readSource(
    'modules/parent/settings/services/service.ts'
  )
  const hookSource = readSource(
    'modules/parent/settings/hooks/useParentSettings.ts'
  )

  assert.match(serviceSource, /post<RegisterStudentApiResponse>\(\s*'student'/)
  assert.match(serviceSource, /put<StudentApiResponse>\(/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/summary`/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/disciplines`/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/tasks`/)
  assert.doesNotMatch(serviceSource, /patch<StudentApiResponse>\(/)
  assert.doesNotMatch(serviceSource, /register\/student/)
  assert.doesNotMatch(serviceSource, /parent\/student/)
  assert.doesNotMatch(hookSource, /mockState/)
  assert.doesNotMatch(hookSource, /localChildFrom/)
})

test('ChildRegistrationModal handles feedback and uses system components', () => {
  const source = readSource(
    'modules/parent/shared/components/ChildRegistrationModal.tsx'
  )

  assert.match(source, /AppActionModal/)
  assert.match(source, /AppInput/)
  assert.match(source, /AppDropdown/)
  assert.match(source, /aprovação/)
  assert.match(source, /RegisterChildRequest/)
  assert.match(source, /CLASS_OPTIONS/)
})
