import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useUserRole } from '@/app/access/hook'
import { parentApprovalService } from '@/modules/admin/parent/services/runtime'
import { getParentApprovalEligibility } from '@/modules/admin/parent/utils/utils'
import type {
  ApprovalCardAction,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ApprovalResultsSummary,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import ApprovalActionModal, {
  type ApprovalActionFormValues,
  type ApprovalActionModalMode,
} from '../../shared/components/ApprovalActionModal'
import ApprovalCard from '../../shared/components/ApprovalCard'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from '../../shared/components/ApprovalComponent'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import PageHeader from '@/shared/ui/PageHeader'
import { PARENT_APPROVAL_CARD_STATUS } from '@/shared/utils/themes'

const DEFAULT_PAGE_INDEX = 1

const DEFAULT_QUERY: ApprovalQueueQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const parentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando validação', value: 'pendingValidation' },
  { label: 'Cadastro liberado', value: 'approved' },
  { label: 'Cadastro recusado', value: 'rejected' },
]

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

function getTodayRequestDate() {
  return new Intl.DateTimeFormat('pt-BR').format(new Date())
}

function getDefaultFormValues(): ApprovalActionFormValues {
  return {
    childName: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    requestedAt: getTodayRequestDate(),
    resourceType: 'task',
    subjectId: 'default',
    title: '',
  }
}

