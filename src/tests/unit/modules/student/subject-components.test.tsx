import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createAppTheme } from '../../../../app/theme/core/theme'
import OnboardingQuestionCard from '../../../../modules/student/shared/components/OnboardingQuestionCard'
import { AppSubjectTag } from '../../../../shared/ui/AppSubjectsTags'
import ProgressBar from '../../../../shared/ui/ProgressBar'
import {
  getSubjectContext,
  getSubjectTheme,
  SUBJECTS,
} from '../../../../shared/utils/themes'

function renderWithTheme(element: React.ReactElement) {
  return renderToStaticMarkup(
    <ThemeProvider theme={createAppTheme('light')}>{element}</ThemeProvider>
  )
}

test('getSubjectContext prioritizes route data and falls back safely', () => {
  const fallback = { color: '#AD44F8', id: 'mathematics', label: 'Matemática' }
  const fromRoute = getSubjectContext(
    { color: '#0571F7', id: 'portuguese', label: 'Português' },
    fallback
  )
  const fromFallback = getSubjectContext(undefined, fallback)

  assert.equal(fromRoute.id, 'portuguese')
  assert.equal(fromRoute.label, 'Português')
  assert.equal(fromRoute.color, '#0571F7')
  assert.equal(fromFallback.id, 'mathematics')
})

test('getSubjectTheme derives semantic slots from fallback and external base colors', () => {
  const mathematics = getSubjectTheme(
    { id: 'mathematics', label: 'Matemática' },
    { mode: 'light' }
  )
  const custom = getSubjectTheme(
    { color: '#22C55E', id: 'mathematics', label: 'Matemática' },
    { mode: 'light' }
  )
  const fallback = getSubjectTheme(
    { label: 'Disciplina não mapeada' },
    { mode: 'light' }
  )

  assert.equal(mathematics.id, 'mathematics')
  assert.equal(custom.color, '#22C55E')
  assert.notEqual(mathematics.color, fallback.color)
  assert.ok(mathematics.badge.backgroundColor)
  assert.ok(mathematics.softSurface.backgroundColor)
  assert.ok(fallback.border.color)
})

test('getSubjectTheme treats unknown disciplines as custom themes and derives readable contrast', () => {
  const custom = getSubjectTheme(
    { color: '#FDE68A', id: 'philosophy', label: 'Filosofia' } as never,
    { mode: 'light' }
  )

  assert.equal(custom.id, 'custom')
  assert.equal(custom.label, 'Filosofia')
  assert.equal(custom.color, '#FDE68A')
  assert.notEqual(custom.solidSurface.color, 'rgba(255, 255, 255, 1)')
})

test('ProgressBar renders the current percentage label', () => {
  const html = renderWithTheme(
    <ProgressBar
      subject={{ color: '#FFBA00', id: 'history', label: 'História' }}
      value={90}
    />
  )

  assert.match(html, /90%/)
})

test('AppSubjectTag renders the discipline label', () => {
  const html = renderWithTheme(
    <AppSubjectTag
      subject={{ color: '#AD44F8', id: 'mathematics', label: 'Matemática' }}
    />
  )

  assert.match(html, /Matemática/)
})

test('OnboardingQuestionCard renders the onboarding copy and answer options from question mocks', () => {
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
  assert.match(html, /Questão anterior/)
  assert.match(html, /Concluir/)
  assert.match(html, /1 \/ 1 questão\(ões\) - 0% concluído/)
})

test('student components page renders the onboarding and chart mocks directly', () => {
  const studentComponentsPageSource = readSource(
    'modules/student/components/page/Page.tsx'
  )
  const studentDashboardPageSource = readSource(
    'modules/student/dashboard/page/Page.tsx'
  )

  assert.match(
    studentComponentsPageSource,
    /<OnboardingQuestionCard questions=/
  )
  assert.match(studentComponentsPageSource, /<BarChart data=\{mockChartData\}/)
  assert.doesNotMatch(studentDashboardPageSource, /OnboardingQuestionCard/)
})

test('SubjectBaseCard uses AppCard as the reusable card shell', () => {
  const source = readSource(
    'modules/student/shared/components/SubjectBaseCard.tsx'
  )

  assert.match(source, /AppCard/)
  assert.doesNotMatch(source, /<Card/)
  assert.doesNotMatch(source, /<CardContent/)
})
