import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { AppTag } from '@/shared/ui/AppTags'
import type { TagContext } from '@/shared/types/common'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import { AppColors } from '@/app/theme/core/colors'
import AppButton from '@/shared/ui/AppButton'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AppActionModal from '@/shared/ui/AppActionModal'
import EditStudentModal, {
  type EditFormValues,
  type Student,
} from '@/modules/admin/shared/components/EditStudentModal'
import CreateStudentModal, {
  type StudentFormValues,
} from '@/modules/admin/shared/components/CreateStudentModal'
import { studentsService } from '../services/service'
import type { StudentRecord, StudentRisk, StudentStatus } from '../types/types'
import type { DropdownOption } from '@/shared/ui/AppDropdown'

const FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Estável', value: 'estável' },
  { label: 'Atenção', value: 'atenção' },
  { label: 'Crítico', value: 'crítico' },
]

function getRiskTag(
  risk: StudentRisk,
  palette: {
    success: { main: string }
    warning: { main: string }
    error: { main: string }
  }
): TagContext {
  switch (risk) {
    case 'baixo':
      return { label: risk, color: palette.success.main }
    case 'médio':
      return { label: risk, color: palette.warning.main }
    case 'alto':
      return { label: risk, color: palette.error.main }
  }
}

function getStatusTag(
  status: StudentStatus,
  palette: {
    success: { main: string }
    warning: { main: string }
    error: { main: string }
  }
): TagContext {
  switch (status) {
    case 'estável':
      return { label: status, color: palette.success.main }
    case 'atenção':
      return { label: status, color: palette.warning.main }
    case 'crítico':
      return { label: status, color: palette.error.main }
  }
}

