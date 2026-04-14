import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
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
const DEFAULT_REQUESTED_AT = '09/04/2026'

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

function removeParentRequestFromQueue(
  queue: ApprovalQueueResult<ParentApprovalItem>,
  id: string
): ApprovalQueueResult<ParentApprovalItem> {
  const items = queue.items.filter(item => item.id !== id)

  if (items.length === queue.items.length) {
    return queue
  }

  const totalItems = Math.max(queue.totalItems - 1, 0)
  const totalPages = Math.max(Math.ceil(totalItems / queue.pageSize), 1)

  return {
    ...queue,
    currentPage: Math.min(queue.currentPage, totalPages),
    items,
    totalItems,
    totalPages,
  }
}

function getDefaultFormValues(): ApprovalActionFormValues {
  return {
    childName: '',
    email: '',
    password: '',
    requestedAt: DEFAULT_REQUESTED_AT,
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
  const [dismissedParentRequestIds] = useState<string[]>([])
  const [modalState, setModalState] = useState<ApprovalActionModalMode | null>(
    null
  )
  const [modalValues, setModalValues] = useState<ApprovalActionFormValues>(
    getDefaultFormValues()
  )
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)
  const [selectionMode, setSelectionMode] = useState<{
    action: 'edit' | 'delete'
    type: 'parent'
  } | null>(null)

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

  const toggleSelectionMode = useCallback((action: 'edit' | 'delete') => {
    setSelectionMode(current =>
      current?.action === action ? null : { action, type: 'parent' }
    )
  }, [])

  const handleParentItemSelect = useCallback(
    (item: ParentApprovalItem) => {
      if (!selectionMode || selectionMode.type !== 'parent') return

      setSelectionMode(null)
      setModalState({ action: selectionMode.action, item, type: 'parent' })
      setModalValues({
        childName: item.childName ?? '',
        email: '',
        password: '',
        requestedAt: item.requestedAt ?? DEFAULT_REQUESTED_AT,
        resourceType: 'task',
        subjectId: 'default',
        title: item.title ?? '',
      })
    },
    [selectionMode]
  )

  const openModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setModalState(nextMode)
    setModalValues({
      childName:
        nextMode.item?.kind === 'parent' ? (nextMode.item.childName ?? '') : '',
      email: '',
      password: '',
      requestedAt: nextMode.item?.requestedAt ?? DEFAULT_REQUESTED_AT,
      resourceType: 'task',
      subjectId: 'default',
      title: nextMode.item?.title ?? '',
    })
  }, [])

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
      theme.palette.error.main,
      theme.palette.success.main,
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
      if (modalState.action === 'create') {
        const payload: ParentApprovalDraftInput = {
          childName: modalValues.childName.trim(),
          email: modalValues.email.trim(),
          password: modalValues.password,
          requestedAt: modalValues.requestedAt,
          title: modalValues.title.trim(),
        }

        await parentApprovalService.createParentRegistration(payload)
        setParentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      if (modalState.action === 'edit' && modalState.item) {
        await parentApprovalService.updateLocalParentRegistration(
          modalState.item.id,
          {
            childName: modalValues.childName.trim(),
            requestedAt: modalValues.requestedAt,
            title: modalValues.title.trim(),
          }
        )
        setParentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      if (modalState.action === 'delete' && modalState.item) {
        await parentApprovalService.removeLocalParentRegistration(
          modalState.item.id
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

    if (!modalValues.title.trim()) {
      return true
    }

    if (modalState.action === 'create') {
      return !modalValues.email.trim() || !modalValues.password.trim()
    }

    return false
  }, [modalState, modalValues.email, modalValues.password, modalValues.title])

  useEffect(() => {
    let isActive = true

    async function loadParentQueue() {
      try {
        const nextParentQueue =
          await parentApprovalService.getParentQueue(resolvedParentQuery)

        const visibleParentQueue = dismissedParentRequestIds.reduce(
          removeParentRequestFromQueue,
          nextParentQueue
        )

        if (!isActive) {
          return
        }

        setParentError(null)
        setParentQueue(visibleParentQueue)
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
  }, [dismissedParentRequestIds, resolvedParentQuery, parentRefreshKey])

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
          gridTemplateColumns: '1fr 1fr',
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
          selectionMode={selectionMode?.action ?? null}
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
