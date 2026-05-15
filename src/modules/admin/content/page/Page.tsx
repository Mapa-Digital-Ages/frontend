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
  UploadApprovalItem,
  UploadApprovalQuery,
  UploadApprovalResult,
  UploadApprovalStatus,
  UploadEditFormValues,
} from '../types/upload'
import {
  ALL_SUBJECT_TAG_CONTEXTS,
  UPLOAD_APPROVAL_CARD_STATUS,
} from '@/shared/utils/themes'
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
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const contentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Em revisão', value: 'inReview' },
  { label: 'Correção em progresso', value: 'correctionInProgress' },
  { label: 'Enviado', value: 'sent' },
  { label: 'Aprovado', value: 'approved' },
  { label: 'Recusado', value: 'rejected' },
]

const uploadFilterOptions: UploadStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando revisão', value: 'pending' },
  { label: 'Em revisão', value: 'inReview' },
  { label: 'Correção em andamento', value: 'correctionInProgress' },
  { label: 'Corrigido', value: 'corrected' },
  { label: 'Rejeitado', value: 'rejected' },
]

const resourceTypeOptions = [
  { label: 'Tarefa', value: 'task' },
  { label: 'Prova', value: 'exam' },
] as const

const subjectOptions = ALL_SUBJECT_TAG_CONTEXTS.filter(
  subject => subject.id !== 'default'
).map(subject => ({
  label: subject.label,
  value: subject.id ?? subject.label,
}))

const DEFAULT_SUBJECT_ID =
  subjectOptions.find(s => s.value === 'mathematics')?.value ??
  subjectOptions[0]?.value ??
  'default'

const MOCK_SUBJECTS: SubjectItem[] = [
  {
    id: 'mathematics',
    name: 'Matemática',
    contentCount: 2,
    tasksCount: 1,
    trailsCount: 4,
    questionnaireCount: 2,
  },
  {
    id: 'portuguese',
    name: 'Português',
    contentCount: 2,
    tasksCount: 1,
    trailsCount: 1,
    questionnaireCount: 2,
  },
  {
    id: 'science',
    name: 'Ciências',
    contentCount: 2,
    tasksCount: 1,
    trailsCount: 2,
    questionnaireCount: 2,
  },
  {
    id: 'history',
    name: 'História',
    contentCount: 2,
    tasksCount: 1,
    trailsCount: 1,
    questionnaireCount: 2,
  },
]

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

function getDefaultContentFormValues(): ContentApprovalActionFormValues {
  return {
    type: 'content',
    requestedAt: getTodayRequestDate(),
    resourceType: 'task',
    subjectId: String(DEFAULT_SUBJECT_ID),
    title: '',
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

  const cards = [
    {
      id: 'subjects',
      title: 'Disciplinas',
      value: MOCK_SUBJECTS.length,
    },
    {
      id: 'contents',
      title: 'Conteúdos',
      value: MOCK_SUBJECTS.reduce((sum, s) => sum + s.contentCount, 0),
    },
    {
      id: 'tasks',
      title: 'Tarefas e provas',
      value: MOCK_SUBJECTS.reduce((sum, s) => sum + s.tasksCount, 0),
    },
  ]

  const getSubjectById = useCallback((subjectId: string) => {
    return (
      ALL_SUBJECT_TAG_CONTEXTS.find(s => (s.id ?? s.label) === subjectId) ??
      ALL_SUBJECT_TAG_CONTEXTS[0]
    )
  }, [])

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
      resetSubjectModal()
    } finally {
      setIsSubjectModalSubmitting(false)
    }
  }, [subjectModalMode, isSubjectModalSubmitting, resetSubjectModal])

  const resetContentModal = useCallback(() => {
    setContentModalState(null)
    setContentModalValues(getDefaultContentFormValues())
    setContentSelectionMode(null)
  }, [])

  const toggleContentSelectionMode = useCallback(
    (action: 'edit' | 'delete') => {
      setContentSelectionMode(current => (current === action ? null : action))
    },
    []
  )

  const openContentModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setContentModalState(nextMode)
    setContentModalValues({
      type: 'content',
      requestedAt:
        nextMode.action === 'create'
          ? getTodayRequestDate()
          : (nextMode.item?.requestedAt ?? getTodayRequestDate()),
      resourceType:
        nextMode.item?.kind === 'content'
          ? (nextMode.item.resourceType ?? 'task')
          : 'task',
      subjectId:
        nextMode.item?.kind === 'content'
          ? String(nextMode.item.subject?.id ?? DEFAULT_SUBJECT_ID)
          : String(DEFAULT_SUBJECT_ID),
      title: nextMode.item?.title ?? '',
    })
  }, [])

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
        resourceType: item.resourceType ?? 'task',
        subjectId: String(item.subject?.id ?? DEFAULT_SUBJECT_ID),
        title: item.title ?? '',
      })
    },
    [contentSelectionMode]
  )

  const handleContentModalChange = useCallback(
    (
      field:
        | keyof ContentApprovalActionFormValues
        | keyof GuardianApprovalActionFormValues,
      value: string | ContentApprovalDraftInput['resourceType']
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
        resourceType: contentModalValues.resourceType,
        subject: getSubjectById(contentModalValues.subjectId),
        title: contentModalValues.title || 'Novo conteúdo',
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
        uploadModalValues
      )
      setUploadRefreshKey(k => k + 1)
      resetUploadModal()
    } finally {
      setIsUploadModalSubmitting(false)
    }
  }, [
    uploadModalState,
    uploadModalValues,
    isUploadModalSubmitting,
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

  if (!isAdmin || role !== 'admin' || !hasLoadedContent || !hasLoadedUploads) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Conteúdos"
        subtitle="Revise conteúdos enviados e valide materiais antes de liberar o acesso na plataforma."
        variant="admin"
      />

      <Box className="grid grid-cols-1 xs:grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 xl:grid-cols-3">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box>
        <SubjectComponent
          description="Gerencie e cadastre novas disciplinas para todo o sistema"
          emptyStateDescription="Tente outro filtro ou cadastre uma nova disciplina."
          emptyStateTitle="Nenhuma disciplina encontrada"
          items={MOCK_SUBJECTS}
          onCreate={() => {
            setSubjectModalValues({ name: '', color: 'rgba(32, 109, 197, 1)' })
            setSubjectModalMode({ action: 'create' })
          }}
          renderItem={item => (
            <SubjectCard
              item={item}
              onDelete={subject => {
                setSubjectModalMode({
                  action: 'delete',
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
          description="Cadastre uma nova tarefa ou prova para revisão."
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
          description="Revise e corrija os uploads enviados pelos alunos."
          emptyStateDescription={
            uploadError ?? 'Nenhum upload encontrado. Tente outro filtro.'
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
          onStatusChange={status => {
            startTransition(() =>
              setUploadQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, status }))
            )
          }}
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
          selectedStatus={uploadQuery.status}
          title="Uploads de Alunos"
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
        resourceTypeOptions={[...resourceTypeOptions]}
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
