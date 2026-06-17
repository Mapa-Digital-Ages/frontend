import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'
import type { ApiResponse } from '../../../../shared/types/api'
import type {
  ContentApprovalItem,
  ParentApprovalItem,
} from '../../../../modules/admin/shared/types/types'
import { buildApprovalQueueQuery } from '../../../../modules/admin/content/services/content/mapper'
import type {
  ApprovalQueueResponseDto,
  ContentApprovalDto,
} from '../../../../modules/admin/content/services/content/mapper'
import { mapContentApprovalQueueResponse } from '../../../../modules/admin/content/services/content/service'
import {
  buildGuardianListQuery,
  mapGuardianResponseToParentApprovalItem,
  mapParentStatusToGuardianStatusDto,
} from '../../../../modules/admin/parent/services/parent/service'
import {
  filterApprovalItems,
  getParentApprovalEligibility,
  paginateApprovalItems,
} from '../../../../modules/admin/parent/utils/utils'

const contentItems: ContentApprovalItem[] = [
  {
    id: 'content-1',
    kind: 'content',
    description: 'Conteúdo de matemática',
    title: 'Lista de Equações do 7º ano',
    subtitle: 'Tarefa · Matemática · 22/03/2026',
    status: 'inReview',
    badges: [
      {
        id: 'badge-1',
        label: 'Upload de aluno',
        tone: 'neutral',
      },
    ],
  },
  {
    id: 'content-2',
    kind: 'content',
    description: 'Conteúdo de português',
    title: 'Prova mensal de interpretação',
    subtitle: 'Prova · Português · 28/03/2026',
    status: 'sent',
    badges: [
      {
        id: 'badge-2',
        label: '2 questões vinculadas',
        tone: 'danger',
      },
    ],
  },
]

const parentItems: ParentApprovalItem[] = [
  {
    id: 'parent-1',
    kind: 'parent',
    title: 'Mariana Souza',
    subtitle: 'Solicitação em 01/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: 'parent-badge-1',
        label: 'Documento pendente',
        tone: 'warning',
      },
    ],
    childName: 'Luiza Souza',
    name: {
      firstName: 'Mariana',
      lastName: 'Souza',
    },
    validation: {
      hasDocument: false,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
  {
    id: 'parent-2',
    kind: 'parent',
    title: 'Carlos Santos',
    subtitle: 'Solicitação em 02/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: 'parent-badge-2',
        label: 'Pronto para liberar',
        tone: 'success',
      },
    ],
    childName: 'Rafael Santos',
    name: {
      firstName: 'Carlos',
      lastName: 'Santos',
    },
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
]

const contentQueueResponse: ApiResponse<
  ApprovalQueueResponseDto<ContentApprovalDto>
> = {
  data: {
    items: [
      {
        id: 'content-10',
        created_at: '2026-04-07T12:00:00+00:00',
        description: 'Avaliação bimestral',
        subject: {
          id: '1',
          name: 'Português',
          slug: 'portuguese',
          color: 'rgba(5, 113, 247, 1)',
        },
        title: 'Avaliação bimestral',
        updated_at: null,
      },
    ],
    page: 2,
    page_size: 10,
    total_items: 11,
    total_pages: 2,
  },
  message: 'OK',
  success: true,
}

test('filterApprovalItems searches by text and respects the selected status', () => {
  const bySearch = filterApprovalItems(contentItems, {
    query: 'interpretação',
    status: 'all',
  })
  const byStatus = filterApprovalItems(contentItems, {
    query: '',
    status: 'inReview',
  })
  const byBadge = filterApprovalItems(contentItems, {
    query: 'questões vinculadas',
    status: 'all',
  })

  assert.equal(bySearch.length, 1)
  assert.equal(bySearch[0]?.id, 'content-2')
  assert.equal(byStatus.length, 1)
  assert.equal(byStatus[0]?.id, 'content-1')
  assert.equal(byBadge.length, 1)
  assert.equal(byBadge[0]?.id, 'content-2')
})

