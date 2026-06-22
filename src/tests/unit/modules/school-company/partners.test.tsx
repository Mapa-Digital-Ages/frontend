import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('sc partners page exists and uses the enterpriseSchool variant header', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /variant="enterpriseSchool"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /Parcerias e Impacto Educacional/)
  assert.match(
    source,
    /Acompanhe indicadores de resultado e investimento social/
  )
})

test('sc partners page renders metric cards for schools and students', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /Escolas Apoiadas/)
  assert.match(source, /Alunos Impactados/)
  assert.match(source, /AccountBalanceIcon/)
  assert.match(source, /SchoolRoundedIcon/)
})

test('sc partners page uses theme-aware styling with escola_empresa role', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /useTheme/)
  assert.match(source, /getRolePalette/)
  assert.match(source, /escola_empresa/)
  assert.match(source, /accent\.primary/)
})

test('sc partners page uses AppCard and AppPageContainer', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /AppCard/)
  assert.match(source, /AppPageContainer/)
})

test('sc partners page manages support requests state', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /supportRequests/)
  assert.match(source, /setSupportRequests/)
  assert.match(source, /useState/)
})

test('sc partners page manages supported schools state', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /supportedSchools/)
  assert.match(source, /setSupportedSchools/)
})

test('sc partners page supports approve and reject actions', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /handleApprove/)
  assert.match(source, /handleReject/)
  assert.match(source, /CheckCircleRoundedIcon/)
  assert.match(source, /CancelRoundedIcon/)
})

test('sc partners page moves approved request to supported schools list', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(
    source,
    /setSupportedSchools\(current => \[\.\.\.current, request\]\)/
  )
  assert.match(source, /current\.filter\(item => item\.id !== id\)/)
})

test('sc partners page renders support requests list', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /Solicitações de Apoio/)
  assert.match(source, /supportRequests\.map/)
  assert.match(source, /request\.schoolName/)
  assert.match(source, /request\.description/)
})

test('sc partners page renders supported schools list', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /supportedSchools\.map/)
  assert.match(source, /school\.schoolName/)
  assert.match(source, /school\.description/)
})

test('sc partners page calculates impacted students based on supported schools', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /impactedStudents/)
  assert.match(source, /supportedSchools\.length/)
})

test('sc partners page defines SupportRequest type with id, schoolName and description', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /SupportRequest/)
  assert.match(source, /schoolName/)
  assert.match(source, /description/)
})

test('sc partners page contains mock data for initial requests and schools', () => {
  const source = readSource('modules/school-company/partners/page/Page.tsx')

  assert.match(source, /Escola São Paulo/)
  assert.match(source, /Escola Porto Alegre/)
  assert.match(source, /Escola Canoas/)
})
