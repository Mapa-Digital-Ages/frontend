import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('adopted schools page exists and uses the company variant header', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /variant="company"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /title="Escolas Apoiadas"/)
  assert.match(
    source,
    /subtitle="Gerencie as escolas apoiadas pela sua empresa"/
  )
})

test('adopted schools page uses SearchBarAndFilter for search and filtering', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /SearchBarAndFilter/)
  assert.match(source, /onQueryChange/)
  assert.match(source, /onStatusChange/)
  assert.match(source, /filterOptions/)
  assert.match(source, /Pesquisar empresas/)
})

test('adopted schools page applies data-testid to all major components', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /data-testid="adopted-schools-page"/)
  assert.match(source, /data-testid="adopted-schools-search"/)
  assert.match(source, /data-testid="adopted-schools-list"/)
  assert.match(source, /data-testid="adopted-schools-content"/)
  assert.match(source, /data-testid={`school-card-\${school\.id}`}/)
  assert.match(source, /data-testid={`school-card-menu-\${school\.id}`}/)
  assert.match(source, /data-testid="school-details-panel"/)
  assert.match(source, /data-testid="school-details-table"/)
  assert.match(source, /data-testid={`school-details-grade-\${grade\.year}`}/)
  assert.match(source, /data-testid="remove-school-action"/)
  assert.match(source, /data-testid="view-grade-trails-action"/)
})

test('adopted schools page renders school cards with school and students info', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /school\.schoolName/)
  assert.match(source, /school\.students/)
  assert.match(source, /school\.state/)
  assert.match(source, /filteredSchools\.map/)
})

test('adopted schools page renders school details panel with grades table', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /Dados da Escola/)
  assert.match(source, /selectedSchool\.grades\.map/)
  assert.match(source, /grade\.year/)
  assert.match(source, /grade\.trails/)
  assert.match(source, /grade\.subject/)
  assert.match(source, /TableHead/)
  assert.match(source, /TableBody/)
})

test('adopted schools service exposes getTitle, getSubtitle and getSchools', () => {
  const source = readSource(
    'modules/company/adopted-schools/services/service.ts'
  )

  assert.match(source, /getTitle/)
  assert.match(source, /getSubtitle/)
  assert.match(source, /getSchools/)
  assert.match(source, /removeSchool/)
  assert.match(source, /AdoptedSchool/)
})

test('adopted schools types define AdoptedSchool and AdoptedSchoolGrade', () => {
  assert.ok(sourceExists('modules/company/adopted-schools/types/types.ts'))
  const source = readSource('modules/company/adopted-schools/types/types.ts')

  assert.match(source, /AdoptedSchool/)
  assert.match(source, /AdoptedSchoolGrade/)
  assert.match(source, /schoolName/)
  assert.match(source, /coordinator/)
  assert.match(source, /students/)
  assert.match(source, /grades/)
})

test('adopted schools route points to AdoptedSchoolsPage', () => {
  const source = readSource('modules/company/route.tsx')

  assert.match(source, /AdoptedSchoolsPage/)
  assert.match(source, /adopted-schools\/page\/Page/)
  assert.match(source, /company\.adoptedSchools/)
})

test('adopted schools page uses theme-aware styling', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /useTheme/)
  assert.match(source, /theme\.palette/)
  assert.match(source, /theme\.palette\.role\.empresa/)
  assert.doesNotMatch(source, /text-slate-900/)
  assert.doesNotMatch(source, /bg-slate/)
})

test('adopted schools page uses AppCard and AppPageContainer', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /AppCard/)
  assert.match(source, /AppPageContainer/)
})

test('adopted schools page follows the same loading pattern as dashboard', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /useState\(true\)/)
  assert.match(source, /isLoading/)
  assert.match(source, /LoadingScreen/)
  assert.match(source, /useEffect/)
  assert.match(source, /let isActive = true/)
  assert.match(source, /isActive = false/)
})

test('adopted schools service contains mock data for schools', () => {
  const source = readSource(
    'modules/company/adopted-schools/services/service.ts'
  )

  assert.match(source, /Escola São Paulo/)
  assert.match(source, /Escola Horizonte/)
  assert.match(source, /Ana Lima/)
  assert.match(source, /Carla Souza/)
})

test('adopted schools page supports selecting a school card', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /selectedSchoolId/)
  assert.match(source, /setSelectedSchoolId/)
  assert.match(source, /onClick/)
})

test('adopted schools page supports school and grade actions', () => {
  const source = readSource('modules/company/adopted-schools/page/Page.tsx')

  assert.match(source, /Menu/)
  assert.match(source, /MenuItem/)
  assert.match(source, /setMenuAnchorEl/)
  assert.match(source, /setMenuSchoolId/)
  assert.match(source, /handleRemoveSchool/)
  assert.match(source, /adoptedSchoolsService\.removeSchool/)
  assert.match(source, /AppActionModal/)
  assert.match(source, /setGradeMenuAnchorEl/)
  assert.match(source, /setGradeMenuKey/)
  assert.match(source, /Ver trilhas/)
})
