import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  ReactNode,
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
  ApprovalStatus,
  ContentApprovalDraftInput,
  ContentApprovalItem,
  ContentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import {
  ALL_SUBJECT_TAG_CONTEXTS,
  CONTENT_APPROVAL_CARD_STATUS,
} from '@/shared/utils/themes'
import ApprovalActionModal, {
  type ApprovalActionModalMode,
} from '@/modules/admin/shared/components/ApprovalActionModal'
import type {
  ContentApprovalActionFormValues,
  GuardianApprovalActionFormValues,
} from '@/modules/admin/shared/types/types'
import ApprovalCard from '@/modules/admin/shared/components/ApprovalCard'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from '@/modules/admin/shared/components/ApprovalComponent'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import ContentCard from '../components/ContentCard'
import MetricsCard from '@/shared/ui/MetricsCard'
import { IconVariantName } from '@/app/theme/core/palette'
import type { Stat } from '@/shared/types/common'
import { adminService } from '../../dashboard/services/service'
import { Subject } from '@mui/icons-material'
import SubjectComponent from '../components/SubjectComponent'
import SubjectCard from '../components/SubjectCard'

const DEFAULT_PAGE_INDEX = 1

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

function getTodayRequestDate() {
  return new Intl.DateTimeFormat('pt-BR').format(new Date())
}

function getDefaultFormValues(): ContentApprovalActionFormValues {
  return {
    type: 'content',
    requestedAt: getTodayRequestDate(),
    resourceType: 'task',
    subjectId: String(DEFAULT_SUBJECT_ID),
    title: '',
  }
}

export default function Page() {
  const theme = useTheme()
  const [stats, setStats] = useState<Stat[]>([])
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
  const [modalValues, setModalValues] =
    useState<ContentApprovalActionFormValues>(getDefaultFormValues())
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
        type: 'content',
        requestedAt: item.requestedAt ?? getTodayRequestDate(),
        resourceType: item.resourceType ?? 'task',
        subjectId: String(item.subject?.id ?? DEFAULT_SUBJECT_ID),
        title: item.title ?? '',
      })
    },
    [selectionMode]
  )
  const getStatById = (id: Stat['id']) => stats.find(stat => stat.id === id)
  const contents = getStatById('contents')
  const task = getStatById('task')
  const subjects = getStatById('subjects')

  const cards = [
    {
      helperColor: theme.palette.text.secondary,
      id: 'contents',
      title: 'Conteúdos',
      value: contents?.value,
    },
    {
      helperColor: theme.palette.error.main,
      id: 'task',
      title: 'Tarefas e provas em Revisão',
      value: task?.value,
    },
    {
      helperColor: theme.palette.text.secondary,
      id: 'subjects',
      title: 'Disciplinas',
      value: subjects?.value,
    },
  ]

  const openModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setModalState(nextMode)
    setModalValues({
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

  const handleContentStatusUpdate = useCallback(
    async (id: string, status: ContentApprovalStatus) => {
      await contentApprovalService.updateContentStatus(id, status)
      setContentRefreshKey(current => current + 1)
    },
    []
  )

  const buildActivityActions = useCallback(
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
          label: 'Revisar atividade',
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
              ? 'Editar atividade'
              : 'Corrigir atividade',
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir atividade',
          onClick: () => {
            openModal({ action: 'delete', item, type: 'content' })
          },
          priority: 'secondary',
          tooltip: 'Excluir atividade',
        },
        {
          accentColor: success,
          disabled: item.status === 'approved',
          icon: <CheckRoundedIcon />,
          id: `${item.id}-approve`,
          label: 'Validar atividade',
          onClick: () => {
            void handleContentStatusUpdate(item.id, 'approved')
          },
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <CancelOutlinedIcon />,
          id: `${item.id}-reject`,
          label: 'Rejeitar atividade',
          onClick: () => {
            void handleContentStatusUpdate(item.id, 'rejected')
          },
        },
      ]
    },
    [handleContentStatusUpdate, navigate, openModal, theme.palette]
  )

  const buildContentActions = useCallback(
    (item: ContentApprovalItem): ApprovalCardAction[] => {
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main

      return [
        {
          accentColor: warning,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-review`,
          label: 'Editar Conteúdo',
          onClick: () => {
            openModal({ action: 'edit', item, type: 'content' })
          },
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-reject`,
          label: 'Excluir Conteúdo',
          onClick: () => {
            openModal({ action: 'delete', item, type: 'content' })
          },
        },
      ]
    },
    [openModal, theme.palette]
  )

  const buildSubjectActions = useCallback(
    (item: ContentApprovalItem): ApprovalCardAction[] => {
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main

      return [
        {
          accentColor: warning,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-review`,
          label: 'Editar Disciplina',
          onClick: () => {
            openModal({ action: 'edit', item, type: 'content' })
          },
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-reject`,
          label: 'Excluir Disciplina',
          onClick: () => {
            openModal({ action: 'delete', item, type: 'content' })
          },
        },
      ]
    },
    [openModal, theme.palette]
  )

  const handleModalChange = useCallback(
    (
      field:
        | keyof ContentApprovalActionFormValues
        | keyof GuardianApprovalActionFormValues,
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
        const nextStats = await adminService.getStats()
        const nextContentQueue =
          await contentApprovalService.getContentQueue(resolvedContentQuery)

        if (!isActive) {
          return
        }
        setStats(nextStats)
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
        title="Conteúdos"
        subtitle="Revise conteúdos enviados e valide materiais antes de liberar o acesso na plataforma."
        variant="admin"
      />

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-3">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box>
        <SubjectComponent
          description="As disciplinas cadastradas passam a aparecer nos formulários de conteúdo, trilha, avaliação e nivelamento."
          emptyStateDescription={
            contentError ??
            'Tente outro filtro ou cadastre um novo conteúdo para iniciar a revisão.'
          }
          emptyStateTitle="Nenhum conteúdo encontrado"
          items={contentQueue.items}
          onCreate={() => {
            openModal({ action: 'create', type: 'content' })
          }}
          onEdit={() => toggleSelectionMode('edit')}
          onDelete={() => toggleSelectionMode('delete')}
          onItemSelect={handleContentItemSelect}
          selectionMode={selectionMode}
          renderItem={item => (
            <SubjectCard actions={buildSubjectActions(item)} item={item} />
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
            <ContentCard
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
          title="Lista e Cadastro de Conteúdos"
          totalPages={contentQueue.totalPages}
        />
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
              actions={buildActivityActions(item)}
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
