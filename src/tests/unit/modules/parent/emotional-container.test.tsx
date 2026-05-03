import { assert } from '@/tests/helpers/assert'
import { expect, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import { readSource } from '@/tests/helpers/source'
import EmotionalContainer from '@/shared/ui/EmotionalContainer'
import { renderWithProviders } from '@/tests/helpers/render'

test('EmotionalContainer uses theme tokens and no empty JSX expressions', () => {
  const source = readSource('shared/ui/EmotionalContainer.tsx')

  assert.match(source, /alpha/)
  assert.doesNotMatch(source, /\{\}/)
  assert.doesNotMatch(source, /backgroundColor: 'white'/)
  assert.doesNotMatch(source, /color: 'black'/)
})

test('EmotionalContainer renders the parent check-in controls and weekly summary shell', () => {
  renderWithProviders(<EmotionalContainer />)

  expect(screen.getByText(/Check-in emocional/i)).toBeInTheDocument()
  expect(screen.getByTestId('card-checkin-emocional')).toBeInTheDocument()
  expect(screen.getByTestId('emotion-button-good')).toBeInTheDocument()
  expect(screen.getByTestId('emotion-button-regular')).toBeInTheDocument()
  expect(screen.getByTestId('emotion-button-bad')).toBeInTheDocument()
  expect(screen.getByText(/Humor da Semana/i)).toBeInTheDocument()
})
