import { HttpRequestError } from '@/shared/lib/http/client'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import { AppColors } from '@/app/theme/core/colors'
import { IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import { AppTag } from '@/shared/ui/AppTags'
import type { TagContext } from '@/shared/types/common'
import EditStudentModal, {
  type EditFormValues,
  type Student,
} from '@/modules/admin/shared/components/EditStudentModal'
import CreateStudentModal, {
  type StudentFormValues,
} from '@/modules/admin/shared/components/CreateStudentModal'
import AppActionModal from '@/shared/ui/AppActionModal'
import { yearOptions } from '@/modules/admin/shared/constants/studentOptions'
import { studentService } from '@/modules/admin/student/services/service'
import type {
  StudentItem,
  StudentMetrics,
} from '@/modules/admin/student/types/types'

type SortField = 'name' | 'school' | 'year'
type SortDirection = 'asc' | 'desc'

interface SortState {
  field: SortField | null
  direction: SortDirection
}

const yearOrder: Record<string, number> = {
  '5º Ano': 5,
  '6º Ano': 6,
  '7º Ano': 7,
  '8º Ano': 8,
  '9º Ano': 9,
}

function sortStudents(students: StudentItem[], sort: SortState): StudentItem[] {
  if (!sort.field) return students

  return [...students].sort((a, b) => {
    let comparison = 0

    if (sort.field === 'name') {
      comparison = a.name.localeCompare(b.name, 'pt-BR')
    } else if (sort.field === 'school') {
      comparison = (a.school ?? '').localeCompare(b.school ?? '', 'pt-BR')
    } else if (sort.field === 'year') {
      const aOrder = yearOrder[a.year ?? ''] ?? 0
      const bOrder = yearOrder[b.year ?? ''] ?? 0
      comparison = aOrder - bOrder
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
        '&:hover .sort-label': {
          color: 'text.primary',
        },
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
  const statusConfig: Record<string, TagContext> = {
    ativo: { label: 'Ativo', color: theme.palette.success.main },
    inativo: { label: 'Inativo', color: theme.palette.warning.main },
  }

  const [students, setStudents] = useState<StudentItem[]>([])
  const [metrics, setMetrics] = useState<StudentMetrics>({
    total: 0,
    active: 0,
    inactive: 0,
    schools: 0,
  })
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sort, setSort] = useState<SortState>({ field: null, direction: 'asc' })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )

  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    try {
      const listResult = await studentService.getStudents({
        query,
        status: selectedStatus as 'all' | 'ativo' | 'inativo',
      })
      setStudents(listResult.items)
      setTotal(listResult.total)
      setMetrics(m => ({
        ...m,
        total: listResult.total,
        schools: new Set(listResult.items.map(s => s.school).filter(Boolean))
          .size,
      }))
    } finally {
      setIsLoading(false)
    }
  }, [query, selectedStatus])

  useEffect(() => {
    void fetchStudents()
  }, [fetchStudents])

  function handleSort(field: SortField) {
    setSort(current => ({
      field,
      direction:
        current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedStudents = useMemo(
    () => sortStudents(students, sort),
    [students, sort]
  )

  const selectedStudentRow = students.find(s => s.id === selectedStudentId)

  const editStudentData: Student | undefined = selectedStudentRow
    ? {
        name: selectedStudentRow.name,
        schoolId: selectedStudentRow.schoolId ?? '',
        year:
          yearOptions.find(o => o.label === selectedStudentRow.year)?.value ??
          '',
      }
    : undefined

  async function handleCreateStudent(values: StudentFormValues) {
    const NONE = 'none'
    setCreateError(null)
    try {
      const created = await studentService.createStudent({
        name: values.name,
        email: values.email,
        password: values.password,
        schoolId: values.school !== NONE ? values.school : null,
        guardianId: values.guardian !== NONE ? values.guardian : null,
        year: values.year !== NONE ? values.year : null,
        status: values.status as 'ativo' | 'inativo',
        birthDate: values.birthDate,
      })
      setStudents(current => [created, ...current])
      setMetrics(m => ({
        ...m,
        total: m.total + 1,
        active: created.status === 'ativo' ? m.active + 1 : m.active,
        inactive: created.status === 'inativo' ? m.inactive + 1 : m.inactive,
        schools: new Set(
          [...students.map(s => s.school), created.school].filter(Boolean)
        ).size,
      }))
      setIsCreateModalOpen(false)
    } catch (err) {
      let message = 'Não foi possível criar o aluno. Tente novamente.'
      if (err instanceof HttpRequestError && err.response) {
        try {
          const body = (await err.response.json()) as {
            detail?: string
            message?: string
          }
          const apiMessage = (body.detail ?? body.message ?? '').toLowerCase()
          if (apiMessage.includes('email')) {
            message = 'E-mail já cadastrado.'
          } else if (apiMessage.includes('password')) {
            message = 'Senha inválida.'
          } else if (apiMessage) {
            message = apiMessage
          }
        } catch {
          // ignora
        }
      }
      setCreateError(message)
    }
  }

  async function handleEditStudent(values: EditFormValues) {
    if (!selectedStudentId) return
    const updated = await studentService.updateStudent(selectedStudentId, {
      password: values.password || undefined,
      schoolId: values.schoolId || null,
      year: values.year || null,
    })
    setStudents(current =>
      current.map(s => (s.id === selectedStudentId ? updated : s))
    )
    setIsEditModalOpen(false)
  }

  async function handleToggleStatus() {
    if (!selectedStudentId) return
    setMenuAnchorEl(null)
    const student = students.find(s => s.id === selectedStudentId)
    if (!student) return
    const updated = await studentService.toggleStudentStatus(
      selectedStudentId,
      student.status === 'inativo'
    )
    setStudents(current =>
      current.map(s => (s.id === selectedStudentId ? updated : s))
    )
    setMetrics(m => ({
      ...m,
      active: updated.status === 'ativo' ? m.active + 1 : m.active - 1,
      inactive: updated.status === 'inativo' ? m.inactive + 1 : m.inactive - 1,
    }))
  }

  async function handleDeleteStudent() {
    if (!selectedStudentId) return
    const student = students.find(s => s.id === selectedStudentId)
    await studentService.deleteStudent(selectedStudentId)
    setStudents(current => current.filter(s => s.id !== selectedStudentId))
    setMetrics(m => ({
      ...m,
      total: m.total - 1,
      active: student?.status === 'ativo' ? m.active - 1 : m.active,
      inactive: student?.status === 'inativo' ? m.inactive - 1 : m.inactive,
    }))
    setIsDeleteModalOpen(false)
    setSelectedStudentId(null)
  }

  const headerActions = (
    <Button
      data-testid="create-student-button"
      onClick={() => setIsCreateModalOpen(true)}
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
      Criar aluno
    </Button>
  )

  const cards = [
    { id: 'total', title: 'Total de Alunos', value: String(metrics.total) },
    { id: 'schools', title: 'Escolas', value: String(metrics.schools) },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        data-testid="students-page-header"
        title="Gestão de Alunos"
        subtitle="Monitoramento de risco e progresso"
        variant="admin"
      />

      <OrdinaryHeader
        title="Gestão de alunos da rede"
        subtitle="O administrador pode criar alunos, mover entre escolas e ajustar vínculos da base inteira"
        actions={headerActions}
      />

      <CreateStudentModal
        data-testid="create-student-modal"
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setCreateError(null)
        }}
        onConfirm={values => {
          void handleCreateStudent(values)
        }}
        apiError={createError}
      />

      <Box className="grid grid-cols-2 gap-3 md:gap-4">
        {cards.map(card => (
          <Box key={card.id} data-testid={`metric-card-${card.id}`}>
            <MetricsCard contentClassName="p-5" {...card} />
          </Box>
        ))}
      </Box>

      <Box sx={{ backgroundColor: 'background.default', borderRadius: '14px' }}>
        <SearchBarAndFilter
          data-testid="students-search"
          onQueryChange={setQuery}
          query={query}
          resultsSummary={{
            count: total,
            singularLabel: 'resultado',
            pluralLabel: 'resultados',
          }}
          searchPlaceholder="Pesquisar alunos, responsáveis, escola ou ano..."
          filterOptions={[
            { label: 'Todos', value: 'all' },
            { label: 'Ativo', value: 'ativo' },
            { label: 'Inativo', value: 'inativo' },
          ]}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
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
            label="Aluno"
            field="name"
            sort={sort}
            onSort={handleSort}
          />
          <SortableHeader
            label="Escola"
            field="school"
            sort={sort}
            onSort={handleSort}
          />
          <SortableHeader
            label="Turma"
            field="year"
            sort={sort}
            onSort={handleSort}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Status
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : students.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Nenhum aluno encontrado.
            </Typography>
          </Box>
        ) : (
          sortedStudents.map(student => (
            <Box
              key={student.id}
              data-testid={`student-row-${student.id}`}
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
                  {student.name}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                  {student.guardian ? `Responsável: ${student.guardian}` : '—'}
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {student.school ?? '—'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {student.year ?? '—'}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <AppTag
                  data-testid={`student-status-${student.id}`}
                  size="sm"
                  tag={
                    statusConfig[student.status] ?? {
                      label: student.status,
                      color: 'default',
                    }
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  data-testid={`student-menu-${student.id}`}
                  size="small"
                  onClick={e => {
                    setSelectedStudentId(student.id)
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
            data-testid="edit-student-action"
            onClick={() => {
              setMenuAnchorEl(null)
              setIsEditModalOpen(true)
            }}
            sx={{ color: 'warning.main', gap: 1.25, py: 1.1 }}
          >
            <EditRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Editar aluno
            </Typography>
          </MenuItem>
          <MenuItem
            data-testid="toggle-status-action"
            onClick={() => {
              void handleToggleStatus()
            }}
            sx={{ color: 'text.secondary', gap: 1.25, py: 1.1 }}
          >
            <SwapHorizRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {selectedStudentRow?.status === 'ativo'
                ? 'Tornar inativo'
                : 'Tornar ativo'}
            </Typography>
          </MenuItem>
          <MenuItem
            data-testid="delete-student-action"
            onClick={() => {
              setMenuAnchorEl(null)
              setIsDeleteModalOpen(true)
            }}
            sx={{ color: 'error.main', gap: 1.25, py: 1.1 }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Excluir aluno
            </Typography>
          </MenuItem>
        </Menu>

        {editStudentData && (
          <EditStudentModal
            data-testid="edit-student-modal"
            key={selectedStudentId}
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={values => {
              void handleEditStudent(values)
            }}
            student={editStudentData}
          />
        )}

        <AppActionModal
          confirmLabel="Confirmar exclusão"
          description="Essa ação remove o aluno permanentemente."
          mode="confirm"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            void handleDeleteStudent()
          }}
          open={isDeleteModalOpen}
          title="Excluir aluno"
          confirmColor={theme.palette.error.main}
        >
          <Typography color="text.secondary">
            Deseja remover "{selectedStudentRow?.name}" da lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
