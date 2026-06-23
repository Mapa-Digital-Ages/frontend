import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import PageHeader from '@/shared/ui/PageHeader'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { buildAdminCorrectionRoute } from '@/app/router/paths'
import { useUserRole } from '@/app/access/hook'
import { contentApprovalService } from '@/modules/admin/content/services/runtime'
import { subjectService } from '@/modules/admin/content/services/subject/service'
import { uploadApprovalService } from '@/modules/admin/content/services/upload/runtime'
import type {
  ApprovalCardAction,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ApprovalResultsSummary,
  ContentApprovalDraftInput,
  ContentApprovalItem,
} from '@/modules/admin/shared/types/types'
import type {
  UploadActivityType,
  UploadApprovalFilter,
  UploadApprovalItem,
  UploadApprovalQuery,
  UploadApprovalResult,
  UploadApprovalStatus,
  UploadEditFormValues,
} from '../types/upload'
import { UPLOAD_APPROVAL_CARD_STATUS } from '@/shared/utils/themes'
import ApprovalActionModal, {
  type ApprovalActionModalMode,
} from '@/modules/admin/shared/components/ApprovalActionModal'
import type {
  ContentApprovalActionFormValues,
  GuardianApprovalActionFormValues,
} from '@/modules/admin/shared/types/types'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from '@/modules/admin/shared/components/ApprovalComponent'
import UploadApprovalComponent, {
  type UploadStatusOption,
} from '../components/UploadApprovalComponent'
import UploadApprovalCard from '../components/UploadApprovalCard'
import UploadActionModal, {
  type UploadActionModalMode,
} from '../components/UploadActionModal'
import ContentCard from '../components/ContentCard'
import MetricsCard from '@/shared/ui/MetricsCard'
import SubjectComponent from '../components/SubjectComponent'
import SubjectCard from '../components/SubjectCard'
import SubjectActionModal, {
  type SubjectActionModalMode,
  type SubjectFormValues,
} from '../components/SubjectActionModal'
import type { SubjectItem } from '@/modules/admin/shared/types/types'

const DEFAULT_PAGE_INDEX = 1

const DEFAULT_CONTENT_QUERY: ApprovalQueueQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const DEFAULT_UPLOAD_QUERY: UploadApprovalQuery = {
  activityType: 'all',
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const contentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Enviado', value: 'sent' },
]

const uploadFilterOptions: UploadStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando revisão', value: 'pending' },
  { label: 'Em revisão', value: 'inReview' },
  { label: 'Correção em andamento', value: 'correctionInProgress' },
  { label: 'Corrigido', value: 'corrected' },
  { label: 'Rejeitado', value: 'rejected' },
  { label: 'Exercício', value: 'exercise' },
  { label: 'Redação', value: 'essay' },
  { label: 'Atividade', value: 'activity' },
]

function isUploadActivityFilter(
  filter: UploadApprovalFilter
): filter is UploadActivityType {
  return filter === 'activity' || filter === 'essay' || filter === 'exercise'
}

const DEFAULT_SUBJECT_ID = 'default'

