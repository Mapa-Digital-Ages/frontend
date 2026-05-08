import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { authService } from '@/app/auth/core/service'
import TaskList from '@/modules/student/shared/components/TaskList'
import UploadActivityModal, {
  type UploadTaskPayload,
} from '@/modules/student/shared/components/UploadActivityModal'
import { uploadService } from '@/modules/student/upload/services/uploadService'
import type { UploadItem } from '@/modules/student/upload/types/types'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmptyState from '@/shared/ui/EmptyState'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
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

type TaskType = 'Imagem' | 'PDF' | 'Documento' | 'Arquivo'

type TypeFilterValue = TaskType | 'all'

type UploadedTask = {
  id: string
  title: string
  type: TaskType
  subject: SubjectKey
}

const SUBJECT_FILTER_OPTIONS = [
  { label: 'Todas as disciplinas', value: 'all' },
  { label: 'Matemática', value: 'matematica' },
  { label: 'Português', value: 'portugues' },
  { label: 'Ciências', value: 'ciencias' },
  { label: 'História', value: 'historia' },
  { label: 'Biologia', value: 'biologia' },
  { label: 'Inglês', value: 'ingles' },
  { label: 'Geografia', value: 'geografia' },
] satisfies Array<{
  label: string
  value: SubjectFilterValue
}>

const TYPE_FILTER_OPTIONS = [
  { label: 'Todos os tipos', value: 'all' },
  { label: 'Imagem', value: 'Imagem' },
  { label: 'PDF', value: 'PDF' },
  { label: 'Documento', value: 'Documento' },
  { label: 'Arquivo', value: 'Arquivo' },
] satisfies Array<{
  label: string
  value: TypeFilterValue
}>

const TASK_FILTER_OPTIONS: DropdownOption[] = [
  ...SUBJECT_FILTER_OPTIONS.map(option => ({
    label: option.label,
    value: `subject:${option.value}`,
  })),
  ...TYPE_FILTER_OPTIONS.map((option, index) => ({
    groupLabel: index === 0 ? 'Tipo de arquivo' : undefined,
    label: option.label,
    value: `type:${option.value}`,
  })),
]

function getUploadTaskType(fileType: string): TaskType {
  if (fileType.startsWith('image/')) return 'Imagem'

  if (fileType === 'application/pdf') return 'PDF'

  if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'Documento'
  }

  return 'Arquivo'
}

function mapUploadToTask(upload: UploadItem): UploadedTask {
  return {
    id: upload.id,
    title: upload.file_name,
    type: getUploadTaskType(upload.file_type),
    subject: 'matematica',
  }
}

function getSubjectLabel(value: SubjectFilterValue) {
  return SUBJECT_FILTER_OPTIONS.find(option => option.value === value)?.label
}

