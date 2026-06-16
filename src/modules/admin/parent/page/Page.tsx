import { HttpRequestError } from '@/shared/lib/http/client'
import { useUserRole } from '@/app/access/hook'
import { AppColors } from '@/app/theme/core/colors'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import { AppTag } from '@/shared/ui/AppTags'
import type { TagContext } from '@/shared/types/common'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'
import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { parentApprovalService } from '@/modules/admin/parent/services/runtime'
import type {
  ApprovalQueueQuery,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'

type SortField = 'name' | 'child'
type SortDirection = 'asc' | 'desc'

interface SortState {
  field: SortField | null
  direction: SortDirection
}

const PAGE_SIZE = 10

const labelSx = {
  fontWeight: 600,
  fontSize: 14,
  mb: 1,
  color: 'text.primary',
}

const headerTextSx = {
  color: 'text.secondary',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
} as const

const parentFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando validação', value: 'pendingValidation' },
  { label: 'Cadastro liberado', value: 'approved' },
  { label: 'Cadastro recusado', value: 'rejected' },
]

function getEmptyParentForm() {
  return {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  }
}

function getParentName(item: ParentApprovalItem): string {
  const guardian = item.guardian
  return (
    [guardian?.first_name, guardian?.last_name].filter(Boolean).join(' ') || '—'
  )
}

function sortParents(items: ParentApprovalItem[], sort: SortState) {
  if (!sort.field) return items
  return [...items].sort((a, b) => {
    let comparison = 0
    if (sort.field === 'name') {
      comparison = getParentName(a).localeCompare(getParentName(b), 'pt-BR')
    } else if (sort.field === 'child') {
      comparison = (a.childName ?? '').localeCompare(b.childName ?? '', 'pt-BR')
    }
    return sort.direction === 'asc' ? comparison : -comparison
  })
}

function SortableHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string
  field: SortField
  sort: SortState
  onSort: (field: SortField) => void
}) {
  const isActive = sort.field === field
  const theme = useTheme()

  return (
    <Box
      onClick={() => onSort(field)}
      sx={{
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
        gap: 0.5,
        userSelect: 'none',
        '&:hover .sort-label': { color: 'text.primary' },
      }}
    >
      <Typography
        className="sort-label"
        sx={{
          color: isActive ? 'text.primary' : 'text.secondary',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'color 0.15s',
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          color: isActive ? theme.palette.error.main : 'text.disabled',
          display: 'flex',
          fontSize: 14,
        }}
      >
        {!isActive ? (
          <UnfoldMoreRoundedIcon sx={{ fontSize: 14 }} />
        ) : sort.direction === 'asc' ? (
          <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} />
        ) : (
          <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />
        )}
      </Box>
    </Box>
  )
}

