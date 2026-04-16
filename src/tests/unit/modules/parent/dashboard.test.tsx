import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('parent dashboard exposes only the child registration entry point', () => {
  const source = readSource('modules/parent/dashboard/page/Page.tsx')

  assert.match(source, /PageHeader/)
  assert.match(source, /AppActionModal/)
  assert.match(source, /Cadastrar filho/)
  assert.match(source, /Nome do filho/)
  assert.match(source, /parentChildModalOpen/)
  assert.doesNotMatch(source, /role="responsavel"/)
  assert.doesNotMatch(source, /parentService\.getSummary/)
  assert.doesNotMatch(source, /parentService\.getChildren/)
  assert.doesNotMatch(source, /DISCIPLINE_PERFORMANCE/)
  assert.doesNotMatch(source, /WEEKLY_MOOD/)
})
