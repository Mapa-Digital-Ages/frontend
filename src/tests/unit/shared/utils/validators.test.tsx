import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import {
  hasMinLength,
  isRequired,
  isValidEmail,
} from '@/shared/utils/validators'

test('isRequired rejects empty and whitespace-only values', () => {
  assert.equal(isRequired(''), false)
  assert.equal(isRequired('   '), false)
  assert.equal(isRequired(' Gustavo '), true)
})

test('hasMinLength validates the trimmed user input length', () => {
  assert.equal(hasMinLength(' 1234567 ', 8), false)
  assert.equal(hasMinLength(' 12345678 ', 8), true)
})

test('isValidEmail accepts normal emails and rejects malformed credentials', () => {
  assert.equal(isValidEmail('student@example.com'), true)
  assert.equal(isValidEmail('student@example'), false)
  assert.equal(isValidEmail('student.example.com'), false)
  assert.equal(isValidEmail('student @example.com'), false)
})
