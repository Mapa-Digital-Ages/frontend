import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('AccountSettings exposes account editing and danger-zone actions', () => {
  const source = readSource(
    'modules/parent/settings/components/AccountSettings.tsx'
  )

  assert.match(source, /initialValues/)
  assert.match(source, /onSave/)
  assert.match(source, /onDisableAccount/)
  assert.match(source, /onDeleteAccount/)
  assert.match(source, /Dados da conta/)
  assert.match(source, /Desabilitar conta/)
  assert.match(source, /Excluir conta/)
  assert.match(source, /AppActionModal/)
})

test('parent settings page renders AccountSettings with parent service callbacks', () => {
  const source = readSource('modules/parent/settings/page/Page.tsx')

  assert.match(source, /AccountSettings/)
  assert.match(source, /ChildSettingsModal/)
  assert.match(source, /parentService\.getAccountSettings/)
  assert.match(source, /parentService\.updateAccountSettings/)
  assert.match(source, /parentService\.disableAccount/)
  assert.match(source, /parentService\.deleteAccount/)
  assert.match(source, /createChild/)
  assert.match(source, /updateChild/)
  assert.match(source, /deleteChild/)
})

test('parent settings service centralizes account endpoints', () => {
  const source = readSource('modules/parent/settings/services/service.ts')

  assert.match(source, /ParentAccountSettings/)
  assert.match(source, /getAccountSettings/)
  assert.match(source, /updateAccountSettings/)
  assert.match(source, /disableAccount/)
  assert.match(source, /deleteAccount/)
  assert.match(source, /createChild/)
  assert.match(source, /updateChild/)
  assert.match(source, /deleteChild/)
})
