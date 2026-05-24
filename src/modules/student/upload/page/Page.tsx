import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, CircularProgress, Tooltip, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { authService } from '@/app/auth/core/service'
import TaskList from '@/modules/student/shared/components/TaskList'
import UploadActivityModal, {
  type UploadTaskPayload,
} from '@/modules/student/shared/components/UploadActivityModal'
import {
  uploadService,
  type SubjectDirectoryItem,
} from '@/modules/student/upload/services/uploadService'
const DEFAULT_SUBJECT_COLOR = 'rgba(32, 109, 197, 1)'
import type { UploadItem } from '@/modules/student/upload/types/types'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmptyState from '@/shared/ui/EmptyState'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

type SubjectFilterValue = number | 'all' | 'none'

type TaskType = 'Imagem' | 'PDF' | 'Documento' | 'Arquivo'

type TypeFilterValue = TaskType | 'all'

interface SubjectDescriptor {
  id: number
  name: string
  color: string
}

type UploadedTask = {
  id: string
  title: string
  type: TaskType
  subjectId: number | null
}

const NEUTRAL_SUBJECT_TAG = {
  id: 'none',
  label: 'Sem disciplina',
  color: 'rgba(148, 163, 184, 1)',
} as const

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

function buildTaskFilterOptions(
  subjects: SubjectDescriptor[]
): DropdownOption[] {
  const subjectOptions: DropdownOption[] = [
    { label: 'Todas as disciplinas', value: 'subject:all' },
    ...subjects.map(subject => ({
      label: subject.name,
      value: `subject:${subject.id}`,
    })),
    { label: 'Sem disciplina', value: 'subject:none' },
  ]
  const typeOptions: DropdownOption[] = TYPE_FILTER_OPTIONS.map(
    (option, index) => ({
      groupLabel: index === 0 ? 'Tipo de arquivo' : undefined,
      label: option.label,
      value: `type:${option.value}`,
    })
  )
  return [...subjectOptions, ...typeOptions]
}

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