function emptyContentQueue(
  pageSize: number
): ApprovalQueueResult<ContentApprovalItem> {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function emptyUploadQueue(pageSize: number): UploadApprovalResult {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function buildResultsSummary(count: number): ApprovalResultsSummary {
  return { count, pluralLabel: 'resultados', singularLabel: 'resultado' }
}

function getTodayRequestDate() {
  return new Intl.DateTimeFormat('pt-BR').format(new Date())
}

function getDefaultContentFormValues(
  subjectId: string = DEFAULT_SUBJECT_ID
): ContentApprovalActionFormValues {
  return {
    type: 'content',
    requestedAt: getTodayRequestDate(),
    subjectId,
    title: '',
    description: '',
  }
}

function getDefaultUploadEditValues(
  item?: UploadApprovalItem
): UploadEditFormValues {
  return { activityType: item?.activityType ?? 'exercise' }
}

export default function Page() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { role, isAdmin } = useUserRole()
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [subjectError, setSubjectError] = useState<string | null>(null)
  const [subjectRefreshKey, setSubjectRefreshKey] = useState(0)
  const [hasLoadedSubjects, setHasLoadedSubjects] = useState(false)
  const [contentQuery, setContentQuery] = useState<ApprovalQueueQuery>(
    DEFAULT_CONTENT_QUERY
  )
  const [contentQueue, setContentQueue] = useState<
    ApprovalQueueResult<ContentApprovalItem>
  >(emptyContentQueue(DEFAULT_CONTENT_QUERY.pageSize))
  const [contentError, setContentError] = useState<string | null>(null)
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  const [contentRefreshKey, setContentRefreshKey] = useState(0)
  const [contentModalState, setContentModalState] =
    useState<ApprovalActionModalMode | null>(null)
  const [contentModalValues, setContentModalValues] =
    useState<ContentApprovalActionFormValues>(getDefaultContentFormValues())
  const [isContentModalSubmitting, setIsContentModalSubmitting] =
    useState(false)
  const [contentSelectionMode, setContentSelectionMode] = useState<
    'edit' | 'delete' | null
  >(null)

  const deferredContentSearch = useDeferredValue(contentQuery.query)
  const resolvedContentQuery = useMemo(
    () => ({ ...contentQuery, query: deferredContentSearch }),
    [contentQuery, deferredContentSearch]
  )

  const [uploadQuery, setUploadQuery] =
    useState<UploadApprovalQuery>(DEFAULT_UPLOAD_QUERY)
  const [uploadQueue, setUploadQueue] = useState<UploadApprovalResult>(
    emptyUploadQueue(DEFAULT_UPLOAD_QUERY.pageSize)
  )
  const [uploadTotals, setUploadTotals] = useState<{
    total: number
    bySubject: Record<string, number>
  }>({ total: 0, bySubject: {} })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [hasLoadedUploads, setHasLoadedUploads] = useState(false)
  const [uploadRefreshKey, setUploadRefreshKey] = useState(0)
  const [uploadModalState, setUploadModalState] =
    useState<UploadActionModalMode | null>(null)
  const [uploadModalValues, setUploadModalValues] =
    useState<UploadEditFormValues>(getDefaultUploadEditValues())
  const [isUploadModalSubmitting, setIsUploadModalSubmitting] = useState(false)
  const [uploadSelectionMode, setUploadSelectionMode] = useState<
    'edit' | 'delete' | null
  >(null)

  const deferredUploadSearch = useDeferredValue(uploadQuery.query)
  const resolvedUploadQuery = useMemo(
    () => ({ ...uploadQuery, query: deferredUploadSearch }),
    [uploadQuery, deferredUploadSearch]
  )

  const contentResultsSummary = useMemo(
    () => buildResultsSummary(contentQueue.totalItems),
    [contentQueue.totalItems]
  )
  const uploadResultsSummary = useMemo(
    () => buildResultsSummary(uploadQueue.totalItems),
    [uploadQueue.totalItems]
  )
  const subjectOptions = useMemo(
    () =>
      subjects.map(subject => ({
        label: subject.name,
        value: subject.id,
      })),
    [subjects]
  )
  const defaultSubjectId = subjectOptions[0]?.value ?? DEFAULT_SUBJECT_ID
  const selectedUploadFilter: UploadApprovalFilter =
    uploadQuery.activityType !== 'all'
      ? uploadQuery.activityType
      : uploadQuery.status

  const cards = [
    {
      id: 'subjects',
      title: 'Disciplinas',
      value: subjects.length,
    },
    {
      id: 'contents',
      title: 'Conteúdos',
      value: subjects.reduce((sum, s) => sum + s.contentCount, 0),
    },
    {
      id: 'activities',
      title: 'Atividades',
      value: uploadTotals.total,
    },
  ]

  const getSubjectById = useCallback(
    (subjectId: string) => {
      const backendSubject = subjects.find(subject => subject.id === subjectId)
      if (backendSubject) {
        return {
          color: backendSubject.color,
          id: backendSubject.id,
          label: backendSubject.name,
        }
      }
      return { id: subjectId || DEFAULT_SUBJECT_ID, label: 'Geral' }
    },
    [subjects]
  )
  const getContentSubjectId = useCallback(
    (item?: ContentApprovalItem) => {
      const subjectId = item?.subject?.id ? String(item.subject.id) : ''
      if (subjectId && subjects.some(subject => subject.id === subjectId)) {
        return subjectId
      }

      const subjectLabel = item?.subject?.label
      const matchedSubject = subjects.find(
        subject => subject.name === subjectLabel
      )
      return matchedSubject?.id ?? subjectId ?? defaultSubjectId
    },
    [defaultSubjectId, subjects]
  )

  const [subjectModalMode, setSubjectModalMode] =
    useState<SubjectActionModalMode | null>(null)
  const [subjectModalValues, setSubjectModalValues] =
    useState<SubjectFormValues>({ name: '', color: 'rgba(32, 109, 197, 1)' })
  const [isSubjectModalSubmitting, setIsSubjectModalSubmitting] =
    useState(false)

  const resetSubjectModal = useCallback(() => {
    setSubjectModalMode(null)
    setSubjectModalValues({ name: '', color: 'rgba(32, 109, 197, 1)' })
  }, [])

  const handleSubjectModalChange = useCallback(
    (field: keyof SubjectFormValues, value: string) => {
      setSubjectModalValues(current => ({ ...current, [field]: value }))
    },
    []
  )

  const handleSubjectModalConfirm = useCallback(async () => {
    if (!subjectModalMode || isSubjectModalSubmitting) return
    setIsSubjectModalSubmitting(true)
    try {
      if (subjectModalMode.action === 'create') {
        await subjectService.createSubject(
          subjectModalValues.name,
          subjectModalValues.color
        )
      } else if (subjectModalMode.action === 'edit') {
        await subjectService.updateSubject(subjectModalMode.subjectId, {
          name: subjectModalValues.name,
          color: subjectModalValues.color,
        })
      } else if (subjectModalMode.action === 'delete') {
        await subjectService.deleteSubject(subjectModalMode.subjectId)
      }
      setSubjectRefreshKey(key => key + 1)
      resetSubjectModal()
    } finally {
      setIsSubjectModalSubmitting(false)
    }
  }, [
    subjectModalMode,
    subjectModalValues.color,
    subjectModalValues.name,
    isSubjectModalSubmitting,
    resetSubjectModal,
  ])

  const resetContentModal = useCallback(() => {
    setContentModalState(null)
    setContentModalValues(getDefaultContentFormValues(defaultSubjectId))
    setContentSelectionMode(null)
  }, [defaultSubjectId])

  const toggleContentSelectionMode = useCallback(
    (action: 'edit' | 'delete') => {
      setContentSelectionMode(current => (current === action ? null : action))
    },
    []
  )

  const openContentModal = useCallback(
    (nextMode: ApprovalActionModalMode) => {
      setContentModalState(nextMode)
      setContentModalValues({
        type: 'content',
        requestedAt:
          nextMode.action === 'create'
            ? getTodayRequestDate()
            : (nextMode.item?.requestedAt ?? getTodayRequestDate()),
        subjectId:
          nextMode.item?.kind === 'content'
            ? getContentSubjectId(nextMode.item)
            : defaultSubjectId,
        title: nextMode.item?.title ?? '',
        description: nextMode.item?.description ?? '',
      })
    },
    [defaultSubjectId, getContentSubjectId]
  )

  const handleContentItemSelect = useCallback(
    (item: ContentApprovalItem) => {
      if (!contentSelectionMode) return
      setContentSelectionMode(null)
      setContentModalState({
        action: contentSelectionMode,
        item,
        type: 'content',
      })
      setContentModalValues({
        type: 'content',
        requestedAt: item.requestedAt ?? getTodayRequestDate(),
        subjectId: getContentSubjectId(item),
        title: item.title ?? '',
        description: item.description ?? '',
      })
    },
    [contentSelectionMode, getContentSubjectId]
  )

  const handleContentModalChange = useCallback(
    (
      field:
        | keyof ContentApprovalActionFormValues
        | keyof GuardianApprovalActionFormValues,
      value: string
    ) => {
      setContentModalValues(current => ({ ...current, [field]: value }))
    },
    []
  )

  const handleContentModalConfirm = useCallback(async () => {
    if (!contentModalState || isContentModalSubmitting) return
    setIsContentModalSubmitting(true)
    try {
      if (contentModalState.action === 'delete' && contentModalState.item) {
        await contentApprovalService.removeLocalContentItem(
          contentModalState.item.id
        )
        setContentRefreshKey(k => k + 1)
        resetContentModal()
        return
      }
      const payload: ContentApprovalDraftInput = {
        requestedAt: contentModalValues.requestedAt,
        subject: getSubjectById(contentModalValues.subjectId),
        title: contentModalValues.title || 'Novo conteúdo',
        description: contentModalValues.description || '',
      }
      if (contentModalState.action === 'create') {
        await contentApprovalService.createLocalContentDraft(payload)
      } else if (contentModalState.item) {
        await contentApprovalService.updateLocalContentItem(
          contentModalState.item.id,
          payload
        )
      }
      setContentRefreshKey(k => k + 1)
      resetContentModal()
    } finally {
      setIsContentModalSubmitting(false)
    }
  }, [
    contentModalState,
    contentModalValues,
    getSubjectById,
    isContentModalSubmitting,
    resetContentModal,
  ])

  const isContentModalConfirmDisabled = useMemo(() => {
    if (!contentModalState || contentModalState.action === 'delete')
      return false
    return !contentModalValues.title.trim()
  }, [contentModalState, contentModalValues.title])

  const resetUploadModal = useCallback(() => {
    setUploadModalState(null)
    setUploadModalValues(getDefaultUploadEditValues())
    setUploadSelectionMode(null)
  }, [])

  const toggleUploadSelectionMode = useCallback((action: 'edit' | 'delete') => {
    setUploadSelectionMode(current => (current === action ? null : action))
  }, [])

  const handleUploadItemSelect = useCallback(
    (item: UploadApprovalItem) => {
      if (!uploadSelectionMode) return
      setUploadSelectionMode(null)
      setUploadModalState({ action: uploadSelectionMode, item })
      setUploadModalValues(getDefaultUploadEditValues(item))
    },
    [uploadSelectionMode]
  )

  const handleUploadModalChange = useCallback(
    (
      field: keyof UploadEditFormValues,
      value: UploadEditFormValues[typeof field]
    ) => {
      setUploadModalValues(current => ({ ...current, [field]: value }))
    },
    []
  )

  const handleUploadFilterChange = useCallback(
    (filter: UploadApprovalFilter) => {
      startTransition(() =>
        setUploadQuery(q => ({
          ...q,
          activityType: isUploadActivityFilter(filter) ? filter : 'all',
          page: DEFAULT_PAGE_INDEX,
          status: isUploadActivityFilter(filter) ? 'all' : filter,
        }))
      )
    },
    []
  )

  const handleUploadModalConfirm = useCallback(async () => {
    if (!uploadModalState || isUploadModalSubmitting) return
    setIsUploadModalSubmitting(true)
    try {
      if (uploadModalState.action === 'delete') {
        await uploadApprovalService.removeUpload(uploadModalState.item.id)
        setUploadRefreshKey(k => k + 1)
        resetUploadModal()
        return
      }
      await uploadApprovalService.updateUploadActivityType(
        uploadModalState.item.id,
        uploadModalValues.activityType
      )
      setUploadRefreshKey(k => k + 1)
      resetUploadModal()
    } finally {
      setIsUploadModalSubmitting(false)
    }
  }, [
    uploadModalState,
    isUploadModalSubmitting,
    uploadModalValues.activityType,
    resetUploadModal,
  ])

  const handleUploadStatusUpdate = useCallback(
    async (id: string, status: UploadApprovalStatus) => {
      await uploadApprovalService.updateUploadStatus(id, status)
      setUploadRefreshKey(k => k + 1)
    },
    []
  )

  const buildContentActions = useCallback(
    (item: ContentApprovalItem): ApprovalCardAction[] => {
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main
      return [
        {
          accentColor: warning,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-edit`,
          label: 'Editar Conteúdo',
          onClick: () =>
            openContentModal({ action: 'edit', item, type: 'content' }),
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir Conteúdo',
          onClick: () =>
            openContentModal({ action: 'delete', item, type: 'content' }),
        },
      ]
    },
    [openContentModal, theme.palette]
  )

  const buildUploadActions = useCallback(
    (item: UploadApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main
      return [
        {
          accentColor: warning,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-edit`,
          label: 'Editar tipo de atividade',
          onClick: () => {
            setUploadModalState({ action: 'edit', item })
            setUploadModalValues(getDefaultUploadEditValues(item))
          },
          priority: 'secondary',
          tooltip: 'Editar tipo de atividade',
        },
        {
          accentColor: success,
          disabled: item.status === 'corrected',
          icon: <CheckRoundedIcon />,
          id: `${item.id}-correct`,
          label: 'Marcar como corrigido',
          onClick: () => {
            void handleUploadStatusUpdate(item.id, 'corrected')
          },
          tooltip: 'Marcar como corrigido',
        },
        {
          accentColor: warning,
          icon: <RuleFolderOutlinedIcon />,
          id: `${item.id}-review`,
          label: 'Iniciar correção',
          onClick: () => {
            navigate(buildAdminCorrectionRoute(item.id))
          },
          tooltip: 'Iniciar correção',
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir upload',
          onClick: () => {
            setUploadModalState({ action: 'delete', item })
          },
          tooltip: 'Excluir upload',
        },
      ]
    },
    [
      handleUploadStatusUpdate,
      navigate,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ]
  )

  useEffect(() => {
    let isActive = true
    async function loadSubjects() {
      try {
        const nextSubjects = await subjectService.listSubjects()
        if (!isActive) return
        setSubjectError(null)
        setSubjects(nextSubjects)
      } catch {
        if (!isActive) return
        setSubjectError('Não foi possível carregar as disciplinas do backend.')
        setSubjects([])
      } finally {
        if (isActive) setHasLoadedSubjects(true)
      }
    }
    void loadSubjects()
    return () => {
      isActive = false
    }
  }, [subjectRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadContentQueue() {
      try {
        const nextContentQueue =
          await contentApprovalService.getContentQueue(resolvedContentQuery)
        if (!isActive) return
        setContentError(null)
        setContentQueue(nextContentQueue)
      } catch {
        if (!isActive) return
        setContentError(
          'Nenhum conteúdo cadastrado. Cadastre um novo conteúdo para revisão.'
        )
        setContentQueue(emptyContentQueue(DEFAULT_CONTENT_QUERY.pageSize))
      }
      if (isActive) setHasLoadedContent(true)
    }
    void loadContentQueue()
    return () => {
      isActive = false
    }
  }, [resolvedContentQuery, contentRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadUploadQueue() {
      try {
        const nextUploadQueue =
          await uploadApprovalService.getUploadQueue(resolvedUploadQuery)
        if (!isActive) return
        setUploadError(null)
        setUploadQueue(nextUploadQueue)
      } catch {
        if (!isActive) return
        setUploadError('Nenhum upload encontrado.')
        setUploadQueue(emptyUploadQueue(DEFAULT_UPLOAD_QUERY.pageSize))
      }
      if (isActive) setHasLoadedUploads(true)
    }
    void loadUploadQueue()
    return () => {
      isActive = false
    }
  }, [resolvedUploadQuery, uploadRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadUploadTotals() {
      try {
        const allUploads = await uploadApprovalService.getUploadQueue({
          ...DEFAULT_UPLOAD_QUERY,
          pageSize: 1000,
        })
        if (!isActive) return
        const bySubject = allUploads.items.reduce<Record<string, number>>(
          (acc, item) => {
            const subjectId = item.subject?.id ? String(item.subject.id) : null
            if (subjectId) {
              acc[subjectId] = (acc[subjectId] ?? 0) + 1
            }
            return acc
          },
          {}
        )
        setUploadTotals({ total: allUploads.totalItems, bySubject })
      } catch {
        if (!isActive) return
        setUploadTotals({ total: 0, bySubject: {} })
      }
    }
    void loadUploadTotals()
    return () => {
      isActive = false
    }
  }, [uploadRefreshKey])

  if (
    !isAdmin ||
    role !== 'admin' ||
    !hasLoadedSubjects ||
    !hasLoadedContent ||
    !hasLoadedUploads
  ) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Conteúdos"
        subtitle="Revise conteúdos enviados e valide materiais antes de liberar o acesso na plataforma."
        variant="admin"
        eyebrow=""
      />

      <Box className="grid grid-cols-1 xs:grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 xl:grid-cols-3">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box>
        <SubjectComponent
          description="Gerencie e cadastre novas disciplinas para todo o sistema"
          emptyStateDescription={
            subjectError ?? 'Cadastre uma nova disciplina para iniciar.'
          }
          emptyStateTitle="Nenhuma disciplina encontrada"
          items={subjects}
          onCreate={() => {
            setSubjectModalValues({ name: '', color: 'rgba(32, 109, 197, 1)' })
            setSubjectModalMode({ action: 'create' })
          }}
          renderItem={item => (
            <SubjectCard
              item={item}
              activitiesCount={uploadTotals.bySubject[item.id] ?? 0}
              onDelete={subject => {
                setSubjectModalMode({
                  action: 'delete',
                  subjectId: subject.id,
                  subjectName: subject.name,
                })
              }}
              onEdit={subject => {
                setSubjectModalValues({
                  name: subject.name,
                  color: subject.color ?? 'rgba(32, 109, 197, 1)',
                })
                setSubjectModalMode({
                  action: 'edit',
                  subjectId: subject.id,
                  subjectName: subject.name,
                })
              }}
            />
          )}
          role={role}
          title="Cadastro de disciplinas"
        />
      </Box>

      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        <ApprovalComponent
          currentPage={contentQueue.currentPage}
          description="Cadastre e mantenha conteúdos vinculados às disciplinas."
          emptyStateDescription={
            contentError ??
            'Tente outro filtro ou cadastre um novo conteúdo para iniciar a revisão.'
          }
          emptyStateTitle="Nenhum conteúdo encontrado"
          filterOptions={contentFilterOptions}
          items={contentQueue.items}
          onCreate={() =>
            openContentModal({ action: 'create', type: 'content' })
          }
          onEdit={() => toggleContentSelectionMode('edit')}
          onDelete={() => toggleContentSelectionMode('delete')}
          onItemSelect={handleContentItemSelect}
          selectionMode={contentSelectionMode}
          onPageChange={page => {
            startTransition(() => setContentQuery(q => ({ ...q, page })))
          }}
          onQueryChange={query => {
            startTransition(() =>
              setContentQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, query }))
            )
          }}
          onStatusChange={status => {
            startTransition(() =>
              setContentQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, status }))
            )
          }}
          query={contentQuery.query}
          renderItem={item => (
            <ContentCard
              actions={buildContentActions(item)}
              item={item}
              type="content"
            />
          )}
          resultsSummary={contentResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar conteúdos..."
          selectedStatus={contentQuery.status}
          title="Lista e Cadastro de Conteúdos"
          totalPages={contentQueue.totalPages}
        />

        <UploadApprovalComponent
          currentPage={uploadQueue.currentPage}
          description="Revise e corrija as atividades enviadas pelos alunos."
          emptyStateDescription={
            uploadError ?? 'Nenhuma atividade encontrado. Tente outro filtro.'
          }
          emptyStateTitle="Nenhum upload encontrado"
          filterOptions={uploadFilterOptions}
          items={uploadQueue.items}
          onEdit={() => toggleUploadSelectionMode('edit')}
          onDelete={() => toggleUploadSelectionMode('delete')}
          onItemSelect={handleUploadItemSelect}
          selectionMode={uploadSelectionMode}
          onPageChange={page => {
            startTransition(() => setUploadQuery(q => ({ ...q, page })))
          }}
          onQueryChange={query => {
            startTransition(() =>
              setUploadQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, query }))
            )
          }}
          onStatusChange={handleUploadFilterChange}
          query={uploadQuery.query}
          renderItem={item => (
            <UploadApprovalCard
              actions={buildUploadActions(item)}
              item={item}
              status={UPLOAD_APPROVAL_CARD_STATUS[item.status]}
            />
          )}
          resultsSummary={uploadResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar uploads..."
          selectedStatus={selectedUploadFilter}
          title="Atividades de Alunos"
          totalPages={uploadQueue.totalPages}
        />
      </Box>

      <ApprovalActionModal
        mode={contentModalState}
        disableConfirm={isContentModalConfirmDisabled}
        isSubmitting={isContentModalSubmitting}
        onChange={handleContentModalChange}
        onClose={resetContentModal}
        onConfirm={handleContentModalConfirm}
        open={contentModalState !== null}
        role={role}
        subjectOptions={subjectOptions}
        values={contentModalValues}
      />

      <UploadActionModal
        mode={uploadModalState}
        isSubmitting={isUploadModalSubmitting}
        onChange={handleUploadModalChange}
        onClose={resetUploadModal}
        onConfirm={handleUploadModalConfirm}
        open={uploadModalState !== null}
        role={role}
        values={uploadModalValues}
      />

      <SubjectActionModal
        mode={subjectModalMode}
        isSubmitting={isSubjectModalSubmitting}
        onChange={handleSubjectModalChange}
        onClose={resetSubjectModal}
        onConfirm={handleSubjectModalConfirm}
        open={subjectModalMode !== null}
        role={role}
        values={subjectModalValues}
      />
    </AppPageContainer>
  )
}
