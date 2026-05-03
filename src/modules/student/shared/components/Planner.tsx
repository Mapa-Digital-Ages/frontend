import dayjs from 'dayjs'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import type { SubjectContext } from '@/shared/types/common'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import ListIcon from '@mui/icons-material/List'
import { SxProps, Theme } from '@mui/material'

type Status = 'done' | 'pending' | 'adjust'

export type Task = {
  id: string
  date: Date
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

const dayOrder: Record<string, number> = {
  Segunda: 0,
  Terça: 1,
  Quarta: 2,
  Quinta: 3,
  Sexta: 4,
  Sábado: 5,
  Domingo: 6,
}

function renderIconBox(icon: React.ReactNode, color: string, bg: string) {
  return (
    <Box
      sx={{
        width: { xs: 30, sm: 36 },
        height: { xs: 30, sm: 36 },
        minWidth: { xs: 30, sm: 36 },
        minHeight: { xs: 30, sm: 36 },
        flexShrink: 0,
        borderRadius: '50%',
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

function getMoreThanOneTaskDayIcon(tasks: Task[]) {
  const allTasksDone = tasks.every(task => task.status === 'done')

  if (allTasksDone) {
    return getTaskIcon('done')
  }

  return renderIconBox(
    <ListIcon sx={{ fontSize: 20 }} />,
    '#6132BD',
    'rgba(97,50,189,0.15)'
  )
}
function getTaskIcon(status: Task['status']) {
  const config = {
    done: {
      icon: <CheckIcon sx={{ fontSize: 20 }} />,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.15)',
    },
    adjust: {
      icon: <FitnessCenterIcon sx={{ fontSize: 20 }} />,
      color: '#eab308',
      bg: 'rgba(234,179,8,0.15)',
    },
    pending: {
      icon: <FitnessCenterIcon sx={{ fontSize: 20 }} />,
      color: '#9ca3af',
      bg: 'rgba(156,163,175,0.15)',
    },
  }

  const current = config[status] || config.pending

  return renderIconBox(current.icon, current.color, current.bg)
}

function Planner({ tasks, sx }: PlannerProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const startOfWeek = dayjs().startOf('week').add(1, 'day')
  const endOfWeek = dayjs().endOf('week').add(1, 'day')

  const tasksThisWeek = tasks.filter(
    task =>
      dayjs(task.date).isAfter(startOfWeek.subtract(1, 'day')) &&
      dayjs(task.date).isBefore(endOfWeek.add(1, 'day'))
  )

  const groupedTasks: Record<string, Task[]> = {}
  for (const task of tasksThisWeek) {
    const day =
      dayMap[dayjs(task.date).format('dddd')] ?? dayjs(task.date).format('dddd')
    if (!groupedTasks[day]) groupedTasks[day] = []
    groupedTasks[day].push(task)
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: { xs: '12px', sm: '16px' },
        p: { xs: 1, sm: 2 },
        backgroundColor: 'background.paper',
        minWidth: 0,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1,
          mb: 2,
          flexWrap: 'wrap',
          minWidth: 0,
        }}
      >
        <CalendarMonthIcon sx={{ color: '#319BDD', fontSize: 25 }} />
        <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
          Planner da Semana
        </Typography>
      </Box>

      {Object.entries(groupedTasks)
        .sort(([a], [b]) => (dayOrder[a] ?? 99) - (dayOrder[b] ?? 99))
        .map(([day, dayTasks]) => (
          <Box
            key={day}
            onClick={() => {
              if (dayTasks.length > 1) setSelectedDay(day)
            }}
            sx={{
              mb: 1,
              flex: 1,
              minWidth: 0,
              border: '1px solid',
              borderColor:
                dayTasks.length === 1
                  ? alpha(dayTasks[0].subject.color || '#ccc', 0.25)
                  : 'divider',
              borderRadius: '12px',
              p: { xs: 1.25, sm: 1.5 },
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
                  flexWrap: 'wrap',
                  minWidth: 0,
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 1.5 },
                    minWidth: 0,
                    flex: { xs: '1 1 100%', sm: '1 1 200px' },
                  }}
                >
                  {getTaskIcon(dayTasks[0].status)}
                  <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                      }}
                    >
                      {day}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        gap: { xs: 0.75, sm: 1 },
                        minWidth: 0,
                      }}
                    >
                      <AppSubjectsTags
                        subjects={[dayTasks[0].subject]}
                        size="sm"
                      />
                      <Typography
                        sx={{
                          overflow: { xs: 'visible', sm: 'hidden' },
                          textOverflow: { xs: 'clip', sm: 'ellipsis' },
                          whiteSpace: { xs: 'normal', sm: 'nowrap' },
                          minWidth: 0,
                          flex: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {dayTasks[0].title}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: 'text.secondary',
                    minWidth: 0,
                    maxWidth: { xs: 'none', sm: 100 },
                    flexShrink: 1,
                    overflow: { xs: 'visible', sm: 'hidden' },
                    textOverflow: { xs: 'clip', sm: 'ellipsis' },
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    textAlign: { xs: 'left', sm: 'right' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                    mt: { xs: 1, sm: 0 },
                    width: { xs: '100%', sm: 'auto' },
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
                  minWidth: 0,
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 2 },
                    minWidth: 0,
                    flex: { xs: '1 1 100%', sm: '1 1 200px' },
                  }}
                >
                  {getMoreThanOneTaskDayIcon(dayTasks)}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                      }}
                    >
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
                    minWidth: 0,
                    maxWidth: { xs: 'none', sm: 110 },
                    textAlign: { xs: 'left', sm: 'right' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                    flexShrink: 1,
                    fontWeight: 500,
                    overflow: { xs: 'visible', sm: 'hidden' },
                    textOverflow: { xs: 'clip', sm: 'ellipsis' },
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    width: { xs: '100%', sm: 'auto' },
                    mt: { xs: 1, sm: 0 },
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
                  borderColor: alpha(task.subject.color || '#ccc', 0.25),
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
                    display: { xs: 'none', sm: 'flex' },
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

export default Planner
