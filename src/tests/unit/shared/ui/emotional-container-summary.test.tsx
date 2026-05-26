import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import { createAppTheme } from '@/app/theme/core/theme'
import ParentEmotionalSummary from '@/modules/parent/shared/components/ParentEmotionalSummary'
import type { WeeklyMoodEntry } from '@/shared/types/common'

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: async () => {},
  logout: () => {},
  status: 'authenticated',
  token: 'token-123',
  user: {
    email: 'responsavel@test.com',
    name: 'Responsável',
    role: 'responsavel',
  },
}

function renderWithProviders(element: React.ReactElement) {
  return renderToStaticMarkup(
    <ThemeProvider theme={createAppTheme('light')}>
      <AuthContext.Provider value={authValue}>{element}</AuthContext.Provider>
    </ThemeProvider>
  )
}

test('ParentEmotionalSummary file exists', () => {
  assert.ok(
    sourceExists('modules/parent/shared/components/ParentEmotionalSummary.tsx')
  )
})

test('ParentEmotionalSummary has carousel navigation', () => {
  const source = readSource(
    'modules/parent/shared/components/ParentEmotionalSummary.tsx'
  )

  assert.match(source, /ChevronLeft|ArrowBack|NavigateBefore/)
  assert.match(source, /ChevronRight|ArrowForward|NavigateNext/)
  assert.match(source, /weekIndex|currentWeek|slideIndex/)
})

test('ParentEmotionalSummary renders week badge and mood insights from well-being data', () => {
  const wellBeing: WeeklyMoodEntry[] = [
    { date: '2026-04-20', mood: 'good' },
    { date: '2026-04-21', mood: 'good' },
    { date: '2026-04-22', mood: 'bad' },
    { date: '2026-04-23', mood: 'good' },
  ]
  const html = renderWithProviders(
    <ParentEmotionalSummary wellBeing={wellBeing} />
  )

  assert.match(html, /Resumo Socioemocional/)
  assert.match(html, /20/)
  assert.match(html, /24 abr/)
  assert.match(html, /Humor positivo na maior parte da semana/)
  assert.match(html, /Queda de motivação detectada na Qua/)
})

test('ParentEmotionalSummary renders an empty-state message when there are no mood records', () => {
  const html = renderWithProviders(
    <ParentEmotionalSummary
      wellBeing={[
        { date: '2026-04-20', mood: null },
        { date: '2026-04-21', mood: null },
      ]}
    />
  )

  assert.match(html, /Sem registros de humor nessa semana/)
})

test('ParentEmotionalSummary colours insight phrases by mood', () => {
  const source = readSource(
    'modules/parent/shared/components/ParentEmotionalSummary.tsx'
  )

  assert.match(source, /moodPhraseStyle|phraseStyle/)
  assert.match(source, /rgba\(34,197,94/)
  assert.match(source, /rgba\(239,68,68/)
})
