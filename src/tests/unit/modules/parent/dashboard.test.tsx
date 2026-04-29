import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('parent dashboard uses useParentDashboard hook', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')

  assert.match(source, /useParentDashboard/)
  assert.match(source, /EmotionalContainer/)
  assert.match(source, /mode="summary"/)
  assert.match(source, /Planner/)
  assert.match(source, /EmptyState/)
  assert.match(source, /Nenhum aluno vinculado/)
  assert.match(source, /MetricsCard/)
  assert.match(source, /ProgressBar/)
  assert.match(source, /valueLabelVariant="subject"/)
  assert.doesNotMatch(source, /DISCIPLINE_PROGRESS/)
  assert.doesNotMatch(source, /useState.*tasks/)
})

test('parent dashboard has child selector slot in PageHeader', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')

  assert.match(source, /childSelectorSlot/)
  assert.match(source, /selectChild/)
  assert.match(source, /children\.map|allChildren/)
})

test('parent dashboard has full child registration modal', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')

  assert.match(source, /first_name/)
  assert.match(source, /last_name/)
  assert.match(source, /birth_date/)
  assert.match(source, /student_class/)
  assert.match(source, /registerChild/)
  assert.match(source, /Aguardando aprovação|aprovação/)
})