function getTypeLabel(value: TypeFilterValue) {
  return TYPE_FILTER_OPTIONS.find(option => option.value === value)?.label
}

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [tasks, setTasks] = useState<UploadedTask[]>([])
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilterValue>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilterValue>('all')
  const [selectedFilterOption, setSelectedFilterOption] =
    useState('subject:all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const studentId = authService.getUserId()

  useEffect(() => {
    if (!studentId) {
      setIsLoading(false)
      return
    }

    async function fetchUploads() {
      setIsLoading(true)
      setFetchError(null)

      try {
        const result = await uploadService.listStudentUploads(studentId!)
        setTasks(result.map(mapUploadToTask))
      } catch {
        setFetchError('Não foi possível carregar as tarefas. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUploads()
  }, [studentId])

  async function handleAddTask(task: UploadTaskPayload) {
    if (!studentId) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const uploaded = await uploadService.uploadStudentFile(
        studentId,
        task.file
      )

      const newTask = mapUploadToTask(uploaded)
      newTask.subject = task.subject

      setTasks(currentTasks => [newTask, ...currentTasks])
      setIsUploadModalOpen(false)
    } catch {
      setSubmitError('Não foi possível enviar o arquivo. Tente novamente.')
      throw new Error('Upload failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleFilterChange(rawValue: string) {
    setSelectedFilterOption(rawValue)

    const [filterType, filterValue] = rawValue.split(':')

    if (filterType === 'subject') {
      setSubjectFilter(filterValue as SubjectFilterValue)
      return
    }

    if (filterType === 'type') {
      setTypeFilter(filterValue as TypeFilterValue)
    }
  }

  const activeFilterValues = useMemo(
    () => [`subject:${subjectFilter}`, `type:${typeFilter}`],
    [subjectFilter, typeFilter]
  )

  const filterButtonLabel = useMemo(() => {
    const activeFilters: string[] = []

    if (subjectFilter !== 'all') {
      const subjectLabel = getSubjectLabel(subjectFilter)

      if (subjectLabel) activeFilters.push(subjectLabel)
    }

    if (typeFilter !== 'all') {
      const typeLabel = getTypeLabel(typeFilter)

      if (typeLabel) activeFilters.push(typeLabel)
    }

    if (activeFilters.length === 0) return 'Filtros'

    return activeFilters.join(' • ')
  }, [subjectFilter, typeFilter])

  const filteredTaskListItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR')

    return tasks
      .filter(task => {
        const matchesSubject =
          subjectFilter === 'all' || task.subject === subjectFilter

        const matchesType = typeFilter === 'all' || task.type === typeFilter

        const matchesSearch =
          normalizedQuery === '' ||
          task.title.toLocaleLowerCase('pt-BR').includes(normalizedQuery) ||
          task.type.toLocaleLowerCase('pt-BR').includes(normalizedQuery)

        return matchesSubject && matchesType && matchesSearch
      })
      .map(task => ({
        id: task.id,
        title: task.title,
        type: task.type,
        subject: SUBJECTS[task.subject],
      }))
  }, [tasks, subjectFilter, typeFilter, searchQuery])

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
        <Box
          className="grid gap-3"
          sx={{
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(0, 1fr) minmax(220px, 260px) minmax(240px, 320px)',
            },
            '& > *': {
              minWidth: 0,
            },
            '& > :first-of-type': {
              gridColumn: {
                xs: '1 / -1',
                md: '1 / -1',
                lg: 'auto',
              },
            },
          }}
        >
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
            aria-label="Filtrar tarefas"
            borderRadius="16px"
            displayLabel={filterButtonLabel}
            fullWidth
            leadingIcon={
              <FilterListRoundedIcon
                sx={{ color: 'text.secondary', fontSize: 20 }}
              />
            }
            sx={{
              height: '100%',
              minHeight: 48,
            }}
            neutralOutline
            onChange={event => handleFilterChange(String(event.target.value))}
            options={TASK_FILTER_OPTIONS}
            triggerVariant="ghost"
            value={selectedFilterOption}
            selectedValues={activeFilterValues}
            menuMaxHeight={320}
            menuWidth="min(320px, calc(100vw - 32px))"
          />

          <AppButton
            label="Upload de Atividade"
            backgroundColor="primary.main"
            data-testid="upload-activity-button"
            fullWidth
            onClick={() => setIsUploadModalOpen(true)}
            sx={{ minHeight: 48 }}
          />
        </Box>

        {isLoading ? (
          <Box className="flex items-center justify-center py-10">
            <CircularProgress size={32} />
          </Box>
        ) : fetchError ? (
          <Box className="flex items-center justify-center py-10">
            <Typography sx={{ color: 'text.secondary' }}>
              {fetchError}
            </Typography>
          </Box>
        ) : filteredTaskListItems.length === 0 ? (
          <EmptyState
            description="Nenhuma tarefa encontrada para os filtros selecionados."
            title="Sem resultados"
          />
        ) : (
          <TaskList tasks={filteredTaskListItems} />
        )}
      </AppCard>

      <UploadActivityModal
        open={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          setSubmitError(null)
        }}
        onAddTask={handleAddTask}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </AppPageContainer>
  )
}
