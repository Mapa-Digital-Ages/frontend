import { AppColors } from '@/app/theme/core/colors'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { AppTag } from '@/shared/ui/AppTags'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
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

type PartnerRequest = {
  id: string
  schoolName: string
  location: string
  status: 'ativa' | 'pendente'
}

type Company = {
  id: string
  name: string
  email: string
  type: string
  status: 'ativa' | 'pendente' | 'inativa'
  description: string
  requests: PartnerRequest[]
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

const COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Tech Corp',
    email: 'parcerias@techcorp.com',
    type: 'Patrocínio',
    status: 'pendente',
    description:
      'Apoia escolas com patrocínio recorrente e cobertura de conectividade para turmas prioritárias.',
    requests: [
      {
        id: 'r1',
        schoolName: 'Escola São Paulo',
        location: 'São Paulo, SP • Pública',
        status: 'ativa',
      },
      {
        id: 'r2',
        schoolName: 'Escola Rio Branco',
        location: 'Rio de Janeiro, RJ • Privada',
        status: 'ativa',
      },
      {
        id: 'r3',
        schoolName: 'Escola Horizonte',
        location: 'Belo Horizonte, MG • Pública',
        status: 'pendente',
      },
    ],
  },
  {
    id: '2',
    name: 'Futuro S/A',
    email: 'contato@futurosa.com',
    type: 'Investimento social',
    status: 'ativa',
    description:
      'Empresa parceira focada na ampliação do acesso à plataforma em regiões com menor cobertura educacional.',
    requests: [
      {
        id: 'r4',
        schoolName: 'Escola Monte Azul',
        location: 'Porto Alegre, RS • Pública',
        status: 'ativa',
      },
    ],
  },
  {
    id: '3',
    name: 'Educa Mais',
    email: 'parcerias@educamais.com',
    type: 'Apoio educacional',
    status: 'inativa',
    description:
      'Parceria voltada ao fornecimento de recursos digitais e apoio pedagógico para escolas cadastradas.',
    requests: [],
  },
]

const STATUS_COLORS: Record<School['status'], string> = {
  ativa: '#22c55e',
  pendente: '#f59e0b',
  inativa: '#ef4444',
}

