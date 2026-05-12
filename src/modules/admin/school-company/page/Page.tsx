import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import { AppTag } from '@/shared/ui/AppTags'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { alpha, useTheme } from '@mui/material/styles'
import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'

interface School {
  id: string
  name: string
  city: string
  state: string
  classes: number
  students: number
  status: 'ativa' | 'pendente' | 'inativa'
  progress: number
  atRisk: number
}

interface ClassItem {
  id: string
  name: string
  schoolId: string
  students: number
  avgProgress: number
}

const SCHOOLS: School[] = [
  {
    id: '1',
    name: 'Escola São Paulo',
    city: 'São Paulo',
    state: 'SP',
    classes: 2,
    students: 3,
    status: 'ativa',
    progress: 75,
    atRisk: 0,
  },
  {
    id: '2',
    name: 'Escola Rio Branco',
    city: 'Rio de Janeiro',
    state: 'RJ',
    classes: 2,
    students: 2,
    status: 'ativa',
    progress: 60,
    atRisk: 1,
  },
  {
    id: '3',
    name: 'Escola Horizonte',
    city: 'Belo Horizonte',
    state: 'MG',
    classes: 1,
    students: 2,
    status: 'pendente',
    progress: 40,
    atRisk: 2,
  },
]

const CLASSES: ClassItem[] = [
  { id: 'c1', name: '7º A', schoolId: '1', students: 2, avgProgress: 80 },
  { id: 'c2', name: '6º A', schoolId: '1', students: 1, avgProgress: 70 },
  { id: 'c3', name: '7º B', schoolId: '2', students: 1, avgProgress: 65 },
  { id: 'c4', name: '6º B', schoolId: '2', students: 1, avgProgress: 55 },
  { id: 'c5', name: '8º A', schoolId: '3', students: 2, avgProgress: 40 },
]

const STATUS_COLORS: Record<School['status'], string> = {
  ativa: '#22c55e',
  pendente: '#f59e0b',
  inativa: '#ef4444',
}