export default function Page() {
  const theme = useTheme()
  const { role, isAdmin } = useUserRole()
  const canView = isAdmin && role === 'admin'

  const statusConfig: Record<string, TagContext> = {
    pendingValidation: {
      label: 'Aguardando validação',
      color: theme.palette.warning.main,
    },
    approved: { label: 'Cadastro liberado', color: theme.palette.success.main },
    rejected: { label: 'Cadastro recusado', color: theme.palette.error.main },
  }

  const [parents, setParents] = useState<ParentApprovalItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [inputQuery, setInputQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [refreshKey, setRefreshKey] = useState(0)
  const [sort, setSort] = useState<SortState>({ field: null, direction: 'asc' })

  // Create / edit modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingParentId, setEditingParentId] = useState<string | null>(null)
  const [parentForm, setParentForm] = useState(getEmptyParentForm())
  const [formApiError, setFormApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal
  const [parentToDeleteId, setParentToDeleteId] = useState<string | null>(null)

  // Row menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)

  // Batch modal
  const [isBatchOpen, setIsBatchOpen] = useState(false)
  const [batchFile, setBatchFile] = useState<File | null>(null)
  const [batchSuccess, setBatchSuccess] = useState(false)

  const activePageRef = useRef(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isFetchingMoreRef = useRef(false)
  const isLoadingRef = useRef(true)
  const hasMoreRef = useRef(true)
  const activeQueryRef = useRef('')
  const activeStatusRef = useRef('all')

  useEffect(() => {
    isFetchingMoreRef.current = isFetchingMore
  })
  useEffect(() => {
    isLoadingRef.current = isLoading
  })
  useEffect(() => {
    hasMoreRef.current = hasMore
  })
  useEffect(() => {
    activeQueryRef.current = activeQuery
  }, [activeQuery])
  useEffect(() => {
    activeStatusRef.current = statusFilter
  }, [statusFilter])

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => setActiveQuery(inputQuery), 350)
    return () => clearTimeout(timer)
  }, [inputQuery])

  // First page fetch
  useEffect(() => {
    if (!canView) return
    activePageRef.current = 1
    let active = true

    async function fetchFirstPage() {
      setParents([])
      setHasMore(true)
      setIsLoading(true)
      try {
        const result = await parentApprovalService.getParentQueue({
          page: 1,
          pageSize: PAGE_SIZE,
          query: activeQuery,
          status: statusFilter,
        } as ApprovalQueueQuery)
        if (!active) return
        setParents(result.items)
        setTotal(result.totalItems)
        setHasMore(result.currentPage < result.totalPages)
      } catch {
        if (!active) return
        setParents([])
        setTotal(0)
        setHasMore(false)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void fetchFirstPage()
    return () => {
      active = false
    }
  }, [activeQuery, statusFilter, refreshKey, canView])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    function loadMore() {
      if (
        isFetchingMoreRef.current ||
        isLoadingRef.current ||
        !hasMoreRef.current
      )
        return
      const nextPage = activePageRef.current + 1
      activePageRef.current = nextPage
      setIsFetchingMore(true)

      void parentApprovalService
        .getParentQueue({
          page: nextPage,
          pageSize: PAGE_SIZE,
          query: activeQueryRef.current,
          status: activeStatusRef.current,
        } as ApprovalQueueQuery)
        .then(result => {
          setParents(prev => [...prev, ...result.items])
          setHasMore(result.currentPage < result.totalPages)
        })
        .catch(() => setHasMore(false))
        .finally(() => setIsFetchingMore(false))
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [canView])

  const sortedParents = useMemo(
    () => sortParents(parents, sort),
    [parents, sort]
  )

  const pendingCount = useMemo(
    () => parents.filter(p => p.status === 'pendingValidation').length,
    [parents]
  )

  const selectedParent = parents.find(p => p.id === selectedParentId)

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    parentForm.email.trim()
  )

  const canSaveParent =
    parentForm.first_name.trim() !== '' &&
    parentForm.last_name.trim() !== '' &&
    parentForm.phone_number.trim() !== '' &&
    emailIsValid &&
    (editingParentId !== null || parentForm.password.trim() !== '')

  function handleSort(field: SortField) {
    setSort(current => ({
      field,
      direction:
        current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  function openCreateModal() {
    setEditingParentId(null)
    setParentForm(getEmptyParentForm())
    setFormApiError(null)
    setIsFormModalOpen(true)
  }

  function openEditModal() {
    if (!selectedParent) return
    setEditingParentId(selectedParent.id)
    setParentForm({
      first_name: selectedParent.guardian?.first_name ?? '',
      last_name: selectedParent.guardian?.last_name ?? '',
      email: selectedParent.guardian?.email ?? '',
      phone_number: selectedParent.guardian?.phone_number ?? '',
      password: '',
    })
    setFormApiError(null)
    setIsFormModalOpen(true)
  }

  async function handleSaveParent() {
    if (!canSaveParent || isSubmitting) return
    setIsSubmitting(true)
    setFormApiError(null)
    try {
      if (editingParentId) {
        const payload: ParentApprovalDraftInput = {
          guardian: {
            email: parentForm.email.trim(),
            first_name: parentForm.first_name.trim(),
            last_name: parentForm.last_name.trim(),
            phone_number: parentForm.phone_number.trim(),
          },
        }
        await parentApprovalService.updateParentRegistration(
          editingParentId,
          payload
        )
      } else {
        const payload: ParentApprovalDraftInput = {
          guardian: {
            email: parentForm.email.trim(),
            first_name: parentForm.first_name.trim(),
            last_name: parentForm.last_name.trim(),
            password: parentForm.password,
            phone_number: parentForm.phone_number.trim(),
          },
        }
        await parentApprovalService.createParentRegistration(payload)
      }
      setIsFormModalOpen(false)
      setParentForm(getEmptyParentForm())
      setEditingParentId(null)
      setRefreshKey(k => k + 1)
    } catch (err) {
      let message = 'Não foi possível salvar o cadastro. Tente novamente.'
      if (err instanceof HttpRequestError && err.response) {
        try {
          const body = (await err.response.json()) as {
            detail?: string
            message?: string
          }
          const apiMessage = (body.detail ?? body.message ?? '').toLowerCase()
          if (apiMessage.includes('email')) {
            message = 'Este e-mail já está cadastrado no sistema.'
          } else if (apiMessage) {
            message = apiMessage
          }
        } catch {
          /* ignora */
        }
      }
      setFormApiError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteParent(id: string) {
    try {
      await parentApprovalService.removeParentRegistration(id)
      setRefreshKey(k => k + 1)
    } catch (error) {
      console.error('Erro ao remover responsável:', error)
    }
  }

  async function handleStatusUpdate(id: string, status: ParentApprovalStatus) {
    try {
      await parentApprovalService.updateParentStatus(id, status)
      setRefreshKey(k => k + 1)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const headerActions = (
    <Button
      data-testid="create-parent-button"
      onClick={openCreateModal}
      startIcon={<AddRoundedIcon />}
      variant="contained"
      disableElevation
      sx={{
        backgroundColor: AppColors.role.admin.secondary,
        borderRadius: '10px',
        fontWeight: '700',
        px: 2.5,
        textTransform: 'none',
        '&:hover': { backgroundColor: theme.palette.error.dark },
      }}
    >
      Cadastrar responsável
    </Button>
  )

  const cards = [
    { id: 'total', title: 'Total de responsáveis', value: String(total) },
    {
      id: 'pending',
      title: 'Aguardando validação',
      value: String(pendingCount),
    },
  ]

  if (!canView) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        data-testid="parents-page-header"
        title="Centro de Responsáveis"
        subtitle="Revise e valide responsáveis antes de liberar o acesso na plataforma."
        variant="admin"
      />

      <OrdinaryHeader
        title="Validação e liberação de responsáveis"
        subtitle="Valide e libere os cadastros de responsáveis."
        actions={headerActions}
      />

      {/* Create / edit modal */}
      <AppActionModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setFormApiError(null)
          setEditingParentId(null)
          setParentForm(getEmptyParentForm())
        }}
        title={editingParentId ? 'Editar responsável' : 'Cadastrar responsável'}
        description="Preencha os dados usados para o fluxo de liberação do responsável."
        onConfirm={() => {
          void handleSaveParent()
        }}
        confirmLabel={editingParentId ? 'Salvar alterações' : 'Salvar cadastro'}
        cancelLabel="Cancelar"
        confirmColor={AppColors.role.admin.secondary}
        confirmHoverColor={theme.palette.error.dark}
        disableConfirm={!canSaveParent || isSubmitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {!editingParentId && (
            <>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<UploadFileRoundedIcon />}
                onClick={() => {
                  setIsFormModalOpen(false)
                  setIsBatchOpen(true)
                }}
                sx={{
                  borderColor: alpha(AppColors.role.admin.secondary, 0.4),
                  color: AppColors.role.admin.secondary,
                  borderRadius: '10px',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 1,
                  '&:hover': {
                    borderColor: AppColors.role.admin.secondary,
                    backgroundColor: alpha(
                      AppColors.role.admin.secondary,
                      0.05
                    ),
                  },
                }}
              >
                Cadastrar em lote
              </Button>
              <Box
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'background.border',
                  mt: 0.5,
                }}
              />
            </>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={labelSx}>Nome</Typography>
              <AppInput
                data-testid="parent-first-name"
                placeholder="Ex.: Mariana"
                value={parentForm.first_name}
                onChange={e =>
                  setParentForm(prev => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
              />
            </Box>
            <Box>
              <Typography sx={labelSx}>Sobrenome</Typography>
              <AppInput
                data-testid="parent-last-name"
                placeholder="Ex.: Souza"
                value={parentForm.last_name}
                onChange={e =>
                  setParentForm(prev => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={labelSx}>E-mail do responsável</Typography>
            <AppInput
              data-testid="parent-email"
              placeholder="Ex.: m.souza@email.com"
              type="email"
              value={parentForm.email}
              onChange={e =>
                setParentForm(prev => ({ ...prev, email: e.target.value }))
              }
              error={Boolean(parentForm.email && !emailIsValid)}
              helperText={
                parentForm.email && !emailIsValid
                  ? 'Digite um e-mail válido com @ e domínio.'
                  : undefined
              }
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>Telefone</Typography>
            <AppInput
              data-testid="parent-phone"
              placeholder="Ex.: +55 51 98765-4321"
              value={parentForm.phone_number}
              onChange={e =>
                setParentForm(prev => ({
                  ...prev,
                  phone_number: e.target.value,
                }))
              }
            />
          </Box>

          {!editingParentId && (
            <Box>
              <Typography sx={labelSx}>Senha provisória</Typography>
              <AppInput
                data-testid="parent-password"
                placeholder="Defina uma senha inicial"
                type="password"
                value={parentForm.password}
                onChange={e =>
                  setParentForm(prev => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </Box>
          )}

          {formApiError && (
            <Box
              sx={{
                borderRadius: '10px',
                color: 'error.main',
                fontSize: { md: 13, xs: 12 },
                fontWeight: 600,
                px: 1,
                py: 0.5,
              }}
            >
              ✕ {formApiError}
            </Box>
          )}
        </Box>
      </AppActionModal>

      {/* Batch parent upload modal */}
      <AppActionModal
        open={isBatchOpen}
        onClose={() => {
          setIsBatchOpen(false)
          setBatchFile(null)
          setBatchSuccess(false)
        }}
        title="Cadastrar responsáveis em lote"
        description="Envie um arquivo .csv com os dados dos responsáveis."
        onConfirm={() => {
          // TODO: enviar batchFile para o backend
          setBatchSuccess(true)
        }}
        confirmLabel="Enviar arquivo"
        cancelLabel="Cancelar"
        confirmColor={AppColors.role.admin.secondary}
        confirmHoverColor={theme.palette.error.dark}
        disableConfirm={!batchFile}
      >
        <Box
          component="label"
          sx={{
            border: '1px dashed',
            borderColor: alpha(AppColors.role.admin.secondary, 0.4),
            borderRadius: '14px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            textAlign: 'center',
            backgroundColor: alpha(AppColors.role.admin.secondary, 0.04),
            '&:hover': {
              backgroundColor: alpha(AppColors.role.admin.secondary, 0.08),
            },
          }}
        >
          <UploadFileRoundedIcon
            sx={{ color: AppColors.role.admin.secondary, fontSize: 32 }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {batchFile
              ? batchFile.name
              : 'Clique para selecionar um arquivo .csv'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
            Apenas arquivos .csv são aceitos.
          </Typography>
          <input
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={e => {
              const file = e.target.files?.[0] ?? null
              if (file && !file.name.toLowerCase().endsWith('.csv')) {
                e.target.value = ''
                return
              }
              setBatchFile(file)
            }}
          />
        </Box>

        {batchSuccess && (
          <Box
            sx={{
              mt: 2,
              borderRadius: '10px',
              border: '1px solid',
              borderColor: alpha('#22C55E', 0.35),
              backgroundColor: alpha('#22C55E', 0.08),
              color: '#22C55E',
              fontSize: 13,
              fontWeight: 600,
              px: 1.5,
              py: 1,
            }}
          >
            ✓ Arquivo enviado com sucesso! Os responsáveis serão cadastrados em
            instantes.
          </Box>
        )}
      </AppActionModal>

      <Box className="grid grid-cols-2 gap-3 md:gap-4">
        {cards.map(card => (
          <Box key={card.id} data-testid={`metric-card-${card.id}`}>
            <MetricsCard contentClassName="p-5" {...card} />
          </Box>
        ))}
      </Box>

      <Box sx={{ backgroundColor: 'background.default', borderRadius: '14px' }}>
        <SearchBarAndFilter
          data-testid="parents-search"
          onQueryChange={setInputQuery}
          query={inputQuery}
          resultsSummary={{
            count: total,
            singularLabel: 'resultado',
            pluralLabel: 'resultados',
          }}
          searchPlaceholder="Pesquisar responsáveis..."
          filterOptions={parentFilterOptions}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '22px',
          p: { md: 2, xs: 1.5 },
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1fr 1fr 40px',
            px: 1,
            py: 1.5,
            mt: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <SortableHeader
            label="Responsável"
            field="name"
            sort={sort}
            onSort={handleSort}
          />
          <Typography sx={headerTextSx}>Telefone</Typography>
          <SortableHeader
            label="Aluno"
            field="child"
            sort={sort}
            onSort={handleSort}
          />
          <Typography sx={headerTextSx}>Status</Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : parents.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Nenhum responsável encontrado.
            </Typography>
          </Box>
        ) : (
          sortedParents.map(parent => (
            <Box
              key={parent.id}
              data-testid={`parent-row-${parent.id}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 40px',
                alignItems: 'center',
                px: 1,
                py: 1.75,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.hover, 0.6),
                  borderRadius: '12px',
                },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {getParentName(parent)}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                  {parent.guardian?.email ?? '—'}
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {parent.guardian?.phone_number ?? '—'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {parent.childName ?? '—'}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <AppTag
                  data-testid={`parent-status-${parent.id}`}
                  size="sm"
                  tag={
                    statusConfig[parent.status] ?? {
                      label: parent.status,
                      color: 'default',
                    }
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  data-testid={`parent-menu-${parent.id}`}
                  size="small"
                  onClick={e => {
                    setSelectedParentId(parent.id)
                    setMenuAnchorEl(e.currentTarget)
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  <MoreHorizRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        )}

        <Box ref={sentinelRef} sx={{ height: '1px' }} />
        {isFetchingMore && (
          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={22} />
          </Box>
        )}

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '16px',
                minWidth: 200,
                mt: 1,
              },
            },
          }}
        >
          <MenuItem
            data-testid="approve-parent-action"
            onClick={() => {
              setMenuAnchorEl(null)
              if (selectedParentId)
                void handleStatusUpdate(selectedParentId, 'approved')
            }}
            sx={{ color: 'success.main', gap: 1.25, py: 1.1 }}
          >
            <CheckRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Validar cadastro
            </Typography>
          </MenuItem>
          <MenuItem
            data-testid="reject-parent-action"
            disabled={selectedParent?.status === 'rejected'}
            onClick={() => {
              setMenuAnchorEl(null)
              if (selectedParentId)
                void handleStatusUpdate(selectedParentId, 'rejected')
            }}
            sx={{ color: 'error.main', gap: 1.25, py: 1.1 }}
          >
            <CancelOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Rejeitar cadastro
            </Typography>
          </MenuItem>
          <MenuItem
            data-testid="edit-parent-action"
            onClick={() => {
              setMenuAnchorEl(null)
              openEditModal()
            }}
            sx={{ color: 'warning.main', gap: 1.25, py: 1.1 }}
          >
            <EditRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Editar responsável
            </Typography>
          </MenuItem>
          <MenuItem
            data-testid="delete-parent-action"
            onClick={() => {
              setMenuAnchorEl(null)
              setParentToDeleteId(selectedParentId)
            }}
            sx={{ color: 'error.main', gap: 1.25, py: 1.1 }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Excluir responsável
            </Typography>
          </MenuItem>
        </Menu>

        <AppActionModal
          mode="confirm"
          open={parentToDeleteId !== null}
          onClose={() => setParentToDeleteId(null)}
          onConfirm={() => {
            if (parentToDeleteId) void handleDeleteParent(parentToDeleteId)
            setParentToDeleteId(null)
          }}
          title="Excluir responsável"
          description="Essa ação remove o responsável permanentemente."
          confirmLabel="Confirmar exclusão"
          confirmColor={theme.palette.error.main}
        >
          <Typography color="text.secondary">
            Deseja remover "
            {selectedParent ? getParentName(selectedParent) : ''}" da lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