test('paginateApprovalItems clamps the current page and exposes totals', () => {
  const page = paginateApprovalItems(contentItems, {
    page: 4,
    pageSize: 1,
  })

  assert.equal(page.currentPage, 2)
  assert.equal(page.totalPages, 2)
  assert.equal(page.totalItems, 2)
  assert.equal(page.items.length, 1)
  assert.equal(page.items[0]?.id, 'content-2')
})

test('getParentApprovalEligibility only allows approval when all validations pass', () => {
  const blocked = getParentApprovalEligibility(parentItems[0])
  const ready = getParentApprovalEligibility(parentItems[1])

  assert.equal(blocked.canApprove, false)
  assert.deepEqual(blocked.missingRequirements, ['documento'])
  assert.equal(ready.canApprove, true)
  assert.deepEqual(ready.missingRequirements, [])
})

test('admin approvals area is wired into routes and sidebar navigation', () => {
  const routesSource = readSource('app/router/paths.ts')
  const adminRouteSource = readSource('modules/admin/route.tsx')
  const dashboardLayoutSource = readSource('app/layout/DashboardLayout.tsx')

  assert.match(routesSource, /contents: '\/admin\/contents'/)
  assert.match(routesSource, /parents: '\/admin\/parents'/)
  assert.match(routesSource, /correction: '\/admin\/corrections\/:contentId'/)
  assert.match(routesSource, /buildAdminCorrectionRoute/)
  assert.match(adminRouteSource, /AdminContentPage/)
  assert.match(adminRouteSource, /AdminParentPage/)
  assert.match(adminRouteSource, /AdminContentCorrectionPage/)
  assert.match(dashboardLayoutSource, /NAVIGATION_BY_ROLE/)
  assert.doesNotMatch(dashboardLayoutSource, /Correção de atividade/)
})

test('mapContentApprovalQueueResponse normalizes python-style DTOs into UI items', () => {
  const response = mapContentApprovalQueueResponse(contentQueueResponse)

  assert.equal(response.currentPage, 2)
  assert.equal(response.totalItems, 11)
  assert.equal(response.items[0]?.status, 'sent')
  assert.equal(response.items[0]?.subtitle, 'Português · Criado em 07/04/2026')
  assert.equal(response.items[0]?.badges.length, 0)
  assert.equal(response.items[0]?.subject?.label, 'Português')
})

test('guardian response normalizes into parent queue items', () => {
  const item = mapGuardianResponseToParentApprovalItem({
    user_id: '47f2a20f-77cb-4d0b-89ef-b64d160fce48',
    first_name: 'Mariana',
    last_name: 'Souza',
    email: 'responsavel@test.com',
    phone_number: '+55 51 99999-0000',
    guardian_status: 'waiting',
    is_active: true,
    created_at: '2026-04-08T10:15:00+00:00',
    deactivated_at: null,
    students: [],
  })

  assert.equal(item.id, '47f2a20f-77cb-4d0b-89ef-b64d160fce48')
  assert.equal(item.title, 'Mariana Souza')
  assert.deepEqual(item.name, {
    firstName: 'Mariana',
    lastName: 'Souza',
  })
  assert.equal(item.status, 'pendingValidation')
  assert.equal(item.requestedAt, '08/04/2026')
  assert.equal(item.roleLabel, 'Responsável')
  assert.equal(item.validation.hasDocument, true)
  assert.equal(item.validation.studentLinked, false)
  assert.equal(
    item.badges.some(badge => badge.label === 'responsavel@test.com'),
    true
  )
})

test('admin approval query builders translate UI filters to API parameters', () => {
  const contentQuery = buildApprovalQueueQuery({
    page: 3,
    pageSize: 25,
    query: ' matemática ',
    status: 'inReview',
  })
  const guardianPendingQuery = buildGuardianListQuery({
    page: 1,
    pageSize: 10,
    query: 'mariana',
    status: 'pendingValidation',
  })
  const guardianAllQuery = buildGuardianListQuery({
    page: 1,
    pageSize: 10,
    query: '',
    status: 'all',
  })

  assert.deepEqual(contentQuery, {
    page: 3,
    page_size: 25,
    query: 'matemática',
  })
  assert.deepEqual(guardianPendingQuery, {
    page: 1,
    size: 10,
    name: 'mariana',
    guardian_status: 'waiting',
  })
  assert.deepEqual(guardianAllQuery, {
    page: 1,
    size: 10,
    name: undefined,
    guardian_status: undefined,
  })
})