export default function Page() {
  const theme = useTheme()
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [menuStudentId, setMenuStudentId] = useState<string | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    let isActive = true

    async function load() {
      const studentData = await studentsService.getStudents()

      if (isActive) {
        setStudents(studentData)
        setIsLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const lowerQuery = query.toLowerCase()
      const matchesQuery =
        student.name.toLowerCase().includes(lowerQuery) ||
        student.responsible.toLowerCase().includes(lowerQuery) ||
        student.school.toLowerCase().includes(lowerQuery) ||
        student.year.toLowerCase().includes(lowerQuery)
      const matchesFilter =
        filterStatus === 'all' || student.status === filterStatus
      return matchesQuery && matchesFilter
    })
  }, [students, query, filterStatus])

  const indicators = studentsService.getIndicators()

  const selectedStudentRow = students.find(s => s.id === menuStudentId)

  const editStudentData: Student | undefined = selectedStudentRow
    ? {
        name: selectedStudentRow.name,
        schoolId: '',
        year: '',
        guardianId: '',
      }
    : undefined

  function handleCreateStudent(_values: StudentFormValues) {
    setCreateError(null)
    setIsCreateModalOpen(false)
  }

  function handleEditStudent(_values: EditFormValues) {
    if (!menuStudentId) return
    setIsEditModalOpen(false)
  }

  function handleDeleteStudent() {
    if (!menuStudentId) return
    setStudents(current => current.filter(s => s.id !== menuStudentId))
    setIsDeleteModalOpen(false)
    setMenuStudentId(null)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer data-testid="sc-students-page" className="gap-4 md:gap-5">
      <PageHeader
        variant="enterpriseSchool"
        title={studentsService.getTitle()}
        subtitle={studentsService.getSubtitle()}
      />

      {/* Section Header: title + create button */}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { xs: 18, md: 20 },
              fontWeight: 700,
            }}
          >
            Alunos da escola vinculada
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: 14,
              mt: 0.25,
            }}
          >
            Cadastre alunos, atribua a turmas e ajuste os vínculos da operação
            escolar integrada.
          </Typography>
        </Box>
        <AppButton
          data-testid="sc-create-student-btn"
          size="medium"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <AddRoundedIcon sx={{ fontSize: 20, mr: 0.5 }} />
          Criar aluno
        </AppButton>
      </Box>

      {/* Create Student Modal */}
      <CreateStudentModal
        data-testid="sc-create-student-modal"
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setCreateError(null)
        }}
        onConfirm={values => {
          handleCreateStudent(values)
        }}
        apiError={createError}
        confirmColor={AppColors.role.escola_empresa.primary}
      />

      {/* Indicator Cards */}
      <Grid container spacing={2} data-testid="sc-students-indicators">
        {indicators.map((indicator, index) => (
          <Grid key={indicator.id} size={{ xs: 6, md: 3 }}>
            <MetricsCard
              data-testid={`sc-student-indicator-${index}`}
              title={indicator.title}
              value={String(indicator.value)}
              sx={{
                height: '100%',
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Search Bar and Filter */}
      <Box data-testid="sc-students-search">
        <SearchBarAndFilter
          filterOptions={FILTER_OPTIONS}
          onQueryChange={setQuery}
          onStatusChange={setFilterStatus}
          query={query}
          resultsSummary={{
            count: filteredStudents.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultado(s)',
          }}
          searchPlaceholder="Pesquisar alunos, responsáveis, escola ou turma..."
          selectedStatus={filterStatus}
        />
      </Box>

      {/* Students Table */}
      <Box
        data-testid="sc-students-table"
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '18px',
          overflow: 'hidden',
        }}
      >
        <Table
          size="small"
          sx={{
            '& .MuiTableCell-root': {
              borderColor: theme.palette.background.border,
              py: 1.75,
              px: 2.5,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Aluno
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Escola
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Ano
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Frequência
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Risco
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Status
              </TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => {
              const riskTag = getRiskTag(student.risk, theme.palette)
              const statusTag = getStatusTag(student.status, theme.palette)

              return (
                <TableRow
                  key={student.id}
                  data-testid={`sc-student-row-${student.id}`}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'background.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        sx={{
                          color: 'text.primary',
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {student.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: 12,
                        }}
                      >
                        Responsável: {student.responsible}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {student.school}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {student.year}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {student.attendance}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <AppTag size="sm" tag={riskTag} />
                  </TableCell>
                  <TableCell>
                    <AppTag size="sm" tag={statusTag} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label={`Opções ${student.name}`}
                      data-testid={`sc-student-menu-${student.id}`}
                      size="small"
                      onClick={e => {
                        setMenuAnchorEl(e.currentTarget)
                        setMenuStudentId(student.id)
                      }}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MoreHorizRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      {/* Context Menu */}
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
          data-testid="sc-student-view-action"
          onClick={() => {
            setMenuAnchorEl(null)
            setIsDetailModalOpen(true)
          }}
          sx={{ gap: 1.25, py: 1.1 }}
        >
          <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            Ver detalhes
          </Typography>
        </MenuItem>
        <MenuItem
          data-testid="sc-student-edit-action"
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
          data-testid="sc-student-delete-action"
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

      {/* Edit Student Modal */}
      {editStudentData && (
        <EditStudentModal
          data-testid="sc-edit-student-modal"
          key={menuStudentId}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onConfirm={values => {
            handleEditStudent(values)
          }}
          student={editStudentData}
        />
      )}

      {/* View Details Modal */}
      {selectedStudentRow && (
        <AppActionModal
          data-testid="sc-student-detail-modal"
          confirmLabel="Fechar"
          description="Informações detalhadas do aluno."
          mode="confirm"
          onClose={() => setIsDetailModalOpen(false)}
          onConfirm={() => setIsDetailModalOpen(false)}
          open={isDetailModalOpen}
          title="Detalhes do Aluno"
          confirmColor={AppColors.role.escola_empresa.primary}
        >
          <Box className="grid gap-3">
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'action.hover',
                borderRadius: '12px',
                display: 'flex',
                gap: 1.5,
                px: 2,
                py: 1.25,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: AppColors.role.escola_empresa.primary,
                  borderRadius: '50%',
                  color: '#fff',
                  display: 'flex',
                  flexShrink: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  height: 32,
                  justifyContent: 'center',
                  width: 32,
                }}
              >
                {selectedStudentRow.name.charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: { md: 14, xs: 13 },
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {selectedStudentRow.name}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: { md: 12, xs: 11 },
                    lineHeight: 1.3,
                  }}
                >
                  Responsável: {selectedStudentRow.responsible}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Escola
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {selectedStudentRow.school}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Ano
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {selectedStudentRow.year}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Frequência
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {selectedStudentRow.attendance}%
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Risco
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  <AppTag
                    size="sm"
                    tag={getRiskTag(selectedStudentRow.risk, theme.palette)}
                  />
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Status
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  <AppTag
                    size="sm"
                    tag={getStatusTag(selectedStudentRow.status, theme.palette)}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </AppActionModal>
      )}

      {/* Delete Confirmation Modal */}
      <AppActionModal
        data-testid="sc-delete-student-modal"
        confirmLabel="Confirmar exclusão"
        description="Essa ação remove o aluno permanentemente."
        mode="confirm"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDeleteStudent()
        }}
        open={isDeleteModalOpen}
        title="Excluir aluno"
        confirmColor={theme.palette.error.main}
      >
        <Typography color="text.secondary">
          Deseja remover "{selectedStudentRow?.name}" da lista?
        </Typography>
      </AppActionModal>
    </AppPageContainer>
  )
}
