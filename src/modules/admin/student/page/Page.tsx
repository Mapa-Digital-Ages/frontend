import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { AppColors } from '@/app/theme/core/colors'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { Box, Button, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import { AppTag } from '@/shared/ui/AppTags'
import type { TagContext } from '@/shared/types/common'
import TransferStudentModal, {
  type TransferFormValues,
} from '@/modules/admin/shared/components/TransferStudentModal'
import CreateStudentModal, {
  type StudentFormValues,
} from '@/modules/admin/shared/components/CreateStudentModal'
import AppActionModal from '@/shared/ui/AppActionModal'
import {
  schoolOptions,
  classOptions,
} from '@/modules/admin/shared/constants/studentOptions'

interface Student {
  id: string
  name: string
  parent: string
  class: string
  school: string
  status: string
  risk: string
  frequency: string
  average: string
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
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Lucas Silva',
      parent: 'Maria Silva',
      class: '7º A',
      school: 'Escola São Paulo',
      status: 'inativo',
      risk: 'alto',
      frequency: '75',
      average: '5',
    },
    {
      id: '2',
      name: 'Carlos Nunes',
      parent: 'Roberta Nunes',
      class: '7º A',
      school: 'Escola São Paulo',
      status: 'ativo',
      risk: 'baixo',
      frequency: '92',
      average: '9',
    },
    {
      id: '3',
      name: 'Lívia Santos',
      parent: 'Paula Santos',
      class: '6º A',
      school: 'Escola São Paulo',
      status: 'ativo',
      risk: 'alto',
      frequency: '86',
      average: '6',
    },
    {
      id: '4',
      name: 'Marina Costa',
      parent: 'Pedro Costa',
      class: '7º B',
      school: 'Escola Rio Branco',
      status: 'ativo',
      risk: 'baixo',
      frequency: '85',
      average: '8',
    },
    {
      id: '5',
      name: 'Rafael Souza',
      parent: 'Ana Souza',
      class: '8º A',
      school: 'Escola Horizonte',
      status: 'ativo',
      risk: 'baixo',
      frequency: '100',
      average: '10',
    },
    {
      id: '6',
      name: 'Julia Oliveira',
      parent: 'Claudio Oliveira',
      class: '8º A',
      school: 'Escola Rio Branco',
      status: 'ativo',
      risk: 'medio',
      frequency: '65',
      average: '7',
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
      normalize(student.class).includes(q)
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
    const newStudent = {
      id: String(Date.now()),
      name: values.name,
      parent: values.guardian,
      class:
        classOptions.find(c => c.value === values.class)?.label ?? values.class,
      school:
        schoolOptions.find(s => s.value === values.school)?.label ??
        values.school,
      status: values.status,
      risk: values.risk,
      frequency: values.frequency,
      average: values.average,
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
      id: 'no-class',
      title: 'Sem Turma',
      value: String(students.filter(s => s.class === 'Sem turma').length),
    },
    {
      id: 'risk',
      title: 'Risco Alto',
      value: String(students.filter(s => s.risk === 'alto').length),
    },
    {
      id: 'schools',
      title: 'Escolas',
      value: String(new Set(students.map(s => s.school)).size),
    },
  ]

  function handleTransferStudent(values: TransferFormValues) {
    const schoolLabel =
      schoolOptions.find(s => s.value === values.school)?.label ?? values.school
    const classLabel =
      classOptions
        .find(c => c.value === values.class)
        ?.label.split('·')[0]
        .trim() ?? values.class

    setStudents(current =>
      current.map(s =>
        s.id === values.studentId
          ? { ...s, school: schoolLabel, class: classLabel }
          : s
      )
    )
    setIsTransferModalOpen(false)
  }

  function handleDeleteStudent() {
    setStudents(current => current.filter(s => s.id !== selectedStudent))
    setIsDeleteModalOpen(false)
    setSelectedStudent(null)
  }

  function handleToggleStatus() {
    setStudents(current =>
      current.map(student =>
        student.id === selectedStudent
          ? {
              ...student,
              status: student.status === 'ativo' ? 'inativo' : 'ativo',
            }
          : student
      )
    )

    setMenuAnchorEl(null)
  }

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

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {cards.map(card => (
          <Box key={card.id} data-testid={`metric-card-${card.id}`}>
            <MetricsCard contentClassName="p-5" key={card.id} {...card} />
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
                  {student.class}
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
                      setSelectedStudent(student.id)
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
              setIsTransferModalOpen(true)
            }}
            sx={{ color: 'warning.main', gap: 1.25, py: 1.1 }}
          >
            <SwapHorizRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Transferir aluno
            </Typography>
          </MenuItem>
          <MenuItem
            data-testid="toggle-status-action"
            onClick={handleToggleStatus}
            sx={{ color: 'text.secondary', gap: 1.25, py: 1.1 }}
          >
            <SwapHorizRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {students.find(s => s.id === selectedStudent)?.status === 'ativo'
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

        <TransferStudentModal
          data-testid="transfer-student-modal"
          key={selectedStudent}
          open={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          defaultStudentId={selectedStudent ?? '1'}
          onConfirm={handleTransferStudent}
          studentOptions={students.map(s => ({
            label: s.name,
            value: s.id,
            school: s.school,
            class: s.class,
          }))}
        />

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
            Deseja remover "{students.find(s => s.id === selectedStudent)?.name}
            " da lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
