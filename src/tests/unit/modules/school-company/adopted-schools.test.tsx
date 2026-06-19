import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('sc adopted schools page exists and uses the enterpriseSchool variant header', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )
  const serviceSource = readSource(
    'modules/school-company/adopted-schools/services/service.ts'
  )

  assert.match(source, /variant="enterpriseSchool"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /adoptedSchoolsService\.getTitle\(\)/)
  assert.match(source, /adoptedSchoolsService\.getSubtitle\(\)/)
  assert.match(
    serviceSource,
    /modules\/company\/adopted-schools\/services\/service/
  )
})

test('sc adopted schools page uses SearchBarAndFilter for search and filtering', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /SearchBarAndFilter/)
  assert.match(source, /onQueryChange/)
  assert.match(source, /onStatusChange/)
  assert.match(source, /filterOptions/)
  assert.match(source, /Pesquisar empresas/)
})

test('sc adopted schools page applies data-testid to all major components', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /data-testid="sc-adopted-schools-page"/)
  assert.match(source, /data-testid="sc-adopted-schools-search"/)
  assert.match(source, /data-testid="sc-adopted-schools-list"/)
  assert.match(source, /data-testid="sc-adopted-schools-content"/)
  assert.match(source, /data-testid={`sc-school-card-\${school\.id}`}/)
  assert.match(source, /data-testid={`sc-school-card-menu-\${school\.id}`}/)
  assert.match(source, /data-testid="sc-school-details-panel"/)
  assert.match(source, /data-testid="sc-school-details-spots"/)
  assert.match(source, /data-testid="sc-remove-school-action"/)
})

test('sc adopted schools page renders school cards with school and vagas info', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /school\.schoolName/)
  assert.match(source, /school\.grantedSpots/)
  assert.match(source, /school\.state/)
  assert.match(source, /filteredSchools\.map/)
})

test('sc adopted schools page renders school details panel with granted spots', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /Dados da Escola/)
  assert.match(source, /Vagas apoiadas/)
  assert.match(source, /selectedSchool\.grantedSpots/)
  assert.doesNotMatch(source, /selectedSchool\.grades/)
  assert.doesNotMatch(source, /supportedStudents/)
})

test('sc adopted schools service exposes getTitle, getSubtitle and getSchools', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/services/service.ts'
  )
  const companySource = readSource(
    'modules/company/adopted-schools/services/service.ts'
  )

  assert.match(source, /adoptedSchoolsService/)
  assert.match(companySource, /getTitle/)
  assert.match(companySource, /getSubtitle/)
  assert.match(companySource, /getSchools/)
  assert.match(companySource, /removeSchool/)
  assert.match(companySource, /AdoptedSchool/)
})

test('sc adopted schools types define AdoptedSchool with granted spots', () => {
  assert.ok(
    sourceExists('modules/school-company/adopted-schools/types/types.ts')
  )
  const source = readSource(
    'modules/school-company/adopted-schools/types/types.ts'
  )

  assert.match(source, /AdoptedSchool/)
  assert.match(source, /schoolName/)
  assert.match(source, /coordinator/)
  assert.match(source, /grantedSpots/)
  assert.doesNotMatch(source, /progress/)
  assert.doesNotMatch(source, /AdoptedSchoolGrade/)
  assert.doesNotMatch(source, /supportedStudents/)
})

test('sc adopted schools route points to SchoolCompanyAdoptedSchoolsPage', () => {
  const source = readSource('modules/school-company/route.tsx')

  assert.match(source, /SchoolCompanyAdoptedSchoolsPage/)
  assert.match(source, /adopted-schools\/page\/Page/)
  assert.match(source, /schoolCompany\.adoptedSchools/)
})

test('sc adopted schools page uses theme-aware styling with escola_empresa role', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /useTheme/)
  assert.match(source, /theme\.palette/)
  assert.match(source, /const role = 'escola_empresa' as const/)
  assert.match(source, /getRolePalette\(theme, role\)/)
  assert.doesNotMatch(source, /theme\.palette\.role\.empresa\./)
  assert.doesNotMatch(source, /text-slate-900/)
  assert.doesNotMatch(source, /bg-slate/)
})

test('sc adopted schools page uses AppCard and AppPageContainer', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /AppCard/)
  assert.match(source, /AppPageContainer/)
})

test('sc adopted schools page follows the same loading pattern as dashboard', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /useState\(true\)/)
  assert.match(source, /isLoading/)
  assert.match(source, /LoadingScreen/)
  assert.match(source, /useEffect/)
  assert.match(source, /let isActive = true/)
  assert.match(source, /isActive = false/)
})

test('sc adopted schools service reuses the real company adopted schools integration', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/services/service.ts'
  )
  const companySource = readSource(
    'modules/company/adopted-schools/services/service.ts'
  )

  assert.match(source, /modules\/company\/adopted-schools\/services\/service/)
  assert.match(companySource, /partnership_status: 'approved'/)
  assert.doesNotMatch(companySource, /StudentListApi/)
  assert.doesNotMatch(companySource, /supported_student_ids/)
  assert.match(companySource, /httpClient\.delete/)
})

test('sc adopted schools page supports selecting a school card', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /selectedSchoolId/)
  assert.match(source, /setSelectedSchoolId/)
  assert.match(source, /onClick/)
})

test('sc adopted schools page supports school actions', () => {
  const source = readSource(
    'modules/school-company/adopted-schools/page/Page.tsx'
  )

  assert.match(source, /Menu/)
  assert.match(source, /MenuItem/)
  assert.match(source, /setMenuAnchorEl/)
  assert.match(source, /setMenuSchoolId/)
  assert.match(source, /handleRemoveSchool/)
  assert.match(source, /adoptedSchoolsService\.removeSchool/)
  assert.match(source, /AppActionModal/)
  assert.doesNotMatch(source, /setGradeMenuAnchorEl/)
  assert.doesNotMatch(source, /Ver trilhas/)
})
