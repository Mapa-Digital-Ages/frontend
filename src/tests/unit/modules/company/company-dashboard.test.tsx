import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('company dashboard page exists and uses the company variant header', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')
  const serviceSource = readSource(
    'modules/company/dashboard/services/service.ts'
  )

  assert.match(source, /variant="company"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /companyDashboardService\.getTitle\(\)/)
  assert.match(serviceSource, /Impacto Educacional/)
  assert.match(
    source,
    /Acompanhe indicadores de resultado e investimento social/
  )
})

test('company dashboard renders metric cards for schools and students', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /MetricsCard/)
  assert.match(source, /Escolas Apoiadas/)
  assert.match(source, /Alunos Impactados/)
  assert.match(source, /supported-schools/)
  assert.match(source, /impacted-students/)
})

test('company dashboard contains support requests section with approve and reject actions', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /Solicitações de Apoio/)
  assert.match(source, /support-requests-section/)
  assert.match(source, /approve-request-/)
  assert.match(source, /reject-request-/)
  assert.match(source, /CheckCircleOutlineRoundedIcon/)
  assert.match(source, /CancelOutlinedIcon/)
})

test('company dashboard contains supported schools section', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /supported-schools-section/)
  assert.match(source, /Escolas Apoiadas/)
  assert.match(source, /supportedSchools\.map/)
})

test('company dashboard applies data-testid to all major components', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /data-testid="company-dashboard"/)
  assert.match(source, /data-testid="metrics-section"/)
  assert.match(source, /data-testid="support-requests-section"/)
  assert.match(source, /data-testid="supported-schools-section"/)
  assert.match(source, /data-testid=\{`metric-card-\$\{card\.id\}`\}/)
  assert.match(source, /data-testid=\{`support-request-\$\{request\.id\}`\}/)
  assert.match(source, /data-testid=\{`supported-school-\$\{school\.id\}`\}/)
})

test('company dashboard uses theme-aware styling instead of fixed colors', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /useTheme/)
  assert.match(source, /theme\.palette/)
  assert.doesNotMatch(source, /text-slate-900/)
  assert.doesNotMatch(source, /bg-slate/)
})

test('company dashboard service exposes stats, support requests and supported schools', () => {
  const source = readSource('modules/company/dashboard/services/service.ts')

  assert.match(source, /getTitle/)
  assert.match(source, /getStats/)
  assert.match(source, /getSupportRequests/)
  assert.match(source, /getSupportedSchools/)
  assert.match(source, /CompanyStat/)
})

test('company dashboard types define SupportRequest and SupportedSchool', () => {
  const source = readSource('modules/company/dashboard/types/types.ts')

  assert.match(source, /SupportRequest/)
  assert.match(source, /SupportedSchool/)
  assert.match(source, /SupportRequestStatus/)
  assert.match(source, /aguardando/)
  assert.match(source, /apoiada/)
})

test('company module exposes dashboard route entry', () => {
  const source = readSource('modules/company/route.tsx')

  assert.match(source, /company\.dashboard/)
  assert.match(source, /allowedRoles=\{\['empresa'\]\}/)
})

test('company dashboard follows the same loading pattern as admin dashboard', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /useState\(true\)/)
  assert.match(source, /isLoading/)
  assert.match(source, /LoadingScreen/)
  assert.match(source, /useEffect/)
  assert.match(source, /let isActive = true/)
  assert.match(source, /isActive = false/)
})

test('company dashboard uses AppCard for list sections', () => {
  const source = readSource('modules/company/dashboard/page/Page.tsx')

  assert.match(source, /AppCard/)
  assert.match(source, /AppPageContainer/)
  assert.match(
    source,
    /contentSx=\{\{\s*maxHeight: 400,\s*overflowY: 'auto'\s*\}\}/
  )
})

test('company shared types file re-exports CompanyStat from common', () => {
  assert.ok(sourceExists('modules/company/dashboard/types/types.ts'))
  const source = readSource('modules/company/dashboard/types/types.ts')
  assert.match(source, /CompanyStat/)
})
