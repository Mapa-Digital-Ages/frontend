import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { AppColors } from '@/app/theme/core/colors'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
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
  schoolOptions,
  yearOptions,
} from '@/modules/admin/shared/constants/studentOptions'

interface StudentRow {
  id: string
  name: string
  parent: string
  year: string
  school: string
  status: string
}

export default function Page() {
  const theme = useTheme()
  const statusConfig: Record<string, TagContext> = {
    ativo: { label: 'Ativo', color: theme.palette.success.main },
    inativo: { label: 'Inativo', color: theme.palette.warning.main },
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [students, setStudents] = useState<StudentRow[]>([
    {
      id: '1',
      name: 'Lucas Silva',
      parent: 'Maria Silva',
      year: '7º Ano',
      school: 'Escola São Paulo',
      status: 'inativo',
    },
    {
      id: '2',
      name: 'Carlos Nunes',
      parent: 'Roberta Nunes',
      year: '7º Ano',
      school: 'Escola São Paulo',
      status: 'ativo',
    },
    {
      id: '3',
      name: 'Lívia Santos',
      parent: 'Paula Santos',
      year: '6º Ano',
      school: 'Escola São Paulo',
      status: 'ativo',
    },
    {
      id: '4',
      name: 'Marina Costa',
      parent: 'Pedro Costa',
      year: '7º Ano',
      school: 'Escola Rio Branco',
      status: 'ativo',
    },
    {
      id: '5',
      name: 'Rafael Souza',
      parent: 'Ana Souza',
      year: '8º Ano',
      school: 'Escola Horizonte',
      status: 'ativo',
    },
    {
      id: '6',
      name: 'Julia Oliveira',
      parent: 'Claudio Oliveira',
      year: '8º Ano',
      school: 'Escola Rio Branco',
      status: 'ativo',
    },
  ])

  const filteredStudents = students.filter(student => {
    const normalize = (text: string) =>
      text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    const q = normalize(query)
    const matchesQuery =
      normalize(student.name).includes(q) ||
      normalize(student.parent).includes(q) ||
      normalize(student.school).includes(q) ||
      normalize(student.year).includes(q)
    const matchesStatus =
      selectedStatus === 'all' || student.status === selectedStatus

    return matchesQuery && matchesStatus
  })

  const headerActions = (
    <Button
      data-testid="create-student-button"
      onClick={() => setIsModalOpen(true)}
      startIcon={<AddRoundedIcon />}
      variant="contained"
      disableElevation
      sx={{
        backgroundColor: AppColors.role.admin.secondary,
        borderRadius: '10px',
        fontWeight: '700',
        px: 2.5,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: theme.palette.error.dark,
        },
      }}
    >
      Criar aluno
    </Button>
  )

  function handleCreateStudent(values: StudentFormValues) {
    const newStudent: StudentRow = {
      id: String(Date.now()),
      name: values.name,
      parent: values.guardian,
      year:
        yearOptions.find(c => c.value === values.year)?.label ?? values.year,
      school:
        schoolOptions.find(s => s.value === values.school)?.label ??
        values.school,
      status: values.status,
    }
    setStudents(current => [...current, newStudent])
    setIsModalOpen(false)
  }

  const cards = [
    {
      id: 'visible',
      title: 'Alunos Visíveis',
      value: String(filteredStudents.length),
    },
    {
      id: 'schools',
      title: 'Escolas',
      value: String(new Set(students.map(s => s.school)).size),
    },
  ]

  function handleEditStudent(values: EditFormValues) {
    const schoolLabel =
      schoolOptions.find(s => s.value === values.school)?.label ?? values.school
    const yearLabel =
      yearOptions.find(c => c.value === values.year)?.label ?? values.year

    setStudents(current =>
      current.map(s =>
        s.id === selectedStudentId
          ? { ...s, school: schoolLabel, year: yearLabel }
          : s
      )
    )
    setIsEditModalOpen(false)
  }

  function handleDeleteStudent() {
    setStudents(current => current.filter(s => s.id !== selectedStudentId))
    setIsDeleteModalOpen(false)
    setSelectedStudentId(null)
  }

  function handleToggleStatus() {
    setStudents(current =>
      current.map(student =>
        student.id === selectedStudentId
          ? {
              ...student,
              status: student.status === 'ativo' ? 'inativo' : 'ativo',
            }
          : student
      )
    )

    setMenuAnchorEl(null)
  }

  const selectedStudentRow = students.find(s => s.id === selectedStudentId)

  const editStudentData: Student | undefined = selectedStudentRow
    ? {
        name: selectedStudentRow.name,
        school:
          schoolOptions.find(o => o.label === selectedStudentRow.school)
            ?.value ?? selectedStudentRow.school,
        year:
          yearOptions.find(o => o.label === selectedStudentRow.year)?.value ??
          selectedStudentRow.year,
      }
    : undefined

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
        subtitle="O administrador pode criar alunos, atrelar a turmas, mover entre escolas e ajustar vínculos da base inteira"
        actions={headerActions}
      />

      <CreateStudentModal
        data-testid="create-student-modal"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateStudent}
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
            count: filteredStudents.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultados',
          }}
          searchPlaceholder="Pesquisar alunos, responsáveis, escola ou turma..."
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
          {['Aluno', 'Escola', 'Turma', 'Status'].map(col => (
            <Typography
              key={col}
              sx={{
                color: 'text.secondary',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {col}
            </Typography>
          ))}
        </Box>

        {filteredStudents.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Nenhum aluno encontrado.
            </Typography>
          </Box>
        ) : (
          filteredStudents.map(student => {
            return (
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
                    Responsável: {student.parent}
                  </Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {student.school}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {student.year}
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
            )
          })
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
            data-testid="transfer-student-action"
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
            onClick={handleToggleStatus}
            sx={{ color: 'text.secondary', gap: 1.25, py: 1.1 }}
          >
            <SwapHorizRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {students.find(s => s.id === selectedStudentId)?.status ===
              'ativo'
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
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={handleEditStudent}
            student={editStudentData}
          />
        )}

        <AppActionModal
          confirmLabel="Confirmar exclusão"
          description="Essa ação remove o aluno da lista."
          mode="confirm"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteStudent}
          open={isDeleteModalOpen}
          title="Excluir aluno"
          confirmColor={theme.palette.error.main}
        >
          <Typography color="text.secondary">
            Deseja remover "
            {students.find(s => s.id === selectedStudentId)?.name}" da lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
