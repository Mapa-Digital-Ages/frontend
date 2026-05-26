import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import {
  formatDate,
  formatEngagement,
  formatRole,
} from '@/shared/utils/formatters'

test('formatRole returns user-facing labels for every application role', () => {
  assert.equal(formatRole('aluno'), 'Aluno')
  assert.equal(formatRole('responsavel'), 'Responsável')
  assert.equal(formatRole('admin'), 'Administrador')
  assert.equal(formatRole('empresa'), 'Empresa')
  assert.equal(formatRole('escola'), 'Escola')
  assert.equal(formatRole('escola_empresa'), 'Escola & Empresa')
})

test('formatDate preserves calendar-only backend dates in pt-BR format', () => {
  assert.equal(formatDate('2026-04-07'), '07/04/2026')
  assert.equal(formatDate('2026-12-31'), '31/12/2026')
})

test('formatEngagement formats numeric engagement percentages without rounding', () => {
  assert.equal(formatEngagement(0), '0%')
  assert.equal(formatEngagement(87.5), '87.5%')
})
