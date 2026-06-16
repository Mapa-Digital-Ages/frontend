import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('sc dashboard page exists and uses the enterpriseSchool variant header', () => {
  const source = readSource('modules/school-company/dashboard/page/Page.tsx')
  const serviceSource = readSource(
    'modules/school-company/dashboard/services/service.ts'
  )

  assert.match(source, /variant="enterpriseSchool"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /dashboardService\.getTitle\(\)/)
  assert.match(source, /dashboardService\.getSubtitle\(\)/)
  assert.match(serviceSource, /Escola \| Visão Geral/)
  assert.match(
    serviceSource,
    /Indicadores pedagógicos e operacionais do ambiente escolar\./
  )
})

test('sc dashboard page uses MetricsCard for indicators', () => {
  const source = readSource('modules/school-company/dashboard/page/Page.tsx')

  assert.match(source, /MetricsCard/)
  assert.match(source, /indicators\.map/)
  assert.match(source, /indicator\.title/)
  assert.match(source, /indicator\.value/)
  assert.match(source, /indicator\.icon/)
  assert.match(source, /indicator\.iconVariant/)
})

test('sc dashboard page applies data-testid to all major components', () => {
  const source = readSource('modules/school-company/dashboard/page/Page.tsx')

  assert.match(source, /data-testid="sc-dashboard-page"/)
  assert.match(source, /data-testid="sc-dashboard-indicators"/)
  assert.match(source, /data-testid={`sc-indicator-card-\${index}`}/)
  assert.match(source, /data-testid="sc-dashboard-classes"/)
  assert.match(source, /data-testid={`sc-class-card-\${classItem\.id}`}/)
  assert.match(source, /data-testid={`sc-class-progress-\${classItem\.id}`}/)
})

test('sc dashboard service exposes getTitle, getSubtitle, getIndicators and getClasses', () => {
  const source = readSource(
    'modules/school-company/dashboard/services/service.ts'
  )

  assert.match(source, /getTitle/)
  assert.match(source, /getSubtitle/)
  assert.match(source, /getIndicators/)
  assert.match(source, /getClasses/)
  assert.match(source, /dashboardService/)
})

test('sc dashboard service contains mock data matching the design', () => {
  const source = readSource(
    'modules/school-company/dashboard/services/service.ts'
  )

  assert.match(source, /125/)
  assert.match(source, /Total de Alunos/)
  assert.match(source, /Turmas Ativas/)
  assert.match(source, /Média Geral/)
  assert.match(source, /Relatórios Gerados/)
  assert.match(source, /7\.5/)
  assert.match(source, /Prof\. Ana/)
  assert.match(source, /Prof\. Diego/)
  assert.match(source, /Profa\. Carla/)
  assert.match(source, /Prof\. João/)
})

test('sc dashboard types define DashboardIndicator and ClassCard', () => {
  assert.ok(sourceExists('modules/school-company/dashboard/types/types.ts'))
  const source = readSource('modules/school-company/dashboard/types/types.ts')

  assert.match(source, /DashboardIndicator/)
  assert.match(source, /ClassCard/)
  assert.match(source, /title/)
  assert.match(source, /value/)
  assert.match(source, /students/)
  assert.match(source, /tutor/)
  assert.match(source, /progress/)
  assert.match(source, /iconVariant/)
})

test('sc dashboard page uses ProgressBar in class cards', () => {
  const source = readSource('modules/school-company/dashboard/page/Page.tsx')

  assert.match(source, /ProgressBar/)
  assert.match(source, /Progresso da trilha/)
  assert.match(source, /classItem\.progress/)
  assert.match(source, /classes\.map/)
})

test('sc dashboard page follows the same loading pattern as other pages', () => {
  const source = readSource('modules/school-company/dashboard/page/Page.tsx')

  assert.match(source, /useState\(true\)/)
  assert.match(source, /isLoading/)
  assert.match(source, /LoadingScreen/)
  assert.match(source, /useEffect/)
  assert.match(source, /let isActive = true/)
  assert.match(source, /isActive = false/)
})

test('sc dashboard page uses AppPageContainer', () => {
  const source = readSource('modules/school-company/dashboard/page/Page.tsx')

  assert.match(source, /AppPageContainer/)
})

test('sc dashboard navigation has section grouping for ESCOLA and PARCEIRAS', () => {
  const source = readSource('app/navigation/items/schoolCompany.tsx')

  assert.match(source, /section: 'ESCOLA'/)
  assert.match(source, /section: 'PARCEIRAS'/)
  assert.match(source, /Visão Geral/)
  assert.match(source, /Alunos/)
  assert.match(source, /Apoio/)
  assert.match(source, /Visão Parceiras/)
  assert.match(source, /Escolas Adotadas/)
})
