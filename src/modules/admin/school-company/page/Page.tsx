import { AppColors } from '@/app/theme/core/colors'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { AppTag } from '@/shared/ui/AppTags'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import AppDropdown from '@/shared/ui/AppDropdown'
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
  students: number
  status: 'ativa' | 'pendente' | 'inativa'
  progress: number
  atRisk: number
  type?: 'Pública' | 'Privada'
}

interface StudentItem {
  id: string
  name: string
  parent: string
  schoolId: string
  year: string
  status: 'Ativo' | 'Inativo' | 'Pendente'
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

const INITIAL_SCHOOLS: School[] = [
  {
    id: '1',
    name: 'Escola São Paulo',
    city: 'São Paulo',
    state: 'SP',
    students: 3,
    status: 'ativa',
    progress: 75,
    atRisk: 0,
    type: 'Pública',
  },
  {
    id: '2',
    name: 'Escola Rio Branco',
    city: 'Rio de Janeiro',
    state: 'RJ',
    students: 2,
    status: 'ativa',
    progress: 60,
    atRisk: 1,
    type: 'Privada',
  },
  {
    id: '3',
    name: 'Escola Horizonte',
    city: 'Belo Horizonte',
    state: 'MG',
    students: 2,
    status: 'pendente',
    progress: 40,
    atRisk: 2,
    type: 'Pública',
  },
]

const STUDENTS: StudentItem[] = [
  {
    id: 's1',
    name: 'Lucas Silva',
    parent: 'Maria Silva',
    schoolId: '1',
    year: '7º',
    status: 'Inativo',
  },
  {
    id: 's2',
    name: 'Carlos Nunes',
    parent: 'Roberta Nunes',
    schoolId: '1',
    year: '7º',
    status: 'Ativo',
  },
  {
    id: 's3',
    name: 'Lívia Santos',
    parent: 'Paula Santos',
    schoolId: '1',
    year: '6º',
    status: 'Ativo',
  },
  {
    id: 's4',
    name: 'João Paulo',
    parent: 'Ana Paulo',
    schoolId: '2',
    year: '7º',
    status: 'Ativo',
  },
  {
    id: 's5',
    name: 'Maria Fernanda',
    parent: 'Fernanda Lima',
    schoolId: '2',
    year: '6º',
    status: 'Ativo',
  },
  {
    id: 's6',
    name: 'Pedro Henrique',
    parent: 'Henrique Alves',
    schoolId: '3',
    year: '8º',
    status: 'Inativo',
  },
  {
    id: 's7',
    name: 'Ana Clara',
    parent: 'Clara Mendes',
    schoolId: '3',
    year: '8º',
    status: 'Ativo',
  },
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
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('1')
  const [query, setQuery] = useState('')
  const [studentQuery, setStudentQuery] = useState('')
  const [companies, setCompanies] = useState<Company[]>(COMPANIES)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('1')

  const [schoolFilter, setSchoolFilter] = useState('Todos')
  const [studentFilter, setStudentFilter] = useState('Todos')
  const [isNewSchoolModalOpen, setIsNewSchoolModalOpen] = useState(false)
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false)

  const [newSchoolName, setNewSchoolName] = useState('')
  const [newSchoolLocation, setNewSchoolLocation] = useState('')
  const [newSchoolType, setNewSchoolType] = useState('Pública')

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

