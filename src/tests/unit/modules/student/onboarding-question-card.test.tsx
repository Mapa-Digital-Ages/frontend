import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createAppTheme } from '../../../../app/theme/core/theme'
import OnboardingQuestionCard from '../../../../modules/student/shared/components/OnboardingQuestionCard'
import { SUBJECTS } from '../../../../shared/utils/themes'

function renderWithTheme(element: React.ReactElement) {
  return renderToStaticMarkup(
    <ThemeProvider theme={createAppTheme('light')}>{element}</ThemeProvider>
  )
}

test('OnboardingQuestionCard renders from a questions mock without controlled flow props', () => {
  const html = renderWithTheme(
    <OnboardingQuestionCard
      questions={[
        {
          id: 'question-1',
          options: [
            { id: 'option-1', label: '1' },
            { id: 'option-2', label: '4/8' },
            { id: 'option-3', label: '4/4' },
          ],
          question: 'Quanto é 3/4 + 1/4?',
          subject: SUBJECTS.matematica,
        },
      ]}
    />
  )

  assert.match(html, /Questionário de Nivelamento/)
  assert.match(html, /Quanto é 3\/4 \+ 1\/4\?/)
  assert.match(html, /Questão 1 \/ 1/)
  assert.match(html, /4\/4/)
})

test('OnboardingQuestionCard uses AppCard as the reusable card shell', () => {
  const source = readSource(
    'modules/student/shared/components/OnboardingQuestionCard.tsx'
  )

  assert.match(source, /AppCard/)
  assert.doesNotMatch(source, /<Card/)
  assert.doesNotMatch(source, /<CardContent/)
})