function toSubjectDescriptors(
  items: SubjectDirectoryItem[]
): SubjectDescriptor[] {
  return items
    .map(item => ({
      id: item.id,
      name: item.name,
      color: item.color ?? DEFAULT_SUBJECT_COLOR,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

function mapUploadToTask(upload: UploadItem): UploadedTask {
  return {
    id: upload.id,
    title: upload.file_name,
    type: getUploadTaskType(upload.file_type),
    subjectId: upload.subject_id ?? null,
  }
}

function getSubjectFilterLabel(
  value: SubjectFilterValue,
  subjects: SubjectDescriptor[]
) {
  if (value === 'all') return 'Todas as disciplinas'
  if (value === 'none') return 'Sem disciplina'
  return subjects.find(subject => subject.id === value)?.name
}

function getTypeLabel(value: TypeFilterValue) {
  return TYPE_FILTER_OPTIONS.find(option => option.value === value)?.label
}

function parseSubjectFilterValue(value: string): SubjectFilterValue {
  if (value === 'all' || value === 'none') return value
  const asNumber = Number(value)
  return Number.isFinite(asNumber) ? asNumber : 'all'
}

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [tasks, setTasks] = useState<UploadedTask[]>([])
  const [subjects, setSubjects] = useState<SubjectDescriptor[]>([])
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
  const isLocalSession = !studentId

  useEffect(() => {
    if (isLocalSession) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function loadAll() {
      setIsLoading(true)
      setFetchError(null)

      try {
        const [subjectList, uploads] = await Promise.all([
          uploadService
            .listSubjects()
            .catch(
              () => [] as Awaited<ReturnType<typeof uploadService.listSubjects>>
            ),
          uploadService.listStudentUploads(studentId!),
        ])

        if (cancelled) return

        setSubjects(toSubjectDescriptors(subjectList))
        setTasks(uploads.map(item => mapUploadToTask(item)))
      } catch {
        if (!cancelled) {
          setFetchError(
            'Não foi possível carregar as tarefas. Tente novamente.'
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadAll()

    return () => {
      cancelled = true
    }
  }, [studentId, isLocalSession])

  async function handleAddTask(task: UploadTaskPayload) {
    if (!studentId) {
      setSubmitError(
        'Upload indisponível em sessão local. Entre com uma conta real para enviar arquivos.'
      )
      throw new Error('Upload blocked for local session')
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const activityType =
        task.type === 'Redação'
          ? 'essay'
          : task.type === 'Atividade'
            ? 'activity'
            : 'exercise'

      const uploaded = await uploadService.uploadStudentFile(
        studentId,
        task.file,
        activityType,
        task.subjectId
      )

      const newTask = mapUploadToTask(uploaded)
      if (newTask.subjectId == null && task.subjectId != null) {
        newTask.subjectId = task.subjectId
      }

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
      setSubjectFilter(parseSubjectFilterValue(filterValue))
      return
    }

    if (filterType === 'type') {
      setTypeFilter(filterValue as TypeFilterValue)
    }
  }

  const subjectsById = useMemo(() => {
    const lookup: Record<number, SubjectDescriptor> = {}
    for (const subject of subjects) lookup[subject.id] = subject
    return lookup
  }, [subjects])

  const taskFilterOptions = useMemo(
    () => buildTaskFilterOptions(subjects),
    [subjects]
  )

  const activeFilterValues = useMemo(
    () => [`subject:${subjectFilter}`, `type:${typeFilter}`],
    [subjectFilter, typeFilter]
  )

  const filterButtonLabel = useMemo(() => {
    const activeFilters: string[] = []

    if (subjectFilter !== 'all') {
      const subjectLabel = getSubjectFilterLabel(subjectFilter, subjects)

      if (subjectLabel) activeFilters.push(subjectLabel)
    }

    if (typeFilter !== 'all') {
      const typeLabel = getTypeLabel(typeFilter)

      if (typeLabel) activeFilters.push(typeLabel)
    }

    if (activeFilters.length === 0) return 'Filtros'

    return activeFilters.join(' • ')
  }, [subjectFilter, typeFilter, subjects])

  const filteredTaskListItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR')

    return tasks
      .filter(task => {
        const matchesSubject =
          subjectFilter === 'all' ||
          (subjectFilter === 'none'
            ? task.subjectId == null
            : task.subjectId === subjectFilter)

        const matchesType = typeFilter === 'all' || task.type === typeFilter

        const matchesSearch =
          normalizedQuery === '' ||
          task.title.toLocaleLowerCase('pt-BR').includes(normalizedQuery) ||
          task.type.toLocaleLowerCase('pt-BR').includes(normalizedQuery)

        return matchesSubject && matchesType && matchesSearch
      })
      .map(task => {
        const subject =
          task.subjectId != null ? subjectsById[task.subjectId] : undefined
        return {
          id: task.id,
          title: task.title,
          type: task.type,
          subject: subject
            ? {
                id: String(subject.id),
                label: subject.name,
                color: subject.color,
              }
            : NEUTRAL_SUBJECT_TAG,
        }
      })
  }, [tasks, subjectFilter, typeFilter, searchQuery, subjectsById])

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
            options={taskFilterOptions}
            triggerVariant="ghost"
            value={selectedFilterOption}
            selectedValues={activeFilterValues}
            menuMaxHeight={320}
            menuWidth="min(320px, calc(100vw - 32px))"
          />

          <Tooltip
            title={
              isLocalSession
                ? 'Upload indisponível em sessão local. Entre com uma conta real para enviar arquivos.'
                : ''
            }
            disableHoverListener={!isLocalSession}
            disableFocusListener={!isLocalSession}
            disableTouchListener={!isLocalSession}
          >
            <span style={{ display: 'block' }}>
              <AppButton
                label="Upload de Atividade"
                backgroundColor="primary.main"
                data-testid="upload-activity-button"
                disabled={isLocalSession}
                fullWidth
                onClick={() => setIsUploadModalOpen(true)}
                sx={{ minHeight: 48 }}
              />
            </span>
          </Tooltip>
        </Box>

        {isLoading ? (
          <Box className="flex items-center justify-center py-10">
            <CircularProgress size={32} />
          </Box>
        ) : isLocalSession ? (
          <EmptyState
            description="O upload de tarefas exige uma conta real. Faça login com uma conta vinculada ao backend para enviar e listar arquivos."
            title="Indisponível em sessão local"
          />
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

      {!isLocalSession && (
        <UploadActivityModal
          open={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false)
            setSubmitError(null)
          }}
          onAddTask={handleAddTask}
          subjects={subjects}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </AppPageContainer>
  )
}
