import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('sc students page exists and uses the enterpriseSchool variant header', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')
  const serviceSource = readSource(
    'modules/school-company/students/services/service.ts'
  )

  assert.match(source, /variant="enterpriseSchool"/)
  assert.match(source, /PageHeader/)
  assert.match(source, /studentsService\.getTitle\(\)/)
  assert.match(source, /studentsService\.getSubtitle\(\)/)
  assert.match(serviceSource, /Escola \| Gestão de Alunos/)
  assert.match(
    serviceSource,
    /Cadastre alunos, mova entre turmas e ajuste vínculos quando necessário\./
  )
})

test('sc students page uses MetricsCard for indicators', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /MetricsCard/)
  assert.match(source, /indicators\.map/)
  assert.match(source, /indicator\.title/)
  assert.match(source, /indicator\.value/)
})

test('sc students page applies data-testid to all major components', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /data-testid="sc-students-page"/)
  assert.match(source, /data-testid="sc-students-indicators"/)
  assert.match(source, /data-testid={`sc-student-indicator-\${index}`}/)
  assert.match(source, /data-testid="sc-students-search"/)
  assert.match(source, /data-testid="sc-students-table"/)
  assert.match(source, /data-testid={`sc-student-row-\${student\.id}`}/)
  assert.match(source, /data-testid={`sc-student-menu-\${student\.id}`}/)
  assert.match(source, /data-testid="sc-create-student-btn"/)
})

test('sc students service exposes getTitle, getSubtitle, getIndicators and getStudents', () => {
  const source = readSource(
    'modules/school-company/students/services/service.ts'
  )

  assert.match(source, /getTitle/)
  assert.match(source, /getSubtitle/)
  assert.match(source, /getIndicators/)
  assert.match(source, /getStudents/)
  assert.match(source, /studentsService/)
})

test('sc students service contains mock data matching the design', () => {
  const source = readSource(
    'modules/school-company/students/services/service.ts'
  )

  assert.match(source, /Lucas Silva/)
  assert.match(source, /Carlos Nunes/)
  assert.match(source, /Lívia Santos/)
  assert.match(source, /Escola São Paulo/)
  assert.match(source, /Maria Silva/)
  assert.match(source, /Roberta Nunes/)
  assert.match(source, /Paulo Santos/)
  assert.match(source, /92/)
  assert.match(source, /88/)
  assert.match(source, /97/)
})

test('sc students types define StudentRecord and StudentIndicator', () => {
  assert.ok(sourceExists('modules/school-company/students/types/types.ts'))
  const source = readSource('modules/school-company/students/types/types.ts')

  assert.match(source, /StudentRecord/)
  assert.match(source, /StudentIndicator/)
  assert.match(source, /StudentRisk/)
  assert.match(source, /StudentStatus/)
  assert.match(source, /name/)
  assert.match(source, /responsible/)
  assert.match(source, /school/)
  assert.match(source, /year/)
  assert.match(source, /attendance/)
  assert.match(source, /risk/)
  assert.match(source, /status/)
})

test('sc students page uses SearchBarAndFilter', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /SearchBarAndFilter/)
  assert.match(source, /filterOptions/)
  assert.match(source, /onQueryChange/)
  assert.match(source, /onStatusChange/)
  assert.match(source, /searchPlaceholder/)
})

test('sc students page follows the same loading pattern as other pages', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /useState\(true\)/)
  assert.match(source, /isLoading/)
  assert.match(source, /LoadingScreen/)
  assert.match(source, /useEffect/)
  assert.match(source, /let isActive = true/)
  assert.match(source, /isActive = false/)
})

test('sc students page uses AppPageContainer', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /AppPageContainer/)
})

test('sc students table has correct columns', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /Aluno/)
  assert.match(source, /Escola/)
  assert.match(source, /Ano/)
  assert.match(source, /Frequência/)
  assert.match(source, /Risco/)
  assert.match(source, /Status/)
})

test('sc students page has the create student button', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /Criar aluno/)
  assert.match(source, /AppButton/)
  assert.match(source, /AddRoundedIcon/)
})

test('sc students page has risk and status tags with theme-aware colors', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /getRiskTag/)
  assert.match(source, /getStatusTag/)
  assert.match(source, /AppTag/)
  assert.match(source, /student\.risk/)
  assert.match(source, /student\.status/)
  assert.match(source, /palette\.success\.main/)
  assert.match(source, /palette\.warning\.main/)
  assert.match(source, /palette\.error\.main/)
})

test('sc students page uses useMemo for filtering', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /useMemo/)
  assert.match(source, /filteredStudents/)
  assert.match(source, /filterStatus/)
})

test('sc students route is no longer UnderDevelopmentPage', () => {
  const source = readSource('modules/school-company/route.tsx')

  assert.match(source, /StudentsPage/)
  assert.match(source, /students\/page\/Page/)
  assert.doesNotMatch(source, /UnderDevelopmentPage title="Alunos"/)
})

test('sc students page includes EditStudentModal from admin shared', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /EditStudentModal/)
  assert.match(source, /isEditModalOpen/)
  assert.match(source, /handleEditStudent/)
  assert.match(source, /data-testid="sc-edit-student-modal"/)
})

test('sc students page includes CreateStudentModal from admin shared', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /CreateStudentModal/)
  assert.match(source, /isCreateModalOpen/)
  assert.match(source, /handleCreateStudent/)
  assert.match(source, /data-testid="sc-create-student-modal"/)
})

test('sc students page includes detail view and delete confirmation modals', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /AppActionModal/)
  assert.match(source, /isDetailModalOpen/)
  assert.match(source, /isDeleteModalOpen/)
  assert.match(source, /data-testid="sc-student-detail-modal"/)
  assert.match(source, /data-testid="sc-delete-student-modal"/)
  assert.match(source, /Detalhes do Aluno/)
  assert.match(source, /Excluir aluno/)
  assert.match(source, /Confirmar exclusão/)
})

test('sc students page menu items have proper icons and actions', () => {
  const source = readSource('modules/school-company/students/page/Page.tsx')

  assert.match(source, /VisibilityRoundedIcon/)
  assert.match(source, /EditRoundedIcon/)
  assert.match(source, /DeleteOutlineRoundedIcon/)
  assert.match(source, /data-testid="sc-student-view-action"/)
  assert.match(source, /data-testid="sc-student-edit-action"/)
  assert.match(source, /data-testid="sc-student-delete-action"/)
})
