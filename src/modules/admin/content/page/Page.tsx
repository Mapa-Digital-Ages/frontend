import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
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
import type {
  ApprovalCardAction,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ApprovalResultsSummary,
  ContentApprovalDraftInput,
  ContentApprovalItem,
  ContentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import {
  ALL_SUBJECT_TAG_CONTEXTS,
  CONTENT_APPROVAL_CARD_STATUS,
} from '@/shared/utils/themes'
import ApprovalActionModal, {
  type ApprovalActionFormValues,
  type ApprovalActionModalMode,
} from '@/modules/admin/shared/components/ApprovalActionModal'
import ApprovalCard from '@/modules/admin/shared/components/ApprovalCard'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from '@/modules/admin/shared/components/ApprovalComponent'

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_REQUESTED_AT = '09/04/2026'

const DEFAULT_QUERY: ApprovalQueueQuery = {
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
  subjectOptions.find(subject => subject.value === 'mathematics')?.value ??
  subjectOptions[0]?.value ??
  'default'

function emptyQueueResult<TItem>(pageSize: number): ApprovalQueueResult<TItem> {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function buildResultsSummary(count: number): ApprovalResultsSummary {
  return {
    count,
    pluralLabel: 'resultados',
    singularLabel: 'resultado',
  }
}

function getDefaultFormValues(): ApprovalActionFormValues {
  return {
    childName: '',
    email: '',
    password: '',
    requestedAt: DEFAULT_REQUESTED_AT,
    resourceType: 'task',
    subjectId: String(DEFAULT_SUBJECT_ID),
    title: '',
  }
}

export default function Page() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { role, isAdmin } = useUserRole()

  const [contentQuery, setContentQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [contentQueue, setContentQueue] = useState<
    ApprovalQueueResult<ContentApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [contentError, setContentError] = useState<string | null>(null)
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  const [contentRefreshKey, setContentRefreshKey] = useState(0)
  const [modalState, setModalState] = useState<ApprovalActionModalMode | null>(
    null
  )
  const [modalValues, setModalValues] = useState<ApprovalActionFormValues>(
    getDefaultFormValues()
  )
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)
  const [selectionMode, setSelectionMode] = useState<'edit' | 'delete' | null>(
    null
  )

  const deferredContentSearch = useDeferredValue(contentQuery.query)

  const resolvedContentQuery = useMemo(
    () => ({
      ...contentQuery,
      query: deferredContentSearch,
    }),
    [contentQuery, deferredContentSearch]
  )

  const contentResultsSummary = useMemo(
    () => buildResultsSummary(contentQueue.totalItems),
    [contentQueue.totalItems]
  )

  const getSubjectById = useCallback((subjectId: string) => {
    return (
      ALL_SUBJECT_TAG_CONTEXTS.find(
        subject => (subject.id ?? subject.label) === subjectId
      ) ?? ALL_SUBJECT_TAG_CONTEXTS[0]
    )
  }, [])

  const resetModal = useCallback(() => {
    setModalState(null)
    setModalValues(getDefaultFormValues())
    setSelectionMode(null)
  }, [])

  const toggleSelectionMode = useCallback((action: 'edit' | 'delete') => {
    setSelectionMode(current => (current === action ? null : action))
  }, [])

  const handleContentItemSelect = useCallback(
    (item: ContentApprovalItem) => {
      if (!selectionMode) return

      setSelectionMode(null)
      setModalState({ action: selectionMode, item, type: 'content' })
      setModalValues({
        childName: '',
        email: '',
        password: '',
        requestedAt: item.requestedAt ?? DEFAULT_REQUESTED_AT,
        resourceType: item.resourceType ?? 'task',
        subjectId: String(item.subject?.id ?? DEFAULT_SUBJECT_ID),
        title: item.title ?? '',
      })
    },
    [selectionMode]
  )

  const openModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setModalState(nextMode)
    setModalValues({
      childName: '',
      email: '',
      password: '',
      requestedAt: nextMode.item?.requestedAt ?? DEFAULT_REQUESTED_AT,
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

  const handleContentStatusUpdate = useCallback(
    async (id: string, status: ContentApprovalStatus) => {
      await contentApprovalService.updateContentStatus(id, status)
      setContentRefreshKey(current => current + 1)
    },
    []
  )

  const buildContentActions = useCallback(
    (item: ContentApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main
      const correctionRoute = buildAdminCorrectionRoute(item.id)

      return [
        {
          accentColor: warning,
          icon:
            item.status === 'approved' ? (
              <EditOutlinedIcon />
            ) : (
              <RuleFolderOutlinedIcon />
            ),
          id: `${item.id}-review`,
          label: 'Revisar conteúdo',
          onClick: () => {
            if (item.status === 'approved') {
              openModal({ action: 'edit', item, type: 'content' })
              return
            }
            navigate(correctionRoute)
          },
          priority: 'secondary',
          tooltip:
            item.status === 'approved'
              ? 'Editar conteúdo'
              : 'Corrigir atividade',
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir conteúdo',
          onClick: () => {
            openModal({ action: 'delete', item, type: 'content' })
          },
          priority: 'secondary',
          tooltip: 'Excluir conteúdo',
        },
        {
          accentColor: success,
          disabled: item.status === 'approved',
          icon: <CheckRoundedIcon />,
          id: `${item.id}-approve`,
          label: 'Validar conteúdo',
          onClick: () => {
            void handleContentStatusUpdate(item.id, 'approved')
          },
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <CancelOutlinedIcon />,
          id: `${item.id}-reject`,
          label: 'Rejeitar conteúdo',
          onClick: () => {
            void handleContentStatusUpdate(item.id, 'rejected')
          },
        },
      ]
    },
    [handleContentStatusUpdate, navigate, openModal, theme.palette]
  )

  const handleModalChange = useCallback(
    (
      field: keyof ApprovalActionFormValues,
      value: string | ContentApprovalDraftInput['resourceType']
    ) => {
      setModalValues(current => ({
        ...current,
        [field]: value,
      }))
    },
    []
  )

  const handleModalConfirm = useCallback(async () => {
    if (!modalState || isModalSubmitting) {
      return
    }

    setIsModalSubmitting(true)

    try {
      if (modalState.action === 'delete' && modalState.item) {
        await contentApprovalService.removeLocalContentItem(modalState.item.id)
        setContentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      const payload: ContentApprovalDraftInput = {
        requestedAt: modalValues.requestedAt,
        resourceType: modalValues.resourceType,
        subject: getSubjectById(modalValues.subjectId),
        title: modalValues.title || 'Novo conteúdo',
      }

      if (modalState.action === 'create') {
        await contentApprovalService.createLocalContentDraft(payload)
      } else if (modalState.item) {
        await contentApprovalService.updateLocalContentItem(
          modalState.item.id,
          payload
        )
      }

      setContentRefreshKey(current => current + 1)
      resetModal()
    } finally {
      setIsModalSubmitting(false)
    }
  }, [getSubjectById, isModalSubmitting, modalState, modalValues, resetModal])

  const isModalConfirmDisabled = useMemo(() => {
    if (!modalState || modalState.action === 'delete') {
      return false
    }

    return !modalValues.title.trim()
  }, [modalState, modalValues.title])

  useEffect(() => {
    let isActive = true

    async function loadContentQueue() {
      try {
        const nextContentQueue =
          await contentApprovalService.getContentQueue(resolvedContentQuery)

        if (!isActive) {
          return
        }

        setContentError(null)
        setContentQueue(nextContentQueue)
      } catch {
        if (!isActive) {
          return
        }

        setContentError(
          'Nenhum conteúdo cadastrado. Cadastre um novo conteúdo para revisão.'
        )
        setContentQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      if (isActive) {
        setHasLoadedContent(true)
      }
    }

    void loadContentQueue()

    return () => {
      isActive = false
    }
  }, [resolvedContentQuery, contentRefreshKey])

  if (!isAdmin || role !== 'admin' || !hasLoadedContent) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="admin"
        title="Conteúdos"
        subtitle="Revise conteúdos enviados e valide materiais antes de liberar o acesso na plataforma."
      />

      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: '1fr 1fr',
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
          onCreate={() => {
            openModal({ action: 'create', type: 'content' })
          }}
          onEdit={() => toggleSelectionMode('edit')}
          onDelete={() => toggleSelectionMode('delete')}
          onItemSelect={handleContentItemSelect}
          selectionMode={selectionMode}
          onPageChange={page => {
            startTransition(() => {
              setContentQuery(currentQuery => ({
                ...currentQuery,
                page,
              }))
            })
          }}
          onQueryChange={query => {
            startTransition(() => {
              setContentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                query,
              }))
            })
          }}
          onStatusChange={status => {
            startTransition(() => {
              setContentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                status,
              }))
            })
          }}
          query={contentQuery.query}
          renderItem={item => (
            <ApprovalCard
              actions={buildContentActions(item)}
              item={item}
              status={CONTENT_APPROVAL_CARD_STATUS[item.status]}
              type="content"
            />
          )}
          resultsSummary={contentResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar tarefas e provas..."
          selectedStatus={contentQuery.status}
          title="Cadastro e Aprovação de atividades"
          totalPages={contentQueue.totalPages}
        />
      </Box>

      <ApprovalActionModal
        mode={modalState}
        disableConfirm={isModalConfirmDisabled}
        isSubmitting={isModalSubmitting}
        onChange={handleModalChange}
        onClose={resetModal}
        onConfirm={handleModalConfirm}
        open={modalState !== null}
        resourceTypeOptions={[...resourceTypeOptions]}
        role={role}
        subjectOptions={subjectOptions}
        values={modalValues}
      />
    </AppPageContainer>
  )
}
