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
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { buildAdminCorrectionRoute } from '@/constants/routes'
import { useUserRole } from '@/hooks/useUserRole'
import { adminApprovalService } from '@/services/admin/admin-approval.runtime'
import type {
  ApprovalCardAction,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ApprovalResultsSummary,
  ContentApprovalDraftInput,
  ContentApprovalItem,
  ContentApprovalStatus,
  GuardianApprovalDraftInput,
  GuardianApprovalItem,
  GuardianApprovalStatus,
} from '@/types/admin'
import { ALL_SUBJECT_TAG_CONTEXTS } from '@/utils/themes'
import ApprovalActionModal, {
  type ApprovalActionFormValues,
  type ApprovalActionModalMode,
} from './components/ApprovalActionModal'
import ApprovalCard from './components/ApprovalCard'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from './components/ApprovalComponent'
import { getGuardianApprovalEligibility } from './components/approvalQueue.utils'
import {
  CONTENT_APPROVAL_CARD_STATUS,
  GUARDIAN_APPROVAL_CARD_STATUS,
} from '@/utils/themes'

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

const guardianFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando validação', value: 'pendingValidation' },
  { label: 'Cadastro liberado', value: 'approved' },
  { label: 'Cadastro recusado', value: 'rejected' },
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

function buildResolvedQuery(query: ApprovalQueueQuery, deferredQuery: string) {
  return {
    ...query,
    query: deferredQuery,
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
    requestedAt: DEFAULT_REQUESTED_AT,
    resourceType: 'task',
    subjectId: String(DEFAULT_SUBJECT_ID),
    title: '',
  }
}

function AdminApprovalsPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { role, isAdmin } = useUserRole()
  const [contentQuery, setContentQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [guardianQuery, setGuardianQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [contentQueue, setContentQueue] = useState<
    ApprovalQueueResult<ContentApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [guardianQueue, setGuardianQueue] = useState<
    ApprovalQueueResult<GuardianApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [contentError, setContentError] = useState<string | null>(null)
  const [guardianError, setGuardianError] = useState<string | null>(null)
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  const [hasLoadedGuardians, setHasLoadedGuardians] = useState(false)
  const [contentRefreshKey, setContentRefreshKey] = useState(0)
  const [guardianRefreshKey, setGuardianRefreshKey] = useState(0)
  const [modalState, setModalState] = useState<ApprovalActionModalMode | null>(
    null
  )
  const [modalValues, setModalValues] = useState<ApprovalActionFormValues>(
    getDefaultFormValues()
  )
  const deferredContentSearch = useDeferredValue(contentQuery.query)
  const deferredGuardianSearch = useDeferredValue(guardianQuery.query)
  const resolvedContentQuery = useMemo(
    () => buildResolvedQuery(contentQuery, deferredContentSearch),
    [contentQuery, deferredContentSearch]
  )
  const resolvedGuardianQuery = useMemo(
    () => buildResolvedQuery(guardianQuery, deferredGuardianSearch),
    [guardianQuery, deferredGuardianSearch]
  )

  const contentResultsSummary = useMemo(
    () => buildResultsSummary(contentQueue.totalItems),
    [contentQueue.totalItems]
  )
  const guardianResultsSummary = useMemo(
    () => buildResultsSummary(guardianQueue.totalItems),
    [guardianQueue.totalItems]
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
  }, [])

  const openModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setModalState(nextMode)
    setModalValues({
      childName:
        nextMode.item?.kind === 'guardian' ? nextMode.item.childName : '',
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
      await adminApprovalService.updateContentStatus(id, status)
      setContentRefreshKey(current => current + 1)
    },
    []
  )

  const handleGuardianStatusUpdate = useCallback(
    async (id: string, status: GuardianApprovalStatus) => {
      await adminApprovalService.updateGuardianStatus(id, status)
      setGuardianRefreshKey(current => current + 1)
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

  const buildGuardianActions = useCallback(
    (item: GuardianApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const neutral = theme.palette.text.primary
      const eligibility = getGuardianApprovalEligibility(item)

      return [
        {
          accentColor: neutral,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-review`,
          label: 'Revisão de cadastro',
          onClick: () => {
            openModal({ action: 'edit', item, type: 'guardian' })
          },
          priority: 'secondary',
        },
        {
          accentColor: success,
          disabled: item.status === 'approved' || !eligibility.canApprove,
          icon: <CheckRoundedIcon />,
          id: `${item.id}-approve`,
          label: 'Validar cadastro',
          onClick: () => {
            void handleGuardianStatusUpdate(item.id, 'approved')
          },
          tooltip: eligibility.canApprove
            ? 'Validar cadastro'
            : `Pendências: ${eligibility.missingRequirements.join(', ')}`,
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <CancelOutlinedIcon />,
          id: `${item.id}-reject`,
          label: 'Rejeitar cadastro',
          onClick: () => {
            void handleGuardianStatusUpdate(item.id, 'rejected')
          },
        },
      ]
    },
    [handleGuardianStatusUpdate, openModal, theme.palette]
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
    if (!modalState) {
      return
    }

    if (modalState.type === 'content') {
      if (modalState.action === 'delete' && modalState.item) {
        await adminApprovalService.removeLocalContentItem(modalState.item.id)
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
        await adminApprovalService.createLocalContentDraft(payload)
      } else if (modalState.item) {
        await adminApprovalService.updateLocalContentItem(
          modalState.item.id,
          payload
        )
      }

      setContentRefreshKey(current => current + 1)
      resetModal()
      return
    }

    if (modalState.action === 'delete' && modalState.item) {
      await adminApprovalService.removeLocalGuardianItem(modalState.item.id)
      setGuardianRefreshKey(current => current + 1)
      resetModal()
      return
    }

    const payload: GuardianApprovalDraftInput = {
      childName: modalValues.childName || 'Aluno a confirmar',
      requestedAt: modalValues.requestedAt,
      roleLabel: 'Responsável',
      title: modalValues.title || 'Novo responsável',
    }

    if (modalState.action === 'create') {
      await adminApprovalService.createLocalGuardianDraft(payload)
    } else if (modalState.item) {
      await adminApprovalService.updateLocalGuardianItem(
        modalState.item.id,
        payload
      )
    }

    setGuardianRefreshKey(current => current + 1)
    resetModal()
  }, [getSubjectById, modalState, modalValues, resetModal])

  useEffect(() => {
    let isActive = true

    async function loadContentQueue() {
      try {
        const nextContentQueue =
          await adminApprovalService.getContentQueue(resolvedContentQuery)

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
          'Não foi possível carregar a fila de conteúdos. Verifique o contrato da API ou tente novamente.'
        )
        setContentQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      setHasLoadedContent(true)
    }

    void loadContentQueue()

    return () => {
      isActive = false
    }
  }, [resolvedContentQuery, contentRefreshKey])

  useEffect(() => {
    let isActive = true

    async function loadGuardianQueue() {
      try {
        const nextGuardianQueue = await adminApprovalService.getGuardianQueue(
          resolvedGuardianQuery
        )

        if (!isActive) {
          return
        }

        setGuardianError(null)
        setGuardianQueue(nextGuardianQueue)
      } catch {
        if (!isActive) {
          return
        }

        setGuardianError(
          'Não foi possível carregar a fila de responsáveis. Verifique o contrato da API ou tente novamente.'
        )
        setGuardianQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      setHasLoadedGuardians(true)
    }

    void loadGuardianQueue()

    return () => {
      isActive = false
    }
  }, [resolvedGuardianQuery, guardianRefreshKey])

  if (
    !isAdmin ||
    role !== 'admin' ||
    !hasLoadedContent ||
    !hasLoadedGuardians
  ) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="admin"
        title="Centro de Aprovações"
        subtitle="Revise conteúdos enviados e valide responsáveis antes de liberar o acesso na plataforma."
      />

      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: 2,
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 32rem), 1fr))',
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

        <ApprovalComponent
          currentPage={guardianQueue.currentPage}
          description="Valide e libere os cadastros de responsáveis."
          emptyStateDescription={
            guardianError ??
            'Nenhuma solicitação bate com os filtros atuais. Cadastre um novo responsável ou ajuste a busca.'
          }
          emptyStateTitle="Nenhum responsável encontrado"
          filterOptions={guardianFilterOptions}
          items={guardianQueue.items}
          onCreate={() => {
            openModal({ action: 'create', type: 'guardian' })
          }}
          onPageChange={page => {
            startTransition(() => {
              setGuardianQuery(currentQuery => ({
                ...currentQuery,
                page,
              }))
            })
          }}
          onQueryChange={query => {
            startTransition(() => {
              setGuardianQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                query,
              }))
            })
          }}
          onStatusChange={status => {
            startTransition(() => {
              setGuardianQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                status,
              }))
            })
          }}
          query={guardianQuery.query}
          renderItem={item => (
            <ApprovalCard
              actions={buildGuardianActions(item)}
              item={item}
              status={GUARDIAN_APPROVAL_CARD_STATUS[item.status]}
              type="guardian"
            />
          )}
          resultsSummary={guardianResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar responsáveis..."
          selectedStatus={guardianQuery.status}
          title="Validação e liberação de responsáveis"
          totalPages={guardianQueue.totalPages}
        />
      </Box>

      <ApprovalActionModal
        mode={modalState}
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

export default AdminApprovalsPage
