import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('EmotionalContainer supports summary mode with wellBeing prop', () => {
  const source = readSource('shared/ui/EmotionalContainer.tsx')

  assert.match(source, /mode.*checkin.*summary|mode.*summary.*checkin/)
  assert.match(source, /wellBeing/)
})

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

test('ParentEmotionalSummary shows week date badge', () => {
  const source = readSource(
    'modules/parent/shared/components/ParentEmotionalSummary.tsx'
  )

  assert.match(source, /Resumo Socioemocional/)
  assert.match(source, /format.*DD.*MMM|format.*D.*MMM/)
})

test('ParentEmotionalSummary handles null mood with HelpOutline icon', () => {
  const source = readSource(
    'modules/parent/shared/components/ParentEmotionalSummary.tsx'
  )

  assert.match(source, /NotInterested/)
})

test('ParentEmotionalSummary colours insight phrases by mood', () => {
  const source = readSource(
    'modules/parent/shared/components/ParentEmotionalSummary.tsx'
  )

  assert.match(source, /moodPhraseStyle|phraseStyle/)
  assert.match(source, /rgba\(34,197,94/)
  assert.match(source, /rgba\(239,68,68/)
})
