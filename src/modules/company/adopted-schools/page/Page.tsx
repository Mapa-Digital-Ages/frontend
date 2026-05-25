import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { getRoleHoverStyle, getRoleSelectedStyle } from '@/app/theme/core/roles'
import { useEffect, useMemo, useState } from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
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
      data-testid="adopted-schools-page"
    >
      <PageHeader
        title={adoptedSchoolsService.getTitle()}
        subtitle={adoptedSchoolsService.getSubtitle()}
        variant="company"
      />

      <Box data-testid="adopted-schools-search">
        <SearchBarAndFilter
          filterOptions={FILTER_OPTIONS}
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
        data-testid="adopted-schools-content"
      >
        {/* School Cards List */}
        <AppCard
          contentClassName="gap-3 p-5"
          contentSx={{ maxHeight: 500, overflowY: 'auto' }}
          data-testid="adopted-schools-list"
        >
          {filteredSchools.map(school => (
            <Box
              className="cursor-pointer rounded-2xl px-4 py-3 transition-all"
              data-testid={`school-card-${school.id}`}
              key={school.id}
              onClick={() => setSelectedSchoolId(school.id)}
              sx={(() => {
                const isSelected = selectedSchoolId === school.id
                const hoverStyle = getRoleHoverStyle(theme, 'empresa')
                const selectedStyle = getRoleSelectedStyle(theme, 'empresa')

                return {
                  backgroundColor: isSelected
                    ? selectedStyle.backgroundColor
                    : theme.palette.background.paper,
                  border: `1px solid ${
                    isSelected
                      ? selectedStyle.borderColor
                      : alpha(theme.palette.divider, 0.5)
                  }`,
                  '&:hover': {
                    backgroundColor: hoverStyle.backgroundColor,
                    borderColor: hoverStyle.borderColor,
                  },
                }
              })()}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center gap-3 min-w-0">
                  <Box
                    className="flex items-center justify-center rounded-xl"
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.role.empresa.primary,
                        0.1
                      ),
                      color: theme.palette.role.empresa.primary,
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
                      {school.city}, {school.state} · {school.students} alunos ·
                      Coordenação: {school.coordinator}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  aria-label="Mais opções"
                  data-testid={`school-card-menu-${school.id}`}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <MoreHorizRoundedIcon />
                </IconButton>
              </Box>

              <Box className="mt-3 flex gap-3">
                <Box
                  className="flex-1 rounded-xl px-3 py-2"
                  sx={{
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8
                    ),
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Coordenação
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {school.coordinator}
                  </Typography>
                </Box>
                <Box
                  className="flex-1 rounded-xl px-3 py-2"
                  sx={{
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8
                    ),
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Alunos
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {school.students}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </AppCard>

        {/* School Details Panel */}
        {selectedSchool && (
          <AppCard contentClassName="p-5" data-testid="school-details-panel">
            <Box className="mb-4">
              <Typography
                sx={{
                  color: theme.palette.role.empresa.primary,
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
                {selectedSchool.city}, {selectedSchool.state} ·{' '}
                {selectedSchool.students} alunos · Coordenação:{' '}
                {selectedSchool.coordinator}
              </Typography>
            </Box>

            <Table
              size="small"
              data-testid="school-details-table"
              sx={{
                '& .MuiTableCell-root': {
                  borderColor: alpha(theme.palette.divider, 0.3),
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
                    Trilhas
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
                    data-testid={`school-details-grade-${grade.year}`}
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
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: 12,
                        }}
                      >
                        Responsável: {grade.responsible}
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
                        data-testid={`grade-menu-${grade.year}`}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <MoreHorizRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AppCard>
        )}
      </Box>
    </AppPageContainer>
  )
}
