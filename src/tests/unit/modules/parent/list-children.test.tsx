import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('ListChildren renders selectable child cards with parent theme context', () => {
  const source = readSource(
    'modules/parent/settings/components/ListChildren.tsx'
  )

  assert.match(source, /ListChildrenCard/)
  assert.match(source, /selectedChildId/)
  assert.match(source, /onSelect/)
  assert.match(source, /onCreate/)
  assert.match(source, /onEdit/)
  assert.match(source, /onDelete/)
  assert.match(source, /role="list"/)
  assert.match(source, /SearchBarAndFilter/)
  assert.doesNotMatch(source, /filterOptions=/)
  assert.match(source, /children\.map\(child =>/)
})

test('ListChildrenCard uses planner-like rows with initials and selected state', () => {
  const source = readSource(
    'modules/parent/settings/components/ListChildrenCard.tsx'
  )

  assert.match(source, /role="listitem"/)
  assert.match(source, /role="button"/)
  assert.match(source, /aria-pressed/)
  assert.match(source, /getInitials/)
  assert.match(source, /child\.grade/)
  assert.match(source, /handleMenuOpen/)
  assert.match(source, /Editar/)
  assert.match(source, /Excluir/)
  assert.match(source, /getRoleSelectedStyle/)
})

test('ChildSettingsModal handles create, edit and delete child actions', () => {
  const source = readSource(
    'modules/parent/settings/components/ChildSettingsModal.tsx'
  )

  assert.match(source, /ChildSettingsModalMode/)
  assert.match(source, /Cadastrar filho/)
  assert.match(source, /Editar filho/)
  assert.match(source, /Excluir filho/)
  assert.match(source, /AppActionModal/)
})