export default function Page() {
  const theme = useTheme()

  const [view, setView] = useState<'escola' | 'empresa'>('escola')
  const [selectedSchoolId, setSelectedSchoolId] = useState('1')
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState<Company[]>(COMPANIES)
  const [selectedCompanyId, setSelectedCompanyId] = useState('1')
  const [isNewPartnerOpen, setIsNewPartnerOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
  })

  const filteredSchools = SCHOOLS.filter(school =>
    school.name.toLowerCase().includes(query.toLowerCase())
  )

  const selectedSchool = SCHOOLS.find(school => school.id === selectedSchoolId)

  const schoolClasses = CLASSES.filter(
    classItem => classItem.schoolId === selectedSchoolId
  )

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(query.toLowerCase())
  )

  const selectedCompany =
    companies.find(company => company.id === selectedCompanyId) ??
    filteredCompanies[0]

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    newPartner.email.trim()
  )

  const passwordIsValid =
    newPartner.password.length >= 8 &&
    /[A-Z]/.test(newPartner.password) &&
    /[a-z]/.test(newPartner.password) &&
    /[0-9]/.test(newPartner.password)

  const passwordsMatch =
    newPartner.password.length > 0 &&
    newPartner.password === newPartner.confirmPassword

  const canCreatePartner =
    newPartner.name.trim() !== '' &&
    newPartner.type.trim() !== '' &&
    emailIsValid &&
    passwordIsValid &&
    passwordsMatch

  function handleCreatePartner() {
    if (!canCreatePartner) return

    const newCompany: Company = {
      id: crypto.randomUUID(),
      name: newPartner.name.trim(),
      email: newPartner.email.trim(),
      type: newPartner.type.trim(),
      status: 'pendente',
      description:
        'Empresa recém-cadastrada aguardando solicitações de parceria.',
      requests: [],
    }

    setCompanies(prev => [newCompany, ...prev])
    setSelectedCompanyId(newCompany.id)

    setNewPartner({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      type: '',
    })

    setShowPassword(false)
    setShowConfirmPassword(false)
    setIsNewPartnerOpen(false)
  }

  function handleApproveRequest(requestId: string) {
    if (!selectedCompany) return

    setCompanies(prev =>
      prev.map(company =>
        company.id === selectedCompany.id
          ? {
              ...company,
              status: 'ativa',
              requests: company.requests.map(request =>
                request.id === requestId
                  ? { ...request, status: 'ativa' }
                  : request
              ),
            }
          : company
      )
    )
  }

  function handleRejectRequest(requestId: string) {
    if (!selectedCompany) return

    setCompanies(prev =>
      prev.map(company =>
        company.id === selectedCompany.id
          ? {
              ...company,
              requests: company.requests.filter(
                request => request.id !== requestId
              ),
            }
          : company
      )
    )
  }

  function handleRemoveRequest(requestId: string) {
    if (!selectedCompany) return

    setCompanies(prev =>
      prev.map(company =>
        company.id === selectedCompany.id
          ? {
              ...company,
              requests: company.requests.filter(
                request => request.id !== requestId
              ),
            }
          : company
      )
    )
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        data-testid="school-company-page-header"
        title="Gestão de Escolas e Empresas"
        subtitle="Cadastro, status e desempenho das escolas"
        variant="admin"
      />

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
        {(['escola', 'empresa'] as const).map(item => (
          <button
            key={item}
            data-testid={`toggle-${item}`}
            onClick={() => {
              setView(item)
              setQuery('')
            }}
            style={{
              background:
                view === item
                  ? theme.palette.background.default
                  : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color:
                view === item
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: view === item ? 700 : 500,
              margin: 4,
              padding: '6px 40px',
              transition: 'all 0.18s',
            }}
          >
            {item === 'escola' ? 'Escolas' : 'Empresas'}
          </button>
        ))}
      </Box>

      {view === 'escola' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              startIcon={<AddRoundedIcon />}
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: AppColors.role.admin.secondary,
                borderRadius: '10px',
                fontWeight: 700,
                px: 2.5,
                py: 1,
                textTransform: 'none',
                '&:hover': { backgroundColor: theme.palette.error.dark },
              }}
            >
              Nova escola
            </Button>
          </Box>

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

          <Box
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
                  onClick={() => setSelectedSchoolId(school.id)}
                  sx={{
                    backgroundColor: isSelected
                      ? alpha(AppColors.role.admin.secondary, 0.07)
                      : 'background.paper',
                    border: '1px solid',
                    borderColor: isSelected
                      ? alpha(AppColors.role.admin.secondary, 0.3)
                      : 'background.border',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    p: 2.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: alpha(
                          AppColors.role.admin.secondary,
                          0.12
                        ),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SchoolRoundedIcon
                        sx={{
                          color: AppColors.role.admin.secondary,
                          fontSize: 20,
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                        {school.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        {school.city}, {school.state}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}
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

          {selectedSchool && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  md: '1fr 1fr 1fr 1fr',
                },
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
                    ? AppColors.role.admin.secondary
                    : theme.palette.success.main
                }
              />
            </Box>
          )}

          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: '22px',
              overflow: 'hidden',
            }}
          >
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

            {schoolClasses.map(classItem => (
              <Box
                key={classItem.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  alignItems: 'center',
                  px: 2.5,
                  py: 1.75,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.18
                  )}`,
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {classItem.name}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {classItem.students}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {classItem.avgProgress}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {view === 'empresa' && selectedCompany && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: '14px',
              p: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2,
                mb: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  Empresas parceiras
                </Typography>
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 13, mt: 0.25 }}
                >
                  Gerencie a operação das empresas em blocos separados: lista,
                  cobertura e escolas apoiadas.
                </Typography>
              </Box>

              <Button
                startIcon={<AddRoundedIcon />}
                variant="contained"
                disableElevation
                onClick={() => setIsNewPartnerOpen(true)}
                sx={{
                  backgroundColor: AppColors.role.admin.secondary,
                  borderRadius: '10px',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: theme.palette.error.dark },
                }}
              >
                Nova parceria
              </Button>
            </Box>

            <SearchBarAndFilter
              query={query}
              onQueryChange={setQuery}
              resultsSummary={{
                count: filteredCompanies.length,
                singularLabel: 'resultado',
                pluralLabel: 'resultado(s)',
              }}
              searchPlaceholder="Pesquisar empresas..."
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1.1fr' },
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '18px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '14px',
                  p: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                  Lista de empresas
                </Typography>
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}
                >
                  Selecione uma empresa para visualizar o detalhamento do apoio
                  e das escolas cobertas.
                </Typography>
              </Box>

              {filteredCompanies.map(company => {
                const isSelected = company.id === selectedCompany.id

                const pendingCount = company.requests.filter(
                  request => request.status === 'pendente'
                ).length

                const activeCount = company.requests.filter(
                  request => request.status === 'ativa'
                ).length

                return (
                  <Box
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    sx={{
                      backgroundColor: isSelected
                        ? alpha(AppColors.role.admin.secondary, 0.07)
                        : 'background.paper',
                      border: '1px solid',
                      borderColor: isSelected
                        ? alpha(AppColors.role.admin.secondary, 0.28)
                        : 'background.border',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          backgroundColor: alpha(
                            AppColors.role.admin.secondary,
                            0.12
                          ),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BusinessTwoToneIcon
                          sx={{
                            color: AppColors.role.admin.secondary,
                            fontSize: 20,
                          }}
                        />
                      </Box>

                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                        {company.name}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          border: '1px solid',
                          borderColor: 'background.border',
                          borderRadius: '10px',
                          backgroundColor: 'background.default',
                          p: 1.5,
                        }}
                      >
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: 12 }}
                        >
                          Em aprovação
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {pendingCount}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          border: '1px solid',
                          borderColor: 'background.border',
                          borderRadius: '10px',
                          backgroundColor: 'background.default',
                          p: 1.5,
                        }}
                      >
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: 12 }}
                        >
                          Escolas apoiadas
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {activeCount}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '18px',
                  p: 2.5,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 22 }}>
                  {selectedCompany.name}
                </Typography>

                <Typography
                  sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.5 }}
                >
                  {selectedCompany.description}
                </Typography>

                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'background.border',
                    backgroundColor: 'background.default',
                    borderRadius: '12px',
                    p: 1.5,
                    mt: 2,
                  }}
                >
                  <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                    Contato
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {selectedCompany.email}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '18px',
                  p: 2.5,
                  minHeight: 360,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>
                  Solicitação de parcerias
                </Typography>

                {selectedCompany.requests.length === 0 ? (
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Essa empresa ainda não solicitou apoio para nenhuma escola.
                  </Typography>
                ) : (
                  selectedCompany.requests.map(request => (
                    <Box
                      key={request.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'background.border',
                        borderRadius: '12px',
                        p: 1.5,
                        mb: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                          {request.schoolName}
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: 13 }}
                        >
                          {request.location}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            backgroundColor:
                              request.status === 'ativa'
                                ? alpha('#22C55E', 0.12)
                                : alpha('#F59E0B', 0.12),
                            color:
                              request.status === 'ativa'
                                ? '#22C55E'
                                : '#F59E0B',
                            borderRadius: '999px',
                            px: 1.5,
                            py: 0.5,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {request.status === 'ativa' ? 'ativa' : 'Pendente'}
                        </Box>

                        {request.status === 'pendente' ? (
                          <>
                            <Box
                              onClick={() => handleApproveRequest(request.id)}
                              sx={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: alpha('#22C55E', 0.35),
                                backgroundColor: alpha('#22C55E', 0.08),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <CheckCircleRoundedIcon
                                sx={{ color: '#22C55E', fontSize: 17 }}
                              />
                            </Box>

                            <Box
                              onClick={() => handleRejectRequest(request.id)}
                              sx={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: alpha('#EF4444', 0.35),
                                backgroundColor: alpha('#EF4444', 0.08),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <CancelRoundedIcon
                                sx={{ color: '#EF4444', fontSize: 17 }}
                              />
                            </Box>
                          </>
                        ) : (
                          <Box
                            onClick={() => handleRemoveRequest(request.id)}
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              border: '1px solid',
                              borderColor: alpha('#EF4444', 0.25),
                              backgroundColor: alpha('#EF4444', 0.06),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <DeleteRoundedIcon
                              sx={{ color: '#EF4444', fontSize: 16 }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {isNewPartnerOpen && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 520,
              backgroundColor: 'background.paper',
              borderRadius: '24px',
              p: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
                  Criar parceria
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Cadastre uma nova empresa parceira.
                </Typography>
              </Box>

              <Button
                onClick={() => setIsNewPartnerOpen(false)}
                sx={{
                  minWidth: 'auto',
                  color: 'text.secondary',
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                ×
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.6 }}>
                  Nome da empresa
                </Typography>
                <input
                  value={newPartner.name}
                  onChange={event =>
                    setNewPartner(prev => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Instituto Futuro"
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d9dee7',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.6 }}>
                  E-mail
                </Typography>
                <input
                  value={newPartner.email}
                  onChange={event =>
                    setNewPartner(prev => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Ex.: contato@empresa.com"
                  type="email"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `1px solid ${
                      newPartner.email && !emailIsValid ? '#ef4444' : '#d9dee7'
                    }`,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />

                {newPartner.email && !emailIsValid && (
                  <Typography
                    sx={{ color: '#ef4444', fontSize: 11.5, mt: 0.6 }}
                  >
                    Digite um e-mail válido com @ e domínio.
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.6 }}>
                  Tipo de parceria
                </Typography>
                <input
                  value={newPartner.type}
                  onChange={event =>
                    setNewPartner(prev => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Patrocínio"
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d9dee7',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.6 }}>
                  Senha
                </Typography>

                <Box sx={{ position: 'relative' }}>
                  <input
                    value={newPartner.password}
                    onChange={event =>
                      setNewPartner(prev => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Mínimo 8 caracteres"
                    type={showPassword ? 'text' : 'password'}
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${
                        newPartner.password && !passwordIsValid
                          ? '#ef4444'
                          : '#d9dee7'
                      }`,
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />

                  <IconButton
                    onClick={() => setShowPassword(prev => !prev)}
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'text.secondary',
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                <Typography
                  sx={{
                    color:
                      newPartner.password && !passwordIsValid
                        ? '#ef4444'
                        : 'text.secondary',
                    fontSize: 11.5,
                    mt: 0.6,
                  }}
                >
                  Use no mínimo 8 caracteres, uma letra maiúscula, uma minúscula
                  e um número.
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.6 }}>
                  Confirmar senha
                </Typography>

                <Box sx={{ position: 'relative' }}>
                  <input
                    value={newPartner.confirmPassword}
                    onChange={event =>
                      setNewPartner(prev => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Digite a senha novamente"
                    type={showConfirmPassword ? 'text' : 'password'}
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${
                        newPartner.confirmPassword && !passwordsMatch
                          ? '#ef4444'
                          : '#d9dee7'
                      }`,
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />

                  <IconButton
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'text.secondary',
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                {newPartner.confirmPassword && !passwordsMatch && (
                  <Typography
                    sx={{ color: '#ef4444', fontSize: 11.5, mt: 0.6 }}
                  >
                    As senhas não coincidem.
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1.5,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setIsNewPartnerOpen(false)}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={handleCreatePartner}
                disabled={!canCreatePartner}
                sx={{
                  backgroundColor: AppColors.role.admin.secondary,
                  borderRadius: '12px',
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: theme.palette.error.dark },
                }}
              >
                Criar parceria
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </AppPageContainer>
  )
}
