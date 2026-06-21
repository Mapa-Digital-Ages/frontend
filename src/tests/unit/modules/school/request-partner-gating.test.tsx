import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('useSchoolIsPrivate fetches the school profile only for the escola role', () => {
  assert.ok(sourceExists('modules/school/shared/hooks/useSchoolIsPrivate.ts'))
  const source = readSource('modules/school/shared/hooks/useSchoolIsPrivate.ts')

  assert.match(source, /role === 'escola'/)
  assert.match(source, /\.get<{ is_private: boolean }>/)
  assert.match(source, /school\/\${encodeURIComponent\(schoolId\)}/)
})

test('PublicSchoolRoute redirects private schools to the dashboard', () => {
  assert.ok(sourceExists('modules/school/shared/guards/PublicSchoolRoute.tsx'))
  const source = readSource(
    'modules/school/shared/guards/PublicSchoolRoute.tsx'
  )

  assert.match(source, /useSchoolIsPrivate/)
  assert.match(source, /if \(isPrivate\)/)
  assert.match(source, /Navigate/)
  assert.match(source, /APP_ROUTES\.school\.dashboard/)
})

test('school route wraps request-partner with PublicSchoolRoute', () => {
  const source = readSource('modules/school/route.tsx')

  assert.match(source, /PublicSchoolRoute/)
  assert.match(source, /APP_ROUTES\.school\.requestPartner/)
})

test('dashboard layout hides request-partner for private schools', () => {
  const source = readSource('app/layout/DashboardLayout.tsx')

  assert.match(source, /useSchoolIsPrivate/)
  assert.match(source, /APP_ROUTES\.school\.requestPartner/)
  assert.match(source, /!isPrivateSchool/)
})
