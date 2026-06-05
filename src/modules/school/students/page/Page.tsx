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
import { AppColors } from '@/app/theme/core/colors'
import { IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import AppButton from '@/shared/ui/AppButton'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
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
import {
  studentFormOptionsService,
  yearOptions,
} from '@/modules/admin/shared/constants/studentOptions'
import { studentService } from '@/modules/admin/student/services/service'
import type {
  StudentItem,
  StudentMetrics,
} from '@/modules/admin/student/types/types'
import { authService } from '@/app/auth/core/service'

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
          color: isActive ? 'var(--app-role-current-primary)' : 'text.disabled',
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
  const schoolId = authService.getUserId() ?? undefined
  const statusConfig: Record<string, TagContext> = {
    ativo: { label: 'Ativo', color: theme.palette.success.main },
    inativo: { label: 'Inativo', color: theme.palette.warning.main },
  }

  const [students, setStudents] = useState<StudentItem[]>([])
  const [metrics, setMetrics] = useState<StudentMetrics>({
    total: 0,
    schools: 0,
  })
  const [filteredTotal, setFilteredTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [inputQuery, setInputQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [sort, setSort] = useState<SortState>({ field: null, direction: 'asc' })

  const schoolMapRef = useRef<Record<string, string>>({})
  const guardianMapRef = useRef<Record<string, string>>({})
  const activePageRef = useRef(1)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const isFetchingMoreRef = useRef(false)
  const isLoadingRef = useRef(true)
  const hasMoreRef = useRef(true)
  const activeQueryRef = useRef('')
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )
  useEffect(() => {
    const timer = setTimeout(() => setActiveQuery(inputQuery), 350)
    return () => clearTimeout(timer)
  }, [inputQuery])

  useEffect(() => {
    void studentFormOptionsService.getSchools().then(schools => {
      const map: Record<string, string> = {}
      schools.forEach(s => {
        map[s.value] = s.label
      })
      schoolMapRef.current = map
    })
  }, [])

  const enrichItems = useCallback((items: StudentItem[]): StudentItem[] => {
    const schoolMap = schoolMapRef.current
    const guardianMap = guardianMapRef.current
    const enriched = items.map(s => ({
      ...s,
      school: s.schoolId ? (schoolMap[s.schoolId] ?? s.school) : s.school,
      guardian: s.guardianId
        ? (s.guardian ?? guardianMap[s.guardianId] ?? null)
        : s.guardian,
    }))
    enriched.forEach(s => {
      if (s.guardianId && s.guardian) guardianMap[s.guardianId] = s.guardian
    })
    return enriched
  }, [])

  useEffect(() => {
    void studentService.countStudents(undefined, schoolId).then(total => {
      setMetrics(m => ({ ...m, total }))
    })
  }, [schoolId])

  useEffect(() => {
    activePageRef.current = 1

    const fetchFirstPage = async () => {
      setStudents([])
      setHasMore(true)
      setIsLoading(true)
      try {
        const result = await studentService.getStudents({
          query: activeQuery,
          page: 1,
          schoolId: schoolId ?? null,
        })
        const items = enrichItems(result.items)
        setStudents(items)
        setHasMore(result.hasMore)
        setFilteredTotal(result.total)
        setMetrics(m => ({
          ...m,
          schools: new Set(items.map(s => s.school).filter(Boolean)).size,
        }))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFirstPage()
  }, [activeQuery, enrichItems, schoolId])

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

      void studentService
        .getStudents({
          query: activeQueryRef.current,
          page: nextPage,
          schoolId: schoolId ?? null,
        })
        .then(result => {
          const items = enrichItems(result.items)
          setStudents(prev => {
            const merged = [...prev, ...items]
            setMetrics(m => ({
              ...m,
              schools: new Set(merged.map(s => s.school).filter(Boolean)).size,
            }))
            return merged
          })
          setHasMore(result.hasMore)
        })
        .finally(() => setIsFetchingMore(false))
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [enrichItems, schoolId])

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
        guardianId: selectedStudentRow.guardianId ?? '',
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
      const withNames = enrichItems([created])
      setStudents(prev => [...withNames, ...prev])
      setMetrics(m => ({
        ...m,
        total: m.total + 1,
        schools: new Set(
          [...withNames, ...students].map(s => s.school).filter(Boolean)
        ).size,
      }))
      setFilteredTotal(prev => prev + 1)
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
      guardianId: values.guardianId || null,
    })
    const [enriched] = enrichItems([updated])
    setStudents(current =>
      current.map(s => (s.id === selectedStudentId ? enriched : s))
    )
    setIsEditModalOpen(false)
  }

  async function handleDeleteStudent() {
    if (!selectedStudentId) return
    await studentService.deleteStudent(selectedStudentId)
    setStudents(current => current.filter(s => s.id !== selectedStudentId))
    setMetrics(m => ({
      ...m,
      total: m.total - 1,
    }))
    setFilteredTotal(prev => prev - 1)
    setIsDeleteModalOpen(false)
    setSelectedStudentId(null)
  }

  const headerActions = (
    <AppButton
      data-testid="create-student-button"
      onClick={() => setIsCreateModalOpen(true)}
      startIcon={<AddRoundedIcon />}
      borderRadius="10px"
    >
      Criar aluno
    </AppButton>
  )

  const cards = [
    { id: 'total', title: 'Total de Alunos', value: String(metrics.total) },
    { id: 'schools', title: 'Escolas', value: String(metrics.schools) },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        data-testid="students-page-header"
        title="Acompanhamento de Alunos"
        subtitle="Lista com busca e sinalização de atenção"
        variant="school"
      />

      <OrdinaryHeader
        title="Alunos da escola"
        subtitle="Cadastre alunos, atrele a turmas e faça ajustes de vínculo ou exclusão quando necessário."
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
        confirmColor={AppColors.role.escola.primary}
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
          onQueryChange={setInputQuery}
          query={inputQuery}
          resultsSummary={{
            count: filteredTotal,
            singularLabel: 'resultado',
            pluralLabel: 'resultados',
          }}
          searchPlaceholder="Pesquisar alunos por nome..."
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
            label="Ano"
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
          confirmColor={AppColors.role.escola.primary}
        >
          <Typography color="text.secondary">
            Deseja remover "{selectedStudentRow?.name}" da lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
