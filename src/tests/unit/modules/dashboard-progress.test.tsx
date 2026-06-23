import { test } from '@jest/globals'
import { assert } from '@/tests/helpers/assert'
import { readSource } from '@/tests/helpers/source'

test('student dashboard loads real trail disciplines and limits cards to six', () => {
  const page = readSource('modules/student/dashboard/page/Page.tsx')
  const service = readSource('modules/student/dashboard/services/service.ts')

  assert.match(page, /getDisciplines\(\)/)
  assert.match(page, /setDisciplines\(items\)/)
  assert.match(page, /disciplines\.slice\(0, 6\)\.map/)
  assert.match(service, /`student\/\$\{studentId\}\/disciplines`/)
  assert.doesNotMatch(page, /progress=\{78\}/)
})

test('student header uses the weighted average of started trails as general progress', () => {
  const page = readSource('modules/student/dashboard/page/Page.tsx')

  assert.match(page, /const startedTrailCount = disciplines\.reduce/)
  assert.match(page, /item\.progress \* item\.startedTrailCount/)
  assert.match(page, /const overallProgress = startedTrailCount/)
  assert.match(page, /disciplines\.reduce/)
  assert.match(page, /progress=\{overallProgress\}/)
  assert.match(page, /Progresso geral das trilhas:/)
  assert.doesNotMatch(page, /progress=\{85\}/)
})

test('parent dashboard limits real discipline progress to five cards', () => {
  const page = readSource('modules/parent/dashboard/page/Page.tsx')
  const service = readSource('modules/parent/dashboard/services/service.ts')

  assert.match(page, /disciplines\.slice\(0, 5\)\.map/)
  assert.match(service, /`student\/\$\{studentId\}\/disciplines`/)
  assert.doesNotMatch(service, /MOCK_DISCIPLINES/)
})

test('school dashboard uses backend groups by year and has no teacher field', () => {
  const page = readSource('modules/school/dashboard/page/Page.tsx')
  const service = readSource('modules/school/dashboard/services/service.ts')
  const types = readSource('modules/school/dashboard/types/types.ts')

  assert.match(service, /school\/dashboard/)
  assert.match(page, /cls\.disciplines\.map/)
  assert.match(page, /cls\.studentCount/)
  assert.doesNotMatch(page, /Tutor|Professor|tutorName/)
  assert.doesNotMatch(types, /tutorName/)
})
