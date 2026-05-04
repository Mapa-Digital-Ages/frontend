import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box } from '@mui/material'
import { useMemo, useState } from 'react'
import TaskList from '@/modules/student/shared/components/TaskList'
import UploadActivityModal from '@/modules/student/shared/components/UploadActivityModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmptyState from '@/shared/ui/EmptyState'
import { SUBJECTS } from '@/shared/utils/themes'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

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

const UPLOAD_TASKS: UploadedTask[] = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações',
    subject: 'matematica',
    type: 'Exercício',
  },
  {
    id: '2',
    title: 'Redação Dissertativa',
    subject: 'portugues',
    type: 'Revisão',
  },
  {
    id: '3',
    title: 'Relatório de Experiência',
    subject: 'ciencias',
    type: 'Trabalho',
  },
  {
    id: '4',
    title: 'Redação',
    subject: 'portugues',
    type: 'Pré-prova',
  },
]

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [tasks, setTasks] = useState<UploadedTask[]>(UPLOAD_TASKS)
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilterValue>('all')
  const [searchQuery, setSearchQuery] = useState('')

  function handleAddTask(task: UploadTaskPayload) {
    const newTask: UploadedTask = {
      id: crypto.randomUUID(),
      ...task,
    }

    setTasks(currentTasks => [newTask, ...currentTasks])
    setIsUploadModalOpen(false)
  }

  const filteredTaskListItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR')

    return tasks
      .filter(task => {
        const matchesSubject =
          subjectFilter === 'all' || task.subject === subjectFilter
        const matchesSearch =
          normalizedQuery === '' ||
          task.title.toLocaleLowerCase('pt-BR').includes(normalizedQuery) ||
          task.type.toLocaleLowerCase('pt-BR').includes(normalizedQuery)

        return matchesSubject && matchesSearch
      })
      .map(task => ({
        id: task.id,
        title: task.title,
        type: task.type,
        subject: SUBJECTS[task.subject],
      }))
  }, [tasks, subjectFilter, searchQuery])

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Tarefas Enviadas"
        subtitle="Visualize e envie suas tarefas."
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
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
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
            sx={{
              height: '100%',
            }}
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

        {filteredTaskListItems.length === 0 ? (
          <EmptyState
            description="Nenhuma tarefa para a disciplina selecionada."
            title="Sem resultados"
          />
        ) : (
          <TaskList tasks={filteredTaskListItems} />
        )}
      </AppCard>

      <UploadActivityModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </AppPageContainer>
  )
}
