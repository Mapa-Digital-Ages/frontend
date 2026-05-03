import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import UploadActivityModal from '@/modules/student/shared/components/UploadActivityModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { AppSubjectTag } from '@/shared/ui/AppSubjectsTags'
import EmptyState from '@/shared/ui/EmptyState'
import PageHeader from '@/shared/ui/PageHeader'
import { SUBJECTS } from '@/shared/utils/themes'

type SubjectKey =
  | 'matematica'
  | 'portugues'
  | 'ciencias'
  | 'historia'
  | 'biologia'
  | 'ingles'
  | 'geografia'

type SubjectFilterValue = SubjectKey | 'all'

type UploadedTask = {
  id: string
  title: string
  type: string
  subject: SubjectKey
}

type UploadTaskPayload = Omit<UploadedTask, 'id'>

const SUBJECT_FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Todas as disciplinas', value: 'all' },
  { label: 'Matemática', value: 'matematica' },
  { label: 'Português', value: 'portugues' },
  { label: 'Ciências', value: 'ciencias' },
  { label: 'História', value: 'historia' },
  { label: 'Biologia', value: 'biologia' },
  { label: 'Inglês', value: 'ingles' },
  { label: 'Geografia', value: 'geografia' },
]

const INITIAL_TASKS: UploadedTask[] = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações',
    type: 'Exercício',
    subject: 'matematica',
  },
  {
    id: '2',
    title: 'Redação Dissertativa',
    type: 'Redação',
    subject: 'portugues',
  },
  {
    id: '3',
    title: 'Relatório de Experiência',
    type: 'Relatório',
    subject: 'ciencias',
  },
  {
    id: '4',
    title: 'Redação em Inglês',
    type: 'Redação',
    subject: 'ingles',
  },
]

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [tasks, setTasks] = useState<UploadedTask[]>(INITIAL_TASKS)
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilterValue>('all')

  function handleAddTask(task: UploadTaskPayload) {
    const newTask: UploadedTask = {
      id: crypto.randomUUID(),
      ...task,
    }

    setTasks(currentTasks => [newTask, ...currentTasks])
    setIsUploadModalOpen(false)
  }

  const filteredTasks = useMemo(
    () =>
      subjectFilter === 'all'
        ? tasks
        : tasks.filter(task => task.subject === subjectFilter),
    [tasks, subjectFilter]
  )

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Upload de Tarefas"
        subtitle="Visualize e envie suas tarefas"
        variant="aluno"
      />

      <AppCard
        contentClassName="gap-4 p-5"
        title="Lista de tarefas"
        titleClassName="text-xl font-bold md:text-2xl"
      >
        <Box className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_320px]">
          <AppInput
            placeholder="Pesquisar tarefas..."
            backgroundColor="background.default"
            InputProps={{
              startAdornment: (
                <SearchRoundedIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
          />

          <AppDropdown
            aria-label="Filtrar tarefas por disciplina"
            borderRadius="16px"
            displayLabel={
              subjectFilter === 'all'
                ? 'Filtros'
                : (SUBJECT_FILTER_OPTIONS.find(o => o.value === subjectFilter)
                    ?.label ?? 'Filtros')
            }
            fullWidth
            leadingIcon={
              <FilterListRoundedIcon
                sx={{ color: 'text.secondary', fontSize: 20 }}
              />
            }
            neutralOutline
            onChange={event =>
              setSubjectFilter(event.target.value as SubjectFilterValue)
            }
            options={SUBJECT_FILTER_OPTIONS}
            triggerVariant="ghost"
            value={subjectFilter}
          />

          <AppButton
            label="Upload de Atividade"
            backgroundColor="primary.main"
            data-testid="upload-activity-button"
            onClick={() => setIsUploadModalOpen(true)}
          />
        </Box>

        {filteredTasks.length === 0 ? (
          <EmptyState
            description="Nenhuma tarefa para a disciplina selecionada."
            title="Sem resultados"
          />
        ) : null}

        <Box className="grid gap-3">
          {filteredTasks.map(task => (
            <Box
              key={task.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
              sx={{
                backgroundColor: 'var(--app-surface-muted)',
              }}
            >
              <Box className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-500">
                <DescriptionOutlinedIcon fontSize="small" />
              </Box>

              <Box>
                <Typography
                  className="text-base font-semibold"
                  sx={{ color: 'text.primary' }}
                >
                  {task.title}
                </Typography>

                <Box className="mt-1 flex items-center gap-2">
                  <AppSubjectTag size="sm" subject={SUBJECTS[task.subject]} />

                  <Typography
                    className="text-sm"
                    sx={{ color: 'text.secondary' }}
                  >
                    {task.type}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </AppCard>

      <UploadActivityModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </AppPageContainer>
  )
}