export default function Page() {
  const theme = useTheme()
  const { role, isAdmin } = useUserRole()

  const [parentQuery, setParentQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [parentQueue, setParentQueue] = useState<
    ApprovalQueueResult<ParentApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [parentError, setParentError] = useState<string | null>(null)
  const [hasLoadedParents, setHasLoadedParents] = useState(false)
  const [parentRefreshKey, setParentRefreshKey] = useState(0)
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

  const deferredParentSearch = useDeferredValue(parentQuery.query)

  const resolvedParentQuery = useMemo(
    () => buildResolvedQuery(parentQuery, deferredParentSearch),
    [parentQuery, deferredParentSearch]
  )

  const parentResultsSummary = useMemo(
    () => buildResultsSummary(parentQueue.totalItems),
    [parentQueue.totalItems]
  )

  const resetModal = useCallback(() => {
    setModalState(null)
    setModalValues(getDefaultFormValues())
    setSelectionMode(null)
  }, [])

  const openModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setSelectionMode(null)
    setModalState(nextMode)
    setModalValues({
      childName:
        nextMode.item?.kind === 'parent' ? (nextMode.item.childName ?? '') : '',
      email: '',
      first_name:
        nextMode.item?.kind === 'parent' ? nextMode.item.name.firstName : '',
      last_name:
        nextMode.item?.kind === 'parent' ? nextMode.item.name.lastName : '',
      password: '',
      requestedAt:
        nextMode.action === 'create'
          ? getTodayRequestDate()
          : (nextMode.item?.requestedAt ?? getTodayRequestDate()),
      resourceType: 'task',
      subjectId: 'default',
      title: nextMode.item?.title ?? '',
    })
  }, [])

  const toggleSelectionMode = useCallback((action: 'edit' | 'delete') => {
    setSelectionMode(current => (current === action ? null : action))
  }, [])

  const handleParentItemSelect = useCallback(
    (item: ParentApprovalItem) => {
      if (!selectionMode) return

      openModal({ action: selectionMode, item, type: 'parent' })
    },
    [openModal, selectionMode]
  )

  const handleParentStatusUpdate = useCallback(
    async (id: string, status: ParentApprovalStatus) => {
      await parentApprovalService.updateParentStatus(id, status)
      setParentRefreshKey(current => current + 1)
    },
    []
  )

  const buildParentActions = useCallback(
    (item: ParentApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const eligibility = getParentApprovalEligibility(item)

      return [
        {
          accentColor: theme.palette.warning.main,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-edit`,
          label: 'Editar responsável',
          onClick: () => {
            openModal({ action: 'edit', item, type: 'parent' })
          },
          priority: 'secondary',
          tooltip: 'Editar responsável',
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir responsável',
          onClick: () => {
            openModal({ action: 'delete', item, type: 'parent' })
          },
          priority: 'secondary',
          tooltip: 'Excluir responsável',
        },
        {
          accentColor: success,
          disabled: item.status === 'approved' || !eligibility.canApprove,
          icon: <CheckRoundedIcon />,
          id: `${item.id}-approve`,
          label: 'Validar cadastro',
          onClick: () => {
            void handleParentStatusUpdate(item.id, 'approved')
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
            void handleParentStatusUpdate(item.id, 'rejected')
          },
        },
      ]
    },
    [
      handleParentStatusUpdate,
      openModal,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ]
  )

  const handleModalChange = useCallback(
    (field: keyof ApprovalActionFormValues, value: string) => {
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
        await parentApprovalService.removeParentRegistration(modalState.item.id)
        setParentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      if (modalState.action === 'create') {
        const payload: ParentApprovalDraftInput = {
          email: modalValues.email.trim(),
          first_name: modalValues.first_name.trim(),
          last_name: modalValues.last_name.trim(),
          password: modalValues.password,
        }

        await parentApprovalService.createParentRegistration(payload)
        setParentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      if (modalState.action === 'edit' && modalState.item) {
        const payload: ParentApprovalDraftInput = {
          first_name: modalValues.first_name.trim(),
          last_name: modalValues.last_name.trim(),
        }

        await parentApprovalService.updateParentRegistration(
          modalState.item.id,
          payload
        )
        setParentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      resetModal()
    } finally {
      setIsModalSubmitting(false)
    }
  }, [isModalSubmitting, modalState, modalValues, resetModal])

  const isModalConfirmDisabled = useMemo(() => {
    if (!modalState || modalState.action === 'delete') {
      return false
    }

    if (!modalValues.first_name.trim() || !modalValues.last_name.trim()) {
      return true
    }

    if (modalState.action === 'create') {
      return !modalValues.email.trim() || !modalValues.password.trim()
    }

    return false
  }, [
    modalState,
    modalValues.email,
    modalValues.first_name,
    modalValues.last_name,
    modalValues.password,
  ])

  useEffect(() => {
    let isActive = true

    async function loadParentQueue() {
      try {
        const nextParentQueue =
          await parentApprovalService.getParentQueue(resolvedParentQuery)

        if (!isActive) {
          return
        }

        setParentError(null)
        setParentQueue(nextParentQueue)
      } catch {
        if (!isActive) {
          return
        }

        setParentError(
          'Nenhum responsável cadastrado. Cadastre um novo responsável para revisão.'
        )
        setParentQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      if (isActive) {
        setHasLoadedParents(true)
      }
    }

    void loadParentQueue()

    return () => {
      isActive = false
    }
  }, [resolvedParentQuery, parentRefreshKey])

  if (!isAdmin || role !== 'admin' || !hasLoadedParents) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="admin"
        title="Centro de Responsáveis"
        subtitle="Revise e valide responsáveis antes de liberar o acesso na plataforma."
      />

      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { md: 'minmax(0, 1fr)', xs: '1fr' },
        }}
      >
        <ApprovalComponent
          currentPage={parentQueue.currentPage}
          description="Valide e libere os cadastros de responsáveis."
          emptyStateDescription={
            parentError ??
            'Não há responsáveis aguardando aprovação no momento.'
          }
          emptyStateTitle="Nenhum responsável encontrado"
          filterOptions={parentFilterOptions}
          items={parentQueue.items}
          onCreate={() => {
            openModal({ action: 'create', type: 'parent' })
          }}
          onEdit={() => toggleSelectionMode('edit')}
          onDelete={() => toggleSelectionMode('delete')}
          onItemSelect={handleParentItemSelect}
          selectionMode={selectionMode}
          onPageChange={page => {
            startTransition(() => {
              setParentQuery(currentQuery => ({
                ...currentQuery,
                page,
              }))
            })
          }}
          onQueryChange={query => {
            startTransition(() => {
              setParentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                query,
              }))
            })
          }}
          onStatusChange={status => {
            startTransition(() => {
              setParentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                status,
              }))
            })
          }}
          query={parentQuery.query}
          renderItem={item => (
            <ApprovalCard
              actions={buildParentActions(item)}
              item={item}
              status={PARENT_APPROVAL_CARD_STATUS[item.status]}
              type="parent"
            />
          )}
          resultsSummary={parentResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar responsáveis..."
          selectedStatus={parentQuery.status}
          title="Validação e liberação de responsáveis"
          totalPages={parentQueue.totalPages}
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
        resourceTypeOptions={[]}
        role={role}
        subjectOptions={[]}
        values={modalValues}
      />
    </AppPageContainer>
  )
}