  const schoolFilterOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Ativa', value: 'ativa' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Inativa', value: 'inativa' },
  ]

  const studentFilterOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' },
  ]

  const filteredSchools = schools.filter(
    s =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      (schoolFilter === 'Todos' || s.status === schoolFilter)
  )

  const selectedSchool = schools.find(s => s.id === selectedSchoolId)
  const schoolStudents = STUDENTS.filter(s => s.schoolId === selectedSchoolId)
  const filteredStudents = schoolStudents.filter(
    s =>
      (s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
        s.parent.toLowerCase().includes(studentQuery.toLowerCase()) ||
        s.year.toLowerCase().includes(studentQuery.toLowerCase()) ||
        s.status.toLowerCase().includes(studentQuery.toLowerCase()) ||
        (selectedSchool?.name || '')
          .toLowerCase()
          .includes(studentQuery.toLowerCase())) &&
      (studentFilter === 'Todos' || s.status === studentFilter)
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

  if (
    selectedSchoolId &&
    !filteredSchools.some(s => s.id === selectedSchoolId)
  ) {
    setSelectedSchoolId(filteredSchools.length > 0 ? filteredSchools[0].id : '')
  }

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
        <Box
          data-testid="escola-view"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: '24px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
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
                onClick={() => setIsNewSchoolModalOpen(true)}
                sx={{
                  backgroundColor: AppColors.role.admin.secondary,
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
                filterOptions={schoolFilterOptions}
                selectedStatus={schoolFilter}
                onStatusChange={setSchoolFilter}
              />
            </Box>

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
                        ? alpha(AppColors.role.admin.secondary, 0.07)
                        : 'background.paper',
                      border: '1px solid',
                      borderColor: isSelected
                        ? alpha(AppColors.role.admin.secondary, 0.3)
                        : 'background.border',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      p: 2.5,
                      transition: 'all 0.18s',
                      '&:hover': {
                        borderColor: alpha(AppColors.role.admin.secondary, 0.4),
                        backgroundColor: alpha(
                          AppColors.role.admin.secondary,
                          0.05
                        ),
                      },
                    }}
                  >
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
                          backgroundColor: alpha(
                            AppColors.role.admin.secondary,
                            0.12
                          ),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
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
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            lineHeight: 1.2,
                          }}
                        >
                          {school.name}
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: 12 }}
                        >
                          {school.city}, {school.state}
                          {school.type ? ` • ${school.type}` : ''}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}
                    >
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
                data-testid="school-metrics"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: alpha(AppColors.role.admin.secondary, 0.2),
                    p: 2.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      mb: 1,
                    }}
                  >
                    ESCOLA
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    {selectedSchool.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                    {selectedSchool.city}, {selectedSchool.state}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: alpha(AppColors.role.admin.secondary, 0.2),
                    p: 2.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      mb: 1,
                    }}
                  >
                    ALUNOS
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 24 }}>
                    {selectedSchool.students}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: '24px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                mb: 2,
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  Alunos da escola selecionada
                </Typography>
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 13, mt: 0.25 }}
                >
                  Cadastre alunos, troque de turma e ajuste o vínculo escolar da
                  escola em foco.
                </Typography>
              </Box>
              <Button
                data-testid="add-new-student"
                startIcon={<AddRoundedIcon />}
                variant="contained"
                disableElevation
                onClick={() => setIsNewStudentModalOpen(true)}
                sx={{
                  backgroundColor: AppColors.role.admin.secondary,
                  borderRadius: '10px',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  flexShrink: 0,
                  '&:hover': { backgroundColor: theme.palette.error.dark },
                }}
              >
                Criar aluno
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: alpha(AppColors.role.admin.secondary, 0.2),
                  borderRadius: '16px',
                  p: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    mb: 0.5,
                  }}
                >
                  ALUNOS VISÍVEIS
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 24 }}>
                  {filteredStudents.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: alpha(AppColors.role.admin.secondary, 0.2),
                  borderRadius: '16px',
                  p: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    mb: 0.5,
                  }}
                >
                  ESCOLAS
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 24 }}>
                  1
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: '14px',
                border: '1px solid',
                borderColor: 'background.border',
                p: 1.5,
                mb: 2,
              }}
            >
              <SearchBarAndFilter
                data-testid="student-search"
                onQueryChange={setStudentQuery}
                query={studentQuery}
                resultsSummary={{
                  count: filteredStudents.length,
                  singularLabel: 'resultado',
                  pluralLabel: 'resultado(s)',
                }}
                searchPlaceholder="Pesquisar alunos, responsáveis, escola ou ano..."
                filterOptions={studentFilterOptions}
                selectedStatus={studentFilter}
                onStatusChange={setStudentFilter}
              />
            </Box>

            <Box
              data-testid="students-section"
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
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 40px',
                  px: 2.5,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {['Aluno', 'Escola', 'Ano', 'Status'].map(col => (
                  <Typography
                    key={col}
                    sx={{
                      color: 'text.secondary',
                      fontSize: 14,
                    }}
                  >
                    {col}
                  </Typography>
                ))}
                <Box />
              </Box>

              {!selectedSchoolId ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Selecione uma escola para ver os alunos.
                  </Typography>
                </Box>
              ) : filteredStudents.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Nenhum aluno encontrado para esta escola.
                  </Typography>
                </Box>
              ) : (
                filteredStudents.map(student => (
                  <Box
                    key={student.id}
                    data-testid={`student-item-${student.id}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 40px',
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
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        {student.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        Responsável: {student.parent}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {selectedSchool?.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {student.year}
                    </Typography>
                    <Box>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          backgroundColor:
                            student.status === 'Ativo'
                              ? alpha('#22C55E', 0.12)
                              : alpha('#F59E0B', 0.12),
                          color:
                            student.status === 'Ativo' ? '#22C55E' : '#F59E0B',
                          borderRadius: '999px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {student.status}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      ...
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      )}

      <AppActionModal
        open={isNewSchoolModalOpen}
        onClose={() => setIsNewSchoolModalOpen(false)}
        title="Criar nova escola"
        description="Cadastre uma escola para iniciar processo de ativação."
        onConfirm={() => {
          if (newSchoolName && newSchoolLocation) {
            const newId = `new-${Date.now()}`
            const parts = newSchoolLocation.split(',')
            const city = parts[0]?.trim() || newSchoolLocation
            const state = parts[1]?.trim() || ''

            const newSchool: School = {
              id: newId,
              name: newSchoolName,
              city: city,
              state: state,
              students: 0,
              status: 'pendente',
              progress: 0,
              atRisk: 0,
              type: newSchoolType as 'Pública' | 'Privada',
            }

            setSchools([newSchool, ...schools])
            setNewSchoolName('')
            setNewSchoolLocation('')
            setNewSchoolType('Pública')
          }
          setIsNewSchoolModalOpen(false)
        }}
        confirmLabel="Criar escola"
        cancelLabel="Cancelar"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Nome da escola
            </Typography>
            <AppInput
              data-testid="new-school-name"
              placeholder="Ex: Escola São Paulo"
              value={newSchoolName}
              onChange={e => setNewSchoolName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Estado/cidade
            </Typography>
            <AppInput
              data-testid="new-school-location"
              placeholder="Ex: São Paulo, SP"
              value={newSchoolLocation}
              onChange={e => setNewSchoolLocation(e.target.value)}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Tipo de escola
            </Typography>
            <AppDropdown
              data-testid="new-school-type"
              options={[
                { label: 'Pública', value: 'Pública' },
                { label: 'Privada', value: 'Privada' },
              ]}
              value={newSchoolType}
              onChange={e => setNewSchoolType(String(e.target.value))}
              fullWidth
            />
          </Box>
        </Box>
      </AppActionModal>

      <AppActionModal
        open={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        title="Novo Aluno"
        description="Preencha os dados do aluno e o associe a uma turma."
        onConfirm={() => setIsNewStudentModalOpen(false)}
        confirmLabel="Cadastrar aluno"
      >
        <Typography sx={{ color: 'text.secondary' }}>
          O formulário completo de cadastro do aluno será exibido aqui.
        </Typography>
      </AppActionModal>

      {view === 'empresa' && selectedCompany && (
        <Box
          data-testid="empresa-view"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
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
                const isSelected = company.id === selectedCompanyId

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
                    data-testid={`company-item-${company.id}`}
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
                      transition: 'all 0.18s',
                      '&:hover': {
                        borderColor: alpha(AppColors.role.admin.secondary, 0.3),
                        backgroundColor: alpha(
                          AppColors.role.admin.secondary,
                          0.04
                        ),
                      },
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

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
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
