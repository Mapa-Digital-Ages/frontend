import { AppColors } from '@/app/theme/core/colors'
import { AppTag } from '@/shared/ui/AppTags'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import AppDropdown from '@/shared/ui/AppDropdown'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import CreateStudentModal from '@/modules/admin/shared/components/CreateStudentModal'
import type { StudentFormValues } from '@/modules/admin/shared/components/CreateStudentModal'
import { studentService } from '@/modules/admin/student/services/service'
import { adminSchoolService } from '@/modules/admin/school-company/services/service'
import type { School } from '@/modules/admin/school-company/types/types'
import type { StudentItem } from '@/modules/admin/student/types/types'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useRef, useState } from 'react'

const SCHOOL_PAGE_SIZE = 6
const STUDENT_PAGE_SIZE = 10

const STATUS_COLORS: Record<'ativa' | 'inativa', string> = {
  ativa: '#22c55e',
  inativa: '#ef4444',
}

const schoolFilterOptions = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Ativa', value: 'ativa' },
  { label: 'Inativa', value: 'inativa' },
]

const studentFilterOptions = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
]

export default function SchoolPage() {
  const theme = useTheme()

  // Schools
  const [schools, setSchools] = useState<School[]>([])
  const [schoolTotal, setSchoolTotal] = useState<number | null>(null)
  const [schoolPage, setSchoolPage] = useState(1)
  const [schoolTotalPages, setSchoolTotalPages] = useState(1)
  const [isLoadingSchools, setIsLoadingSchools] = useState(false)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
  const [query, setQuery] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('Todos')

  // Students
  const [students, setStudents] = useState<StudentItem[]>([])
  const [studentTotal, setStudentTotal] = useState<number | null>(null)
  const [studentPage, setStudentPage] = useState(1)
  const [hasMoreStudents, setHasMoreStudents] = useState(false)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [studentQuery, setStudentQuery] = useState('')
  const [studentFilter, setStudentFilter] = useState('Todos')
  const studentSentinelRef = useRef<HTMLDivElement | null>(null)

  // Modals
  const [isNewSchoolModalOpen, setIsNewSchoolModalOpen] = useState(false)
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false)
  const [studentApiError, setStudentApiError] = useState<string | null>(null)
  const [newSchool, setNewSchool] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isPrivate: false,
  })

  const loadSchools = useCallback(
    async (pageToLoad: number, search: string) => {
      try {
        setIsLoadingSchools(true)
        const data = await adminSchoolService.listSchools(
          pageToLoad,
          SCHOOL_PAGE_SIZE,
          search || undefined
        )
        setSchools(data.items)
        setSchoolTotal(data.total)
        setSchoolTotalPages(
          Math.max(1, Math.ceil(data.total / SCHOOL_PAGE_SIZE))
        )
        if (pageToLoad === 1 && data.items.length > 0) {
          setSelectedSchoolId(id => id || data.items[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar escolas:', error)
      } finally {
        setIsLoadingSchools(false)
      }
    },
    []
  )

  const loadStudents = useCallback(
    async (schoolId: string, pageToLoad: number, search: string) => {
      if (!schoolId) return
      try {
        setIsLoadingStudents(true)
        const result = await adminSchoolService.listStudentsBySchool(
          schoolId,
          pageToLoad,
          STUDENT_PAGE_SIZE,
          search || undefined
        )
        if (result.items.length < STUDENT_PAGE_SIZE) {
          setHasMoreStudents(false)
        } else {
          setHasMoreStudents(true)
        }
        setStudents(prev =>
          pageToLoad === 1 ? result.items : [...prev, ...result.items]
        )
        if (pageToLoad === 1) setStudentTotal(result.total)
      } catch (error) {
        console.error('Erro ao carregar alunos:', error)
      } finally {
        setIsLoadingStudents(false)
      }
    },
    []
  )

  // Reset school pagination when search changes
  useEffect(() => {
    setSchoolPage(1)
  }, [query])

  // Schools load
  useEffect(() => {
    const timer = setTimeout(
      () => {
        loadSchools(schoolPage, query)
      },
      query.trim() ? 350 : 0
    )

    return () => clearTimeout(timer)
  }, [loadSchools, query, schoolPage])

  // Reset & load students when school selection changes
  useEffect(() => {
    if (!selectedSchoolId) return
    setStudents([])
    setStudentPage(1)
    setHasMoreStudents(false)
    setStudentTotal(null)
    setStudentQuery('')
    loadStudents(selectedSchoolId, 1, '')
  }, [selectedSchoolId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Student search debounce
  useEffect(() => {
    if (!selectedSchoolId) return
    setStudents([])
    setStudentPage(1)
    setHasMoreStudents(false)
    const timer = setTimeout(() => {
      loadStudents(selectedSchoolId, 1, studentQuery)
    }, 350)
    return () => clearTimeout(timer)
  }, [studentQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  // Students infinite scroll
  useEffect(() => {
    if (studentPage === 1) return
    loadStudents(selectedSchoolId, studentPage, studentQuery)
  }, [studentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection observer for student infinite scroll
  useEffect(() => {
    const sentinel = studentSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          hasMoreStudents &&
          !isLoadingStudents
        ) {
          setStudentPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMoreStudents, isLoadingStudents])

  const selectedSchool = schools.find(s => s.id === selectedSchoolId)

  const filteredSchools =
    schoolFilter === 'Todos'
      ? schools
      : schools.filter(s =>
          schoolFilter === 'ativa' ? s.isActive : !s.isActive
        )

  const filteredStudents =
    studentFilter === 'Todos'
      ? students
      : students.filter(s => s.status === studentFilter)

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSchool.email.trim())
  const passwordIsValid = newSchool.password.length >= 8
  const passwordsMatch =
    newSchool.password.length > 0 &&
    newSchool.password === newSchool.confirmPassword
  const canCreateSchool =
    newSchool.name.trim() !== '' &&
    emailIsValid &&
    passwordIsValid &&
    passwordsMatch

  async function handleCreateSchool() {
    if (!canCreateSchool) return
    try {
      const created = await adminSchoolService.createSchool({
        name: newSchool.name.trim(),
        email: newSchool.email.trim(),
        password: newSchool.password,
        isPrivate: newSchool.isPrivate,
      })
      setSchools(prev => [created, ...prev])
      setSchoolTotal(prev => (prev !== null ? prev + 1 : 1))
      setSelectedSchoolId(created.id)
      setNewSchool({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isPrivate: false,
      })
      setIsNewSchoolModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar escola:', error)
    }
  }

  async function handleCreateStudent(values: StudentFormValues) {
    setStudentApiError(null)
    try {
      await studentService.createStudent({
        name: values.name,
        email: values.email,
        password: values.password,
        schoolId:
          values.school !== 'none' ? values.school : (selectedSchoolId ?? null),
        guardianId: values.guardian !== 'none' ? values.guardian : null,
        year: values.year,
        status: values.status as 'ativo' | 'inativo',
        birthDate: values.birthDate,
      })
      setIsNewStudentModalOpen(false)
      setStudents([])
      setStudentPage(1)
      setHasMoreStudents(false)
      if (selectedSchoolId) loadStudents(selectedSchoolId, 1, studentQuery)
    } catch {
      setStudentApiError(
        'Erro ao criar aluno. Verifique os dados e tente novamente.'
      )
    }
  }

  return (
    <Box
      data-testid="escola-view"
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      {/* Schools section */}
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
              count: schoolTotal ?? filteredSchools.length,
              singularLabel: 'resultado',
              pluralLabel: 'resultado(s)',
            }}
            searchPlaceholder="Pesquisar escolas..."
            filterOptions={schoolFilterOptions}
            selectedStatus={schoolFilter}
            onStatusChange={setSchoolFilter}
          />
        </Box>

        {isLoadingSchools && schools.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              Carregando escolas...
            </Typography>
          </Box>
        ) : !isLoadingSchools && filteredSchools.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              Nenhuma escola encontrada.
            </Typography>
          </Box>
        ) : (
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
              const status: 'ativa' | 'inativa' = school.isActive
                ? 'ativa'
                : 'inativa'
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
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        {school.isPrivate ? 'Privada' : 'Pública'} &bull;{' '}
                        {school.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}
                  >
                    <AppTag
                      size="sm"
                      tag={{
                        label: `${school.studentCount} aluno(s)`,
                        color: theme.palette.info?.main ?? '#0ea5e9',
                      }}
                    />
                    <AppTag
                      size="sm"
                      tag={{ label: status, color: STATUS_COLORS[status] }}
                    />
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}

        {schoolTotalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              disabled={schoolPage <= 1 || isLoadingSchools}
              onClick={() => setSchoolPage(p => Math.max(1, p - 1))}
              sx={{ border: '1px solid', borderColor: 'background.border' }}
            >
              <NavigateBeforeRoundedIcon fontSize="small" />
            </IconButton>

            {Array.from({ length: schoolTotalPages }, (_, i) => i + 1).map(
              p => (
                <Button
                  key={p}
                  size="small"
                  variant={p === schoolPage ? 'contained' : 'outlined'}
                  disableElevation
                  onClick={() => setSchoolPage(p)}
                  disabled={isLoadingSchools}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: '8px',
                    fontWeight: 700,
                    ...(p === schoolPage && {
                      backgroundColor: AppColors.role.admin.secondary,
                      '&:hover': { backgroundColor: theme.palette.error.dark },
                    }),
                  }}
                >
                  {p}
                </Button>
              )
            )}

            <IconButton
              size="small"
              disabled={schoolPage >= schoolTotalPages || isLoadingSchools}
              onClick={() =>
                setSchoolPage(p => Math.min(schoolTotalPages, p + 1))
              }
              sx={{ border: '1px solid', borderColor: 'background.border' }}
            >
              <NavigateNextRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

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
                {selectedSchool.isPrivate ? 'Privada' : 'Pública'} &bull;{' '}
                {selectedSchool.email}
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
                {selectedSchool.studentCount}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Students section */}
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
            disabled={!selectedSchoolId}
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
              {studentTotal ?? filteredStudents.length}
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
              count: studentTotal ?? filteredStudents.length,
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
            {['Aluno', 'Responsável', 'Ano', 'Status'].map(col => (
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
          ) : isLoadingStudents && students.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                Carregando alunos...
              </Typography>
            </Box>
          ) : filteredStudents.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>
                Nenhum aluno encontrado para esta escola.
              </Typography>
            </Box>
          ) : (
            <>
              {filteredStudents.map(student => (
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
                    <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                      {student.email}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {student.guardian ?? '—'}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {student.year ?? '—'}
                  </Typography>
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        backgroundColor:
                          student.status === 'ativo'
                            ? alpha('#22C55E', 0.12)
                            : alpha('#F59E0B', 0.12),
                        color:
                          student.status === 'ativo' ? '#22C55E' : '#F59E0B',
                        borderRadius: '999px',
                        px: 1.5,
                        py: 0.5,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'capitalize',
                      }}
                    >
                      {student.status}
                    </Box>
                  </Box>
                  <Box />
                </Box>
              ))}
              <Box ref={studentSentinelRef} sx={{ height: 4 }} />
              {isLoadingStudents && (
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 13,
                    textAlign: 'center',
                    py: 1.5,
                  }}
                >
                  Carregando...
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* New school modal */}
      <AppActionModal
        open={isNewSchoolModalOpen}
        onClose={() => {
          setIsNewSchoolModalOpen(false)
          setNewSchool({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            isPrivate: false,
          })
        }}
        title="Criar nova escola"
        description="Cadastre uma escola para iniciar processo de ativação."
        onConfirm={handleCreateSchool}
        confirmLabel="Criar escola"
        cancelLabel="Cancelar"
        confirmColor={AppColors.role.admin.secondary}
        confirmHoverColor={theme.palette.error.dark}
        disableConfirm={!canCreateSchool}
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
              value={newSchool.name}
              onChange={e =>
                setNewSchool(prev => ({ ...prev, name: e.target.value }))
              }
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
              E-mail
            </Typography>
            <AppInput
              data-testid="new-school-email"
              placeholder="Ex: contato@escola.edu.br"
              type="email"
              value={newSchool.email}
              onChange={e =>
                setNewSchool(prev => ({ ...prev, email: e.target.value }))
              }
              error={Boolean(newSchool.email && !emailIsValid)}
              helperText={
                newSchool.email && !emailIsValid
                  ? 'Digite um e-mail válido com @ e domínio.'
                  : undefined
              }
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
                { label: 'Pública', value: 'false' },
                { label: 'Privada', value: 'true' },
              ]}
              value={String(newSchool.isPrivate)}
              onChange={e =>
                setNewSchool(prev => ({
                  ...prev,
                  isPrivate: e.target.value === 'true',
                }))
              }
              fullWidth
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
              Senha
            </Typography>
            <AppInput
              data-testid="new-school-password"
              placeholder="Digite a senha"
              type="password"
              value={newSchool.password}
              onChange={e =>
                setNewSchool(prev => ({ ...prev, password: e.target.value }))
              }
              error={Boolean(newSchool.password && !passwordIsValid)}
              helperText="A senha deve ter pelo menos 8 caracteres."
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
              Confirmar senha
            </Typography>
            <AppInput
              data-testid="new-school-confirm-password"
              placeholder="Digite a senha novamente"
              type="password"
              value={newSchool.confirmPassword}
              onChange={e =>
                setNewSchool(prev => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              error={Boolean(newSchool.confirmPassword && !passwordsMatch)}
              helperText={
                newSchool.confirmPassword && !passwordsMatch
                  ? 'As senhas não coincidem.'
                  : undefined
              }
            />
          </Box>
        </Box>
      </AppActionModal>

      {/* New student modal */}
      <CreateStudentModal
        key={selectedSchool?.id ?? 'no-selected-school'}
        open={isNewStudentModalOpen}
        onClose={() => {
          setIsNewStudentModalOpen(false)
          setStudentApiError(null)
        }}
        onConfirm={handleCreateStudent}
        apiError={studentApiError}
        defaultSchool={
          selectedSchool
            ? { label: selectedSchool.name, value: selectedSchool.id }
            : null
        }
      />
    </Box>
  )
}