test('admin parent status updates only send final approval states to the backend', () => {
  assert.equal(mapParentStatusToGuardianStatusDto('approved'), 'approved')
  assert.equal(mapParentStatusToGuardianStatusDto('rejected'), 'rejected')
  assert.doesNotThrow(() => mapParentStatusToGuardianStatusDto('approved'))

  try {
    mapParentStatusToGuardianStatusDto('pendingValidation')
    throw new Error('Expected pendingValidation to be rejected')
  } catch (error) {
    assert.match(
      error instanceof Error ? error.message : String(error),
      /aguardando/
    )
  }
})

test('parent approvals use guardian endpoint with real pagination', () => {
  const repositorySource = readSource(
    'modules/admin/parent/services/parent/repository.ts'
  )
  const mapperSource = readSource(
    'modules/admin/parent/services/parent/mapper.ts'
  )

  assert.match(
    repositorySource,
    /client\.get<GuardianListPaginatedDto>\(\s*'guardian'/
  )
  assert.match(repositorySource, /admin\/users\/\$\{encodeURIComponent/)
  assert.match(repositorySource, /client\.get<GuardianResponseDto>/)
  assert.match(
    repositorySource,
    /guardian\/\$\{encodeURIComponent\(guardianId\)\}/
  )
  assert.match(repositorySource, /post<unknown>\(\s*'register\/guardian'/)
  assert.match(mapperSource, /GuardianListPaginatedDto/)
  assert.match(mapperSource, /guardian_status/)
  assert.doesNotMatch(repositorySource, /mock/i)
  assert.doesNotMatch(repositorySource, /fallback/i)
})

test('content correction page uses upload details and presigned download URLs', async () => {
  const correctionPageSource = readSource(
    'modules/admin/content-correction/page/Page.tsx'
  )
  const uploadRepositorySource = readSource(
    'modules/admin/content/services/upload/repository.ts'
  )

  assert.match(correctionPageSource, /useParams/)
  assert.match(correctionPageSource, /useUserRole/)
  assert.match(correctionPageSource, /uploadApprovalService\.getUpload/)
  assert.match(correctionPageSource, /getUploadDownloadUrl/)
  assert.match(correctionPageSource, /previewExpiresAt/)
  assert.match(correctionPageSource, /link\.href = fresh\.url/)
  assert.match(correctionPageSource, /correctionCardHeight/)
  assert.match(correctionPageSource, /height: correctionCardHeight/)
  assert.match(correctionPageSource, /flexWrap: \{ md: 'nowrap', xs: 'wrap' \}/)
  assert.doesNotMatch(correctionPageSource, /overflowX: 'auto'/)
  assert.doesNotMatch(correctionPageSource, /marginTop: 'auto'/)
  assert.match(uploadRepositorySource, /uploads\/\$\{id\}\/download-url/)
  assert.match(uploadRepositorySource, /presigned/)
  assert.match(
    uploadRepositorySource,
    /correctionInProgress'\) return 'in_review'/
  )
})

test('backend content records are exposed as sent admin queue items', () => {
  const response = mapContentApprovalQueueResponse(contentQueueResponse)

  assert.equal(response.items[0]?.status, 'sent')
})

test('theme selector and approvals filter reuse AppDropdown with the ghost trigger', () => {
  const themeModeSource = readSource('shared/ui/ThemeMode.tsx')
  const appDropdownSource = readSource('shared/ui/AppDropdown.tsx')
  const searchBarAndFilterSource = readSource(
    'shared/ui/SearchBarAndFilter.tsx'
  )

  assert.match(themeModeSource, /AppDropdown/)
  assert.match(themeModeSource, /Sistema/)
  assert.match(appDropdownSource, /triggerVariant/)
  assert.match(appDropdownSource, /ghost/)
  assert.match(searchBarAndFilterSource, /triggerVariant="ghost"/)
  assert.match(
    searchBarAndFilterSource,
    /resultsSummary: ApprovalResultsSummary/
  )
  assert.match(searchBarAndFilterSource, /resultsSummary\.count/)
  assert.match(searchBarAndFilterSource, /pluralLabel/)
  assert.doesNotMatch(searchBarAndFilterSource, /resultLabel: string/)
})

test('approval queue panel reuses shared toolbar and pagination components', () => {
  const approvalComponentSource = readSource(
    'modules/admin/shared/components/ApprovalComponent.tsx'
  )
  const searchBarAndFilterSource = readSource(
    'shared/ui/SearchBarAndFilter.tsx'
  )
  const paginationSource = readSource('shared/ui/Pagination.tsx')

  assert.match(approvalComponentSource, /SearchBarAndFilter/)
  assert.match(approvalComponentSource, /Pagination/)
  assert.match(approvalComponentSource, /overflowY: 'auto'/)
  assert.match(approvalComponentSource, /flex: 1/)
  assert.match(approvalComponentSource, /minHeight: 0/)
  assert.match(searchBarAndFilterSource, /InputAdornment position="end"/)
  assert.match(searchBarAndFilterSource, /displayLabel="Filtros"/)
  assert.match(
    searchBarAndFilterSource,
    /onStatusChange\?: \(status: string\) => void/
  )
  assert.doesNotMatch(searchBarAndFilterSource, /ChangeEvent/)
  assert.match(searchBarAndFilterSource, /height: 44/)
  assert.match(searchBarAndFilterSource, /minHeight: 44/)
  assert.match(paginationSource, /currentPage/)
})

test('admin approvals page uses a responsive grid and a bounded page size for queues', () => {
  const adminContentPageSource = readSource(
    'modules/admin/content/page/Page.tsx'
  )

  assert.match(adminContentPageSource, /pageSize: 10/)
  assert.match(adminContentPageSource, /gridTemplateColumns:/)
})

test('approval list cards preserve the compact visual proportions from the reference', () => {
  const approvalCardSource = readSource(
    'modules/admin/shared/components/ApprovalCard.tsx'
  )
  const searchBarAndFilterSource = readSource(
    'shared/ui/SearchBarAndFilter.tsx'
  )

  assert.match(approvalCardSource, /fontSize: \{ md: 20, xs: 16 \}/)
  assert.match(approvalCardSource, /AppTags/)
  assert.match(approvalCardSource, /size="sm"/)
  assert.doesNotMatch(approvalCardSource, /buildActions/)
  assert.doesNotMatch(approvalCardSource, /approvalQueue\.utils/)
  assert.match(searchBarAndFilterSource, /height: 44/)
})

test('admin surfaces rely on theme-aware styling instead of fixed slate utility colors', () => {
  const adminDashboardSource = readSource(
    'modules/admin/dashboard/page/Page.tsx'
  )
  const approvalCardSource = readSource(
    'modules/admin/shared/components/ApprovalCard.tsx'
  )
  const approvalComponentSource = readSource(
    'modules/admin/shared/components/ApprovalComponent.tsx'
  )

  assert.match(adminDashboardSource, /useTheme/)
  assert.match(approvalCardSource, /useTheme/)
  assert.match(approvalComponentSource, /useTheme/)
  assert.doesNotMatch(approvalCardSource, /text-slate-900/)
  assert.doesNotMatch(approvalComponentSource, /text-slate-900/)
})

test('admin approvals page renders cards directly and provides visible actions', () => {
  const adminContentPageSource = readSource(
    'modules/admin/content/page/Page.tsx'
  )
  const approvalCardSource = readSource(
    'modules/admin/shared/components/ApprovalCard.tsx'
  )
  const adminTypesSource = readSource('modules/admin/shared/types/types.ts')

  assert.match(adminTypesSource, /export interface ApprovalCardAction/)
  assert.match(adminTypesSource, /export interface ApprovalCardStatus/)
  assert.match(adminTypesSource, /export interface ApprovalCardHelperText/)
  assert.match(adminContentPageSource, /<UploadApprovalCard/)
  assert.match(adminContentPageSource, /<ContentCard/)
  assert.doesNotMatch(adminContentPageSource, /actions=\{\[\]\}/)
  assert.match(
    adminContentPageSource,
    /actions=\{buildContentActions\(item\)\}/
  )

  assert.match(adminContentPageSource, /type="content"/)
  assert.match(approvalCardSource, /type: ApprovalType/)
  assert.match(approvalCardSource, /MoreHorizRoundedIcon/)
  assert.match(approvalCardSource, /const primaryActions = actions\.filter/)
  assert.match(approvalCardSource, /const secondaryActions = actions\.filter/)
  assert.match(approvalCardSource, /<Menu/)
  assert.doesNotMatch(approvalCardSource, /ApprovalPill/)
  assert.match(approvalCardSource, /subjectTag/)
  assert.match(approvalCardSource, /AppTag/)
  assert.doesNotMatch(approvalCardSource, /buildActions/)
})

test('admin approval service separates repository and mapper concerns for future API integration', () => {
  const serviceSource = readSource('modules/admin/content/services/service.ts')
  const runtimeSource = readSource('modules/admin/content/services/runtime.ts')
  const contentServiceSource = readSource(
    'modules/admin/content/services/content/service.ts'
  )

  assert.doesNotMatch(serviceSource, /runtime/)
  assert.match(runtimeSource, /from '\.\/content\/runtime'/)
  assert.match(contentServiceSource, /from '\.\/repository'/)
  assert.match(contentServiceSource, /from '\.\/mapper'/)
  assert.match(
    contentServiceSource,
    /export \{ createContentApprovalRepository \}/
  )
  assert.match(
    contentServiceSource,
    /export \{ mapContentApprovalQueueResponse \}/
  )

  assert.doesNotThrow(() =>
    readSource('modules/admin/content/services/content/repository.ts')
  )
  assert.doesNotThrow(() =>
    readSource('modules/admin/content/services/content/mapper.ts')
  )
})

test('admin approvals page routes create edit and correction through a reusable modal flow', () => {
  const adminContentPageSource = readSource(
    'modules/admin/content/page/Page.tsx'
  )
  const modalSource = readSource(
    'modules/admin/shared/components/ApprovalActionModal.tsx'
  )
  const adminParentPageSource = readSource('modules/admin/parent/page/Page.tsx')

  assert.match(adminContentPageSource, /ApprovalActionModal/)
  assert.match(adminContentPageSource, /contentModalState/)
  assert.match(adminContentPageSource, /action: 'create'/)
  assert.match(adminContentPageSource, /action: 'edit'/)
  assert.match(adminContentPageSource, /action: 'delete'/)
  assert.match(adminContentPageSource, /label: 'Editar Conteúdo'/)
  assert.match(adminContentPageSource, /label: 'Excluir Conteúdo'/)
  assert.match(adminContentPageSource, /UploadApprovalComponent/)
  assert.match(adminContentPageSource, /label: 'Iniciar correção'/)
  assert.match(adminContentPageSource, /buildAdminCorrectionRoute\(item\.id\)/)
  assert.doesNotMatch(adminContentPageSource, /applyContentCorrection/)
  assert.match(adminParentPageSource, /parentApprovalService/)
  assert.match(adminParentPageSource, /updateParentStatus/)
  assert.match(adminParentPageSource, /updateParentRegistration/)
  assert.match(adminParentPageSource, /removeParentRegistration/)
  assert.match(adminParentPageSource, /createParentRegistration/)
  assert.match(adminParentPageSource, /Validar cadastro/)
  assert.match(adminParentPageSource, /Rejeitar cadastro/)
  assert.match(adminParentPageSource, /Editar responsável/)
  assert.match(adminParentPageSource, /Excluir responsável/)
  assert.match(modalSource, /AppActionModal/)
  assert.match(modalSource, /resolveUsageMode/)
  assert.match(modalSource, /mode=\{dialogMode\}/)
  assert.doesNotMatch(modalSource, /mode\.action === 'correct'/)
  assert.doesNotMatch(modalSource, /Feedback da correção/)
  assert.doesNotMatch(modalSource, /correctionOutcomeOptions/)
  assert.doesNotMatch(modalSource, /roleOptions/)
  assert.match(modalSource, /mode\.type === 'parent'/)
  assert.match(modalSource, /mode\.type === 'content'/)
  assert.match(modalSource, /label="E-mail do responsável"/)
  assert.match(modalSource, /label="Senha provisória"/)
})
