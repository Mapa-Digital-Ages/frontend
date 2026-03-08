import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import { Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import EmptyState from '@/components/common/EmptyState'
import AppCard from '@/components/ui/AppCard'
import type { StudentTask } from '@/types/common'
import { formatDate } from '@/utils/formatters'

interface StudentTaskListProps {
  tasks: StudentTask[]
  title?: string
}

const STATUS_CONFIG = {
  pending: {
    color: 'warning',
    icon: <PendingActionsRoundedIcon />,
    label: 'Pendente',
  },
  inProgress: {
    color: 'info',
    icon: <PlayCircleOutlineRoundedIcon />,
    label: 'Em andamento',
  },
  completed: {
    color: 'success',
    icon: <CheckCircleOutlineRoundedIcon />,
    label: 'Concluída',
  },
} as const

function StudentTaskList({
  tasks,
  title = 'Próximas tarefas',
}: StudentTaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        description="Nenhuma tarefa disponível para este perfil no momento."
        title="Sem tarefas"
      />
    )
  }

  return (
    <AppCard title={title}>
      <List disablePadding>
        {tasks.map(task => {
          const status = STATUS_CONFIG[task.status]

          return (
            <ListItem
              disableGutters
              divider
              key={task.id}
              secondaryAction={
                <Chip
                  color={status.color}
                  label={status.label}
                  size="small"
                  variant="outlined"
                />
              }
              sx={{ pr: 12 }}
            >
              <ListItemIcon>{status.icon}</ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={`${task.subject} • Entrega em ${formatDate(task.dueDate)}`}
              />
            </ListItem>
          )
        })}
      </List>
    </AppCard>
  )
}

export default StudentTaskList
