import dayjs from 'dayjs'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import AppSubjectsTags from './AppSubjectsTags'
import type { SubjectContext } from '@/types/common'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import ListIcon from '@mui/icons-material/List'
import { SxProps, Theme } from '@mui/material'

type Status = 'done' | 'pending' | 'adjust'

export type Task = {
  id: string
  date: string
  title: string
  status: Status
  subject: SubjectContext
}

interface PlannerProps {
  tasks: Task[]
  sx?: SxProps<Theme>
}

const dayMap: Record<string, string> = {
  Monday: 'Segunda',
  Tuesday: 'Terça',
  Wednesday: 'Quarta',
  Thursday: 'Quinta',
  Friday: 'Sexta',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
}

function renderIconBox(icon: React.ReactNode, color: string, bg: string) {
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        color: color,
      }}
    >
      {icon}
    </Box>
  )
}

function getMoreThanOneTaskDayIcon() {
  return renderIconBox(
    <ListIcon sx={{ fontSize: 25 }} />,
    '#6132BD',
    'rgba(97,50,189,0.15)'
  )
}
function getTaskIcon(status: Task['status']) {
  const config = {
    done: {
      icon: <CheckIcon sx={{ fontSize: 25 }} />,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.15)',
    },
    adjust: {
      icon: <FitnessCenterIcon sx={{ fontSize: 25 }} />,
      color: '#eab308',
      bg: 'rgba(234,179,8,0.15)',
    },
    pending: {
      icon: <FitnessCenterIcon sx={{ fontSize: 25 }} />,
      color: '#9ca3af',
      bg: 'rgba(156,163,175,0.15)',
    },
  }

  const current = config[status] || config.pending

  return renderIconBox(current.icon, current.color, current.bg)
}

function PlannerModal({ tasks, sx }: PlannerProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const startOfWeek = dayjs().startOf('week').add(1, 'day')
  const endOfWeek = dayjs().endOf('week').add(1, 'day')

  const tasksThisWeek = tasks.filter(task => {
    const taskDate = dayjs(task.date)

    return (
      taskDate.isAfter(startOfWeek.subtract(1, 'day')) &&
      taskDate.isBefore(endOfWeek.add(1, 'day'))
    )
  })

  const groupedTasks: Record<string, Task[]> = {}
  for (const task of tasksThisWeek) {
    const dayEN = dayjs(task.date).format('dddd')
    const day = dayMap[dayEN]

    if (!groupedTasks[day]) {
      groupedTasks[day] = []
    }
    groupedTasks[day].push(task)
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        p: 2,
        backgroundColor: 'background.paper',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon sx={{ color: '#319BDD', fontSize: 25 }} />
        <Typography variant="h5">Planner da Semana</Typography>
      </Box>

      {Object.entries(groupedTasks).map(([day, dayTasks]) => (
        <Box
          key={day}
          onClick={() => {
            if (dayTasks.length > 1) {
              setSelectedDay(day)
            }
          }}
          sx={{
            mb: 2,
            border: '1px solid',
            borderColor:
              dayTasks.length === 1
                ? alpha(dayTasks[0].subject.color || '#ccc', 0.5)
                : 'divider',
            borderRadius: '12px',
            p: 2,
            cursor: dayTasks.length > 1 ? 'pointer' : 'default',
            transition: '0.2s',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          {dayTasks.length === 1 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getTaskIcon(dayTasks[0].status)}
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {day}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AppSubjectsTags
                      subjects={[dayTasks[0].subject]}
                      size="sm"
                    />
                    <Typography>{dayTasks[0].title}</Typography>
                  </Box>
                </Box>
              </Box>

              <Typography
                sx={{
                  color: 'text.secondary',
                  minWidth: 90,
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                {dayTasks[0].status === 'done'
                  ? 'Concluído'
                  : dayTasks[0].status === 'adjust'
                    ? 'Ajustar'
                    : 'Pendente'}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getMoreThanOneTaskDayIcon()}

                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {day}
                  </Typography>

                  <Typography color="text.secondary">
                    {dayTasks.length} tarefas
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  color: 'text.secondary',
                  width: 110,
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexShrink: 0,
                  fontWeight: 500,
                }}
              >
                Ver tarefas →
              </Typography>
            </Box>
          )}
        </Box>
      ))}

      <Dialog
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {selectedDay}
        </DialogTitle>

        <DialogContent>
          {selectedDay &&
            groupedTasks[selectedDay]?.map(task => (
              <Box
                key={task.id}
                sx={{
                  mb: 2,
                  p: 1.5,
                  border: '1px solid',
                  borderColor: alpha(task.subject.color || '#ccc', 0.5),
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getTaskIcon(task.status)}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AppSubjectsTags subjects={[task.subject]} size="sm" />
                    <Typography>{task.title}</Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: 'text.secondary',
                    minWidth: 90,
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {task.status === 'done'
                    ? 'Concluído'
                    : task.status === 'adjust'
                      ? 'Ajustar'
                      : 'Pendente'}
                </Typography>
              </Box>
            ))}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default PlannerModal
