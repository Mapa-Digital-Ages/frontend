import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import {
  Box,
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
import { alpha, useTheme } from '@mui/material/styles'
import {
  getRoleHoverStyle,
  getRolePalette,
  getRoleSelectedStyle,
} from '@/app/theme/core/roles'
import { useEffect, useMemo, useState } from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AppActionModal from '@/shared/ui/AppActionModal'
import { adoptedSchoolsService } from '../services/service'
import type { AdoptedSchool } from '../types/types'
import type { DropdownOption } from '@/shared/ui/AppDropdown'

const FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Paraná', value: 'PR' },
]

export default function Page() {
  const theme = useTheme()
  const [schools, setSchools] = useState<AdoptedSchool[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [menuSchoolId, setMenuSchoolId] = useState<string | null>(null)
  const [gradeMenuAnchorEl, setGradeMenuAnchorEl] =
    useState<HTMLElement | null>(null)
  const [gradeMenuKey, setGradeMenuKey] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const role = 'escola_empresa' as const
  const accent = getRolePalette(theme, role)
  const hoverStyle = getRoleHoverStyle(theme, role)
  const selectedStyle = getRoleSelectedStyle(theme, role)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const nextSchools = await adoptedSchoolsService.getSchools()

      if (!isActive) {
        return
      }

      setSchools(nextSchools)
      if (nextSchools.length > 0) {
        setSelectedSchoolId(nextSchools[0].id)
      }
      setIsLoading(false)
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  async function handleRemoveSchool() {
    if (!menuSchoolId) return
    await adoptedSchoolsService.removeSchool(menuSchoolId)
    setSchools(current => {
      const nextSchools = current.filter(s => s.id !== menuSchoolId)
      if (selectedSchoolId === menuSchoolId) {
        setSelectedSchoolId(nextSchools[0]?.id ?? null)
      }
      return nextSchools
    })
    setIsDeleteModalOpen(false)
    setMenuSchoolId(null)
  }

  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      const matchesQuery = school.schoolName
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesFilter =
        filterStatus === 'all' || school.state === filterStatus
      return matchesQuery && matchesFilter
    })
  }, [schools, query, filterStatus])

  const selectedSchool = useMemo(() => {
    return schools.find(s => s.id === selectedSchoolId) ?? null
  }, [schools, selectedSchoolId])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer
      className="gap-4 md:gap-5"
      data-testid="sc-adopted-schools-page"
    >
      <PageHeader
        title={adoptedSchoolsService.getTitle()}
        subtitle={adoptedSchoolsService.getSubtitle()}
        variant="enterpriseSchool"
      />

      <Box data-testid="sc-adopted-schools-search">
        <SearchBarAndFilter
          onQueryChange={setQuery}
          onStatusChange={setFilterStatus}
          query={query}
          resultsSummary={{
            count: filteredSchools.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultado(s)',
          }}
          searchPlaceholder="Pesquisar empresas..."
          selectedStatus={filterStatus}
        />
      </Box>

      <Box
        className="grid grid-cols-1 gap-4 xl:grid-cols-2"
        data-testid="sc-adopted-schools-content"
      >
        {/* School Cards List */}
        <AppCard
          contentClassName="gap-3 p-5"
          contentSx={{ maxHeight: 500, overflowY: 'auto' }}
          data-testid="sc-adopted-schools-list"
        >
          {filteredSchools.map(school => {
            const isSelected = selectedSchoolId === school.id
            return (
              <Box
                className="cursor-pointer rounded-2xl px-4 py-3 transition-all"
                data-testid={`sc-school-card-${school.id}`}
                key={school.id}
                onClick={() => setSelectedSchoolId(school.id)}
                sx={{
                  backgroundColor: isSelected
                    ? selectedStyle.backgroundColor
                    : theme.palette.background.paper,
                  border: `1px solid ${
                    isSelected
                      ? selectedStyle.borderColor
                      : theme.palette.background.border
                  }`,
                  '&:hover': {
                    backgroundColor: hoverStyle.backgroundColor,
                    borderColor: hoverStyle.borderColor,
                  },
                }}
              >
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center gap-3 min-w-0">
                    <Box
                      className="flex items-center justify-center rounded-xl"
                      sx={{
                        backgroundColor: alpha(accent.primary, 0.1),
                        border: `1px solid ${alpha(accent.primary, 0.3)}`,
                        color: accent.primary,
                        height: 40,
                        width: 40,
                        flexShrink: 0,
                      }}
                    >
                      <AccountBalanceRoundedIcon fontSize="small" />
                    </Box>
                    <Box className="min-w-0">
                      <Typography
                        sx={{
                          color: 'text.primary',
                          fontSize: { md: 16, xs: 14 },
                          fontWeight: 600,
                        }}
                      >
                        {school.schoolName}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: 13,
                        }}
                      >
                        {school.students} alunos
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    aria-label="Mais opções"
                    data-testid={`sc-school-card-menu-${school.id}`}
                    size="small"
                    onClick={e => {
                      e.stopPropagation()
                      setMenuAnchorEl(e.currentTarget)
                      setMenuSchoolId(school.id)
                    }}
                    sx={{
                      color: isSelected ? accent.primary : 'text.secondary',
                      backgroundColor: isSelected
                        ? selectedStyle.backgroundColor
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: hoverStyle.backgroundColor,
                        color: accent.primary,
                      },
                    }}
                  >
                    <MoreHorizRoundedIcon />
                  </IconButton>
                </Box>
              </Box>
            )
          })}
        </AppCard>

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
            data-testid="sc-remove-school-action"
            onClick={() => {
              setMenuAnchorEl(null)
              setIsDeleteModalOpen(true)
            }}
            sx={{ color: 'error.main', gap: 1.25, py: 1.1 }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Remover escola
            </Typography>
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={gradeMenuAnchorEl}
          open={Boolean(gradeMenuAnchorEl)}
          onClose={() => {
            setGradeMenuAnchorEl(null)
            setGradeMenuKey(null)
          }}
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
            data-testid="sc-view-grade-trails-action"
            onClick={() => {
              setGradeMenuAnchorEl(null)
              setGradeMenuKey(null)
            }}
            sx={{ gap: 1.25, py: 1.1 }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Ver trilhas
            </Typography>
          </MenuItem>
        </Menu>

        {/* School Details Panel */}
        {selectedSchool && (
          <AppCard contentClassName="p-5" data-testid="sc-school-details-panel">
            <Box className="mb-4">
              <Typography
                sx={{
                  color: accent.primary,
                  fontSize: 14,
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                Dados da Escola
              </Typography>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { md: 22, xs: 18 },
                  fontWeight: 700,
                }}
              >
                {selectedSchool.schoolName}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: 14,
                }}
              >
                {selectedSchool.students} alunos
              </Typography>
            </Box>

            <Table
              size="small"
              data-testid="sc-school-details-table"
              sx={{
                '& .MuiTableCell-root': {
                  borderColor: theme.palette.background.border,
                  py: 1.5,
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
                    Ano
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: 'text.secondary',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Alunos apoiados
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: 'text.secondary',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Por Matéria
                  </TableCell>
                  <TableCell sx={{ width: 40 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSchool.grades.map(grade => (
                  <TableRow
                    key={grade.year}
                    data-testid={`sc-school-details-grade-${grade.year}`}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'text.primary',
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        {grade.year}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: 'text.primary',
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        {grade.trails}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: 'text.primary',
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        {grade.subject}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label={`Opções ${grade.year}`}
                        data-testid={`sc-grade-menu-${grade.year}`}
                        size="small"
                        onClick={e => {
                          setGradeMenuAnchorEl(e.currentTarget)
                          setGradeMenuKey(grade.year)
                        }}
                        sx={{
                          color:
                            gradeMenuKey === grade.year
                              ? accent.primary
                              : 'text.secondary',
                          backgroundColor:
                            gradeMenuKey === grade.year
                              ? selectedStyle.backgroundColor
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: hoverStyle.backgroundColor,
                            color: accent.primary,
                          },
                        }}
                      >
                        <MoreHorizRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  color: accent.primary,
                  fontSize: 14,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Alunos apoiados
              </Typography>
              {selectedSchool.supportedStudents.length === 0 ? (
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Nenhum aluno vinculado a esta parceria.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedSchool.supportedStudents.map(student => (
                    <Box
                      key={student.id}
                      data-testid={`sc-supported-student-${student.id}`}
                      sx={{
                        border: '1px solid',
                        borderColor: 'background.border',
                        borderRadius: '12px',
                        p: 1.5,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        {student.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 13 }}
                      >
                        {student.year ?? 'Sem ano'} &bull; {student.email}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </AppCard>
        )}

        <AppActionModal
          confirmLabel="Confirmar remoção"
          description="Essa ação encerra a parceria e remove a escola da sua lista de escolas apoiadas."
          mode="confirm"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            void handleRemoveSchool()
          }}
          open={isDeleteModalOpen}
          title="Remover escola"
          confirmColor={theme.palette.error.main}
        >
          <Typography color="text.secondary">
            Deseja remover "
            {schools.find(s => s.id === menuSchoolId)?.schoolName ?? ''}" da
            lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
