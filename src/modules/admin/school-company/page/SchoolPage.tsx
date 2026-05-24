import { AppColors } from '@/app/theme/core/colors'
import { AppTag } from '@/shared/ui/AppTags'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import AppDropdown from '@/shared/ui/AppDropdown'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Box, Button, Typography } from '@mui/material'
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

const STATUS_COLORS: Record<School['status'], string> = {
  ativa: '#22c55e',
  pendente: '#f59e0b',
  inativa: '#ef4444',
}

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

export default function SchoolPage() {
  const theme = useTheme()

  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('1')
  const [query, setQuery] = useState('')
  const [studentQuery, setStudentQuery] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('Todos')
  const [studentFilter, setStudentFilter] = useState('Todos')
  const [isNewSchoolModalOpen, setIsNewSchoolModalOpen] = useState(false)
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false)
  const [newSchoolName, setNewSchoolName] = useState('')
  const [newSchoolLocation, setNewSchoolLocation] = useState('')
  const [newSchoolType, setNewSchoolType] = useState('Pública')

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

  if (
    selectedSchoolId &&
    !filteredSchools.some(s => s.id === selectedSchoolId)
  ) {
    setSelectedSchoolId(filteredSchools.length > 0 ? filteredSchools[0].id : '')
  }

  return (
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
                      sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}
                    >
                      {school.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                      {school.city}, {school.state}
                      {school.type ? ` • ${school.type}` : ''}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
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
            <Typography sx={{ fontWeight: 700, fontSize: 24 }}>1</Typography>
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
                sx={{ color: 'text.secondary', fontSize: 14 }}
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
                    backgroundColor: alpha(theme.palette.background.hover, 0.6),
                  },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {student.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
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
                      color: student.status === 'Ativo' ? '#22C55E' : '#F59E0B',
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
    </Box>
  )
}
