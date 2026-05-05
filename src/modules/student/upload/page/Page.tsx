import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import TaskList from '@/modules/student/shared/components/TaskList'
import UploadActivityModal, {
  type UploadTaskPayload,
} from '@/modules/student/shared/components/UploadActivityModal'
import { uploadService } from '@/modules/student/upload/services/uploadService'
import type { UploadItem } from '@/modules/student/upload/types/types'
import { authService } from '@/app/auth/core/service'
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

function mapUploadToTask(upload: UploadItem): UploadedTask {
  return {
    id: upload.id,
    title: upload.file_name,
    type: upload.file_type.startsWith('image/')
      ? 'Imagem'
      : upload.file_type === 'application/pdf'
        ? 'PDF'
        : upload.file_type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ? 'Documento'
          : 'Arquivo',
    subject: 'matematica',
  }
}

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [tasks, setTasks] = useState<UploadedTask[]>([])
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilterValue>('all')
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
            description="Nenhuma tarefa para a disciplina selecionada."
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