export default function Page() {
  const theme = useTheme()
  const [view, setView] = useState<'escola' | 'empresa'>('escola')
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('1')
  const [query, setQuery] = useState('')

  const filteredSchools = SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  )

  const selectedSchool = SCHOOLS.find(s => s.id === selectedSchoolId)
  const schoolClasses = CLASSES.filter(c => c.schoolId === selectedSchoolId)

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      {/* Banner */}
      <PageHeader
        data-testid="school-company-page-header"
        title="Gestão de Escolas e Empresas"
        subtitle="Cadastro, status e desempenho das escolas"
        variant="admin"
      />

      {/* Toggle Escola / Empresa */}
      <Box
        data-testid="view-toggle-group"
        sx={{
          display: 'inline-flex',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '10px',
          overflow: 'hidden',
          alignSelf: 'flex-start',
          backgroundColor: 'background.paper',
        }}
      >
        {(['escola', 'empresa'] as const).map(v => (
          <button
            key={v}
            data-testid={`toggle-${v}`}
            onClick={() => setView(v)}
            style={{
              background:
                view === v ? theme.palette.background.default : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color:
                view === v
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: view === v ? 700 : 500,
              margin: 4,
              padding: '6px 24px',
              transition: 'all 0.18s',
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </Box>

      {/* ---- ESCOLA VIEW ---- */}
      {view === 'escola' && (
        <Box
          data-testid="escola-view"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* Section header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                Escolas cadastradas
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: 13, mt: 0.25 }}
              >
                Selecione uma escola para administrar turmas e alunos da rede.
              </Typography>
            </Box>

            <Button
              data-testid="add-new-school"
              startIcon={<AddRoundedIcon />}
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: theme.palette.error.main,
                borderRadius: '10px',
                fontWeight: 700,
                px: 2.5,
                py: 1,
                textTransform: 'none',
                flexShrink: 0,
                '&:hover': { backgroundColor: theme.palette.error.dark },
              }}
            >
              Nova escola
            </Button>
          </Box>

          {/* Search bar */}
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'background.border',
              p: 1.5,
            }}
          >
            <SearchBarAndFilter
              data-testid="school-search"
              onQueryChange={setQuery}
              query={query}
              resultsSummary={{
                count: filteredSchools.length,
                singularLabel: 'resultado',
                pluralLabel: 'resultado(s)',
              }}
              searchPlaceholder="Pesquisar escolas..."
            />
          </Box>

          {/* School cards grid */}
          <Box
            data-testid="schools-section"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            {filteredSchools.map(school => {
              const isSelected = school.id === selectedSchoolId
              return (
                <Box
                  key={school.id}
                  data-testid={`school-item-${school.id}`}
                  onClick={() => setSelectedSchoolId(school.id)}
                  sx={{
                    backgroundColor: isSelected
                      ? alpha(theme.palette.error.main, 0.07)
                      : 'background.paper',
                    border: '1px solid',
                    borderColor: isSelected
                      ? alpha(theme.palette.error.main, 0.3)
                      : 'background.border',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    p: 2.5,
                    transition: 'all 0.18s',
                    '&:hover': {
                      borderColor: alpha(theme.palette.error.main, 0.4),
                      backgroundColor: alpha(theme.palette.error.main, 0.05),
                    },
                  }}
                >
                  {/* School icon + name */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: alpha(theme.palette.error.main, 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SchoolRoundedIcon
                        sx={{ color: theme.palette.error.main, fontSize: 20 }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}
                      >
                        {school.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        {school.city}, {school.state}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Badges */}
                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}
                  >
                    <AppTag
                      size="sm"
                      tag={{
                        label: `${school.classes} turma(s)`,
                        color: theme.palette.primary.main,
                      }}
                    />
                    <AppTag
                      size="sm"
                      tag={{
                        label: `${school.students} aluno(s)`,
                        color: theme.palette.info?.main ?? '#0ea5e9',
                      }}
                    />
                    <AppTag
                      size="sm"
                      tag={{
                        label: school.status,
                        color: STATUS_COLORS[school.status],
                      }}
                    />
                  </Box>
                </Box>
              )
            })}
          </Box>

          {/* Metrics for selected school */}
          {selectedSchool && (
            <Box
              data-testid="school-metrics"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              <MetricsCard
                title="Escola"
                value={selectedSchool.name}
                warningText={`${selectedSchool.city}, ${selectedSchool.state}`}
                warningColor={theme.palette.text.secondary}
              />
              <MetricsCard title="Alunos" value={selectedSchool.students} />
              <MetricsCard title="Turmas" value={selectedSchool.classes} />
              <MetricsCard
                title="Progresso médio"
                value={`${selectedSchool.progress}%`}
                warningText={`${selectedSchool.atRisk} em risco alto`}
                warningColor={
                  selectedSchool.atRisk > 0
                    ? theme.palette.error.main
                    : theme.palette.success.main
                }
              />
            </Box>
          )}

          {/* Classes section */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                gap: 2,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                Turmas da escola selecionada
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  data-testid="add-new-student"
                  startIcon={<PersonAddAltRoundedIcon />}
                  variant="outlined"
                  disableElevation
                  sx={{
                    borderColor: 'background.border',
                    borderRadius: '10px',
                    color: 'text.secondary',
                    fontWeight: 700,
                    px: 2,
                    textTransform: 'none',
                    '&:hover': { borderColor: 'text.secondary' },
                  }}
                >
                  Novo aluno
                </Button>
                <Button
                  data-testid="add-new-class"
                  startIcon={<AddRoundedIcon />}
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    borderRadius: '10px',
                    fontWeight: 700,
                    px: 2.5,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: theme.palette.error.dark },
                  }}
                >
                  Nova turma
                </Button>
              </Box>
            </Box>

            {/* Classes list */}
            <Box
              data-testid="classes-section"
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '22px',
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  px: 2.5,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {['Turma', 'Alunos', 'Progresso médio'].map(col => (
                  <Typography
                    key={col}
                    sx={{
                      color: 'text.secondary',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {col}
                  </Typography>
                ))}
              </Box>

              {/* Table rows */}
              {!selectedSchoolId ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Selecione uma escola para ver as turmas.
                  </Typography>
                </Box>
              ) : schoolClasses.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Nenhuma turma cadastrada para esta escola.
                  </Typography>
                </Box>
              ) : (
                schoolClasses.map(cls => (
                  <Box
                    key={cls.id}
                    data-testid={`class-item-${cls.id}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 1fr',
                      alignItems: 'center',
                      px: 2.5,
                      py: 1.75,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': {
                        backgroundColor: alpha(
                          theme.palette.background.hover,
                          0.6
                        ),
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                      {cls.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {cls.students}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {cls.avgProgress}%
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* ---- EMPRESA VIEW ---- */}
      {view === 'empresa' && (
        <Box data-testid="empresa-view" sx={{ py: 6, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Visão de Empresas em desenvolvimento...
          </Typography>
        </Box>
      )}
    </AppPageContainer>
  )
}
