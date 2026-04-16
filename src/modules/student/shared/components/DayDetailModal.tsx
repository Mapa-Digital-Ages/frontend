import { useState } from 'react'
import type { Dayjs } from 'dayjs'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppButton from '@/shared/ui/AppButton'
import { SUBJECTS } from '@/shared/utils/themes'
import type { Task } from './Planner'
import type { SubjectContext } from '@/shared/types/common'

type LocalTask = {
  id: string
  subject: SubjectContext | null
  title: string
  status: Task['status']
}

const subjectOptions: DropdownOption[] = Object.values(SUBJECTS)
  .filter(s => s.id != null)
  .map(s => ({ label: s.label, value: s.id as string }))

const statusOptions: DropdownOption[] = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Ajustar', value: 'adjust' },
  { label: 'Concluído', value: 'done' },
]

const modalContentWidth = 510

function createLocalTask(id: string): LocalTask {
  return { id, subject: null, title: '', status: 'pending' }
}

function createLocalTasks(tasks: Task[]): LocalTask[] {
  if (tasks.length === 0) {
    return [createLocalTask('new-1')]
  }

  return tasks.map(t => ({
    id: t.id,
    subject: t.subject,
    title: t.title,
    status: t.status,
  }))
}

interface DayDetailModalProps {
  open: boolean
  date: Dayjs | null
  tasks: Task[]
  onClose: () => void
  onConfirm: (tasks: Task[]) => void
}

interface DayDetailModalContentProps {
  date: Dayjs
  tasks: Task[]
  onClose: () => void
  onConfirm: (tasks: Task[]) => void
}

function DayDetailModalContent({
  date,
  tasks,
  onClose,
  onConfirm,
}: DayDetailModalContentProps) {
  const [localTasks, setLocalTasks] = useState<LocalTask[]>(() =>
    createLocalTasks(tasks)
  )
  const [counter, setCounter] = useState(() => Math.max(2, tasks.length + 1))
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  function handleConfirm() {
    const hasMissingSubject = localTasks.some(task => task.subject == null)
    const hasMissingTitle = localTasks.some(task => task.title.trim() === '')

    if (hasMissingSubject || hasMissingTitle) {
      setShowValidationErrors(true)
      return
    }

    const result: Task[] = localTasks
      .filter(t => t.subject != null && t.title.trim() !== '')
      .map(t => ({
        id: t.id.startsWith('new-')
          ? `${Date.now()}-${Math.random().toString(36).slice(2)}`
          : t.id,
        date: date.toDate(),
        title: t.title,
        status: t.status,
        subject: t.subject!,
      }))
    onConfirm(result)
    onClose()
  }

  function addTask() {
    setLocalTasks(prev => [...prev, createLocalTask(`new-${counter}`)])
    setCounter(prev => prev + 1)
  }

  function removeTask(id: string) {
    setLocalTasks(prev => prev.filter(t => t.id !== id))
  }

  function updateTask(id: string, changes: Partial<Omit<LocalTask, 'id'>>) {
    setLocalTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...changes } : t))
    )
  }

  return (
    <DialogContent
      dividers
      sx={{
        pt: 2,
        pb: 3,
        display: 'flex',
        justifyContent: 'center',
        scrollbarGutter: 'stable',
      }}
    >
      <Stack
        spacing={2}
        sx={{
          pt: 1,
          width: modalContentWidth,
          maxWidth: '100%',
          flexShrink: 0,
        }}
      >
        {localTasks.map((task, index) => {
          const subjectError = showValidationErrors && task.subject == null
          const titleError = showValidationErrors && task.title.trim() === ''

          return (
            <Stack key={task.id} spacing={1.5}>
              {index > 0 && <Divider />}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Tarefa {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeTask(task.id)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <AppDropdown
                  label="Matéria"
                  options={subjectOptions}
                  value={task.subject?.id ?? ''}
                  onChange={e => {
                    const id = e.target.value as string
                    const subject =
                      Object.values(SUBJECTS).find(s => s.id === id) ?? null
                    updateTask(task.id, { subject })
                  }}
                  placeholder="Matéria"
                  width={249}
                  error={subjectError}
                  helperText={
                    subjectError ? 'Selecione uma matéria.' : undefined
                  }
                />
                <AppDropdown
                  label="Status"
                  options={statusOptions}
                  value={task.status}
                  onChange={e =>
                    updateTask(task.id, {
                      status: e.target.value as Task['status'],
                    })
                  }
                  placeholder="Status"
                  width={249}
                />
              </Stack>
              <AppInput
                placeholder="Descreva a tarefa..."
                value={task.title}
                onChange={e => updateTask(task.id, { title: e.target.value })}
                inputSize="large"
                label="Descrição"
                error={titleError}
                helperText={
                  titleError ? 'Descreva a tarefa antes de salvar.' : undefined
                }
                sx={{ maxWidth: modalContentWidth }}
              />
            </Stack>
          )
        })}

        <Stack direction="row" justifyContent="space-between">
          <AppButton
            backgroundColor="primary.main"
            size="small"
            onClick={addTask}
            startIcon={<AddIcon />}
            label="Adicionar tarefa"
          />
          <AppButton
            backgroundColor="primary.main"
            size="small"
            onClick={handleConfirm}
            label="Confirmar"
          />
        </Stack>
      </Stack>
    </DialogContent>
  )
}

export default function DayDetailModal({
  open,
  date,
  tasks,
  onClose,
  onConfirm,
}: DayDetailModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        {date?.toDate().toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {open && date && (
        <DayDetailModalContent
          date={date}
          tasks={tasks}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </Dialog>
  )
}
