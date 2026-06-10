import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('support page exists and uses the enterpriseSchool variant header', () => {
  const source = readSource('modules/school-company/support/page/Page.tsx')

  assert.match(source, /variant="enterpriseSchool"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /Escola \| Solicitação de Apoio/)
  assert.match(
    source,
    /Abra solicitações pedagógicas, socioemocionais e técnicas\./
  )
})

test('support page renders support type and priority dropdowns, description input, and submit button', () => {
  const source = readSource('modules/school-company/support/page/Page.tsx')

  assert.match(source, /AppDropdown/)
  assert.match(source, /data-testid="support-type-select"/)
  assert.match(source, /data-testid="priority-select"/)
  assert.match(source, /AppInput/)
  assert.match(source, /data-testid="description-input"/)
  assert.match(source, /AppButton/)
  assert.match(source, /data-testid="submit-button"/)
})

test('support page includes response deadline alert', () => {
  const source = readSource('modules/school-company/support/page/Page.tsx')

  assert.match(source, /data-testid="deadline-alert"/)
  assert.match(source, /Prazo médio de resposta: até 24h úteis\./)
  assert.match(source, /InfoOutlinedIcon/)
})

test('support page contains validation logic', () => {
  const source = readSource('modules/school-company/support/page/Page.tsx')

  assert.match(source, /isValid/)
  assert.match(source, /supportTypeTouched/)
  assert.match(source, /priorityTouched/)
  assert.match(source, /descriptionTouched/)
})

test('support page applies correct data-testid to all major components', () => {
  const source = readSource('modules/school-company/support/page/Page.tsx')

  assert.match(source, /data-testid="support-page"/)
  assert.match(source, /data-testid="support-type-select"/)
  assert.match(source, /data-testid="priority-select"/)
  assert.match(source, /data-testid="description-input"/)
  assert.match(source, /data-testid="submit-button"/)
  assert.match(source, /data-testid="deadline-alert"/)
})

test('support page uses theme-aware components', () => {
  const source = readSource('modules/school-company/support/page/Page.tsx')

  assert.match(source, /AppPageContainer/)
  assert.match(source, /AppCard/)
})
