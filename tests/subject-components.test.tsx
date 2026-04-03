import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AppSubjectTag } from '../src/components/ui/AppSubjectsTags'
import OnboardingQuestionCard from '../src/components/ui/OnboardingQuestionCard'
import ProgressBar from '../src/components/ui/ProgressBar'
import {
  getNextOnboardingFlowState,
  getOnboardingFlowProgress,
  getPreviousOnboardingFlowState,
  STUDENT_ONBOARDING_FLOW_QUESTIONS,
} from '../src/pages/student/components/onboardingQuestionFlow'
import { getSubjectContext, getSubjectTheme } from '../src/utils/subjectThemes'
import { createAppTheme } from '../src/styles/theme'

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

test('OnboardingQuestionCard renders the onboarding copy and answer options', () => {
  const html = renderWithTheme(
    <OnboardingQuestionCard
      currentQuestion={1}
      options={[
        { id: 'option-1', label: '1' },
        { id: 'option-2', label: '4/8' },
        { id: 'option-3', label: '4/4' },
      ]}
      progress={6}
      question="Quanto é 3/4 + 1/4?"
      questionOrderLabel="1 / 8"
      subject={{ color: '#AD44F8', id: 'mathematics', label: 'Matemática' }}
      title="Questionário de Nivelamento"
      totalQuestions={16}
    />
  )

  assert.match(html, /Questionário de Nivelamento/)
  assert.match(html, /Quanto é 3\/4 \+ 1\/4\?/)
  assert.match(html, /Questão anterior/)
  assert.match(html, /Próxima questão/)
  assert.match(html, /1 \/ 16 questão\(ões\) - 6% concluído/)
})

test('OnboardingQuestionCard source exposes navigation icons and composition slots', () => {
  const onboardingQuestionCardSource = readFileSync(
    new URL('../src/components/ui/OnboardingQuestionCard.tsx', import.meta.url),
    'utf8'
  )

  assert.match(onboardingQuestionCardSource, /ArrowBackRoundedIcon/)
  assert.match(onboardingQuestionCardSource, /ArrowForwardRoundedIcon/)
  assert.match(onboardingQuestionCardSource, /subjectBadgeSlot/)
  assert.match(onboardingQuestionCardSource, /nextButtonProps/)
  assert.match(onboardingQuestionCardSource, /previousQuestionButtonProps/)
  assert.match(onboardingQuestionCardSource, /SubjectContext/)
})

test('student components area references the showcase and not the dashboard preview', () => {
  const studentComponentsPageSource = readFileSync(
    new URL('../src/pages/student/StudentComponentsPage.tsx', import.meta.url),
    'utf8'
  )
  const studentShowcaseSource = readFileSync(
    new URL(
      '../src/pages/student/components/StudentComponentsShowcase.tsx',
      import.meta.url
    ),
    'utf8'
  )
  const studentDashboardPageSource = readFileSync(
    new URL('../src/pages/student/StudentDashboardPage.tsx', import.meta.url),
    'utf8'
  )

  assert.match(studentComponentsPageSource, /StudentComponentsShowcase/)
  assert.match(studentComponentsPageSource, /size="sm"/)
  assert.match(studentComponentsPageSource, /size="lg"/)
  assert.match(studentShowcaseSource, /Abrir fluxo de onboarding/)
  assert.doesNotMatch(studentDashboardPageSource, /OnboardingQuestionCard/)
})

test('student onboarding flow page keeps local selection state for option clicks', () => {
  const onboardingFlowPageSource = readFileSync(
    new URL(
      '../src/pages/student/StudentOnboardingFlowPage.tsx',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(onboardingFlowPageSource, /useState/)
  assert.match(onboardingFlowPageSource, /onSelectOption/)
  assert.match(onboardingFlowPageSource, /setAnswersByQuestionId/)
  assert.match(onboardingFlowPageSource, /setCurrentQuestionIndex/)
})

test('onboarding flow unlocks next question and increases progress after selection', () => {
  const firstProgress = getOnboardingFlowProgress({
    answersByQuestionId: {},
    questions: STUDENT_ONBOARDING_FLOW_QUESTIONS,
  })

  assert.equal(firstProgress, 0)

  const firstState = getNextOnboardingFlowState({
    answersByQuestionId: {},
    currentQuestionIndex: 0,
    questions: STUDENT_ONBOARDING_FLOW_QUESTIONS,
  })

  assert.equal(firstState.canGoNext, false)
  assert.equal(firstState.progress, 0)

  const secondState = getNextOnboardingFlowState({
    answersByQuestionId: {
      [STUDENT_ONBOARDING_FLOW_QUESTIONS[0].id]:
        STUDENT_ONBOARDING_FLOW_QUESTIONS[0].options[1].id,
    },
    currentQuestionIndex: 0,
    questions: STUDENT_ONBOARDING_FLOW_QUESTIONS,
  })

  assert.equal(secondState.canGoNext, true)
  assert.equal(secondState.progress, 33)
  assert.equal(
    secondState.currentQuestion.id,
    STUDENT_ONBOARDING_FLOW_QUESTIONS[1].id
  )
})

test('onboarding flow can go back to the previous question', () => {
  const previousState = getPreviousOnboardingFlowState({
    answersByQuestionId: {
      [STUDENT_ONBOARDING_FLOW_QUESTIONS[0].id]:
        STUDENT_ONBOARDING_FLOW_QUESTIONS[0].options[1].id,
      [STUDENT_ONBOARDING_FLOW_QUESTIONS[1].id]:
        STUDENT_ONBOARDING_FLOW_QUESTIONS[1].options[1].id,
    },
    currentQuestionIndex: 2,
    questions: STUDENT_ONBOARDING_FLOW_QUESTIONS,
  })

  assert.equal(previousState.currentQuestionIndex, 1)
  assert.equal(
    previousState.currentQuestion.id,
    STUDENT_ONBOARDING_FLOW_QUESTIONS[1].id
  )
  assert.equal(previousState.progress, 67)
  assert.equal(
    previousState.answersByQuestionId[STUDENT_ONBOARDING_FLOW_QUESTIONS[1].id],
    STUDENT_ONBOARDING_FLOW_QUESTIONS[1].options[1].id
  )
})

test('student onboarding flow page keeps route hooks ready for backend hydration', () => {
  const onboardingFlowPageSource = readFileSync(
    new URL(
      '../src/pages/student/StudentOnboardingFlowPage.tsx',
      import.meta.url
    ),
    'utf8'
  )
  const studentRouteSource = readFileSync(
    new URL('../src/pages/student/route.tsx', import.meta.url),
    'utf8'
  )

  assert.match(onboardingFlowPageSource, /assessmentId\?:/)
  assert.match(onboardingFlowPageSource, /initialAnswersByQuestionId\?:/)
  assert.match(onboardingFlowPageSource, /questions\?:/)
  assert.match(onboardingFlowPageSource, /saveAnswer/)
  assert.match(studentRouteSource, /studentOnboardingFlowLoader/)
  assert.match(studentRouteSource, /studentOnboardingFlowAction/)
})
