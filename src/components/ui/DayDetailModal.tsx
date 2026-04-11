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
import AppDropdown, { type DropdownOption } from './AppDropdown'
import AppInput from './AppInput'
import AppButton from './AppButton'
import { SUBJECTS } from '../../utils/subjectThemes'

interface Task {
  id: number
  subject: string
  description: string
  status: string
}

const subjectOptions: DropdownOption[] = Object.values(SUBJECTS)
  .filter(s => s.id != null)
  .map(s => ({
    label: s.label,
    value: s.id as string,
  }))

const statusOptions: DropdownOption[] = [
  { label: 'A fazer', value: 'todo' },
  { label: 'Pendente', value: 'in_progress' },
  { label: 'Concluído', value: 'done' },
]

function createTask(id: number): Task {
  return { id, subject: '', description: '', status: 'todo' }
}

interface DayDetailModalProps {
  open: boolean
  date: Dayjs | null
  onClose: () => void
}

export default function DayDetailModal({
  open,
  date,
  onClose,
}: DayDetailModalProps) {
  const [tasks, setTasks] = useState<Task[]>([createTask(1)])
  const [nextId, setNextId] = useState(2)

  function handleClose() {
    onClose()
    setTasks([createTask(1)])
    setNextId(2)
  }

  function addTask() {
    setTasks(prev => [...prev, createTask(nextId)])
    setNextId(prev => prev + 1)
  }

  function removeTask(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function updateTask(
    id: number,
    field: keyof Omit<Task, 'id'>,
    value: string
  ) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        {date?.toDate().toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2, pb: 3 }}>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {tasks.map((task, index) => (
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
                  value={task.subject}
                  onChange={e =>
                    updateTask(task.id, 'subject', e.target.value as string)
                  }
                  placeholder="Matéria"
                  width={180}
                />
                <AppDropdown
                  label="Status"
                  options={statusOptions}
                  value={task.status}
                  onChange={e =>
                    updateTask(task.id, 'status', e.target.value as string)
                  }
                  placeholder="Status"
                  width={180}
                />
              </Stack>
              <AppInput
                placeholder="Descreva a tarefa..."
                value={task.description}
                onChange={e =>
                  updateTask(task.id, 'description', e.target.value)
                }
                inputSize="large"
                label="Descrição"
                sx={{ maxWidth: 372 }}
              />
            </Stack>
          ))}
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
              onClick={handleClose}
              label="Confirmar"
            />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
