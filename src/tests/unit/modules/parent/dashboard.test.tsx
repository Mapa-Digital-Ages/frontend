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

test('parent dashboard keeps child selection read-only', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')
  const serviceSource = readSource(
    'modules/parent/dashboard/services/service.ts'
  )

  assert.match(source, /ChildSwitcher/)
  assert.doesNotMatch(source, /ChildRegistrationModal/)
  assert.doesNotMatch(source, /registerChild/)
  assert.match(serviceSource, /post<RegisterStudentApiResponse>\(\s*'student'/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/summary`/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/disciplines`/)
  assert.match(serviceSource, /`student\/\$\{studentId\}\/calendar`/)
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

test('ChildSettingsModal handles feedback and uses system components', () => {
  const source = readSource(
    'modules/parent/settings/components/ChildSettingsModal.tsx'
  )

  assert.match(source, /AppActionModal/)
  assert.match(source, /AppInput/)
  assert.match(source, /AppDropdown/)
  assert.match(source, /feedbackMessage/)
  assert.match(source, /ChildSettingsForm/)
  assert.match(source, /CLASS_OPTIONS/)
})
