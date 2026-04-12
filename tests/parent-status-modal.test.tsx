import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getParentStatusModalCopy,
  shouldOpenParentStatusModal,
} from '../src/pages/parent/components/parentStatusModal.utils'

test('parent status modal opens only for actionable registration states', () => {
  assert.equal(shouldOpenParentStatusModal('AGUARDANDO'), true)
  assert.equal(shouldOpenParentStatusModal('NEGADO'), true)
  assert.equal(shouldOpenParentStatusModal('APROVADO'), false)
  assert.equal(shouldOpenParentStatusModal(''), false)
  assert.equal(shouldOpenParentStatusModal('UNKNOWN'), false)
})

test('parent status modal copy handles only known non-approved statuses', () => {
  assert.equal(
    getParentStatusModalCopy('AGUARDANDO')?.title,
    'Cadastro em Análise'
  )
  assert.equal(getParentStatusModalCopy('NEGADO')?.title, 'Acesso Negado')
  assert.equal(getParentStatusModalCopy('APROVADO'), null)
  assert.equal(getParentStatusModalCopy('UNKNOWN'), null)
})
