import dayjs from 'dayjs'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  hideStatus?: boolean
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
        width: 36,
        height: 36,
        minWidth: 36,
        minHeight: 36,
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

function Planner({ tasks, sx, hideStatus = false }: PlannerProps) {
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
        borderRadius: '16px',
        p: 2,
        backgroundColor: 'background.paper',
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
        <Typography variant="h5">Planner da Semana</Typography>
      </Box>

      <List disablePadding sx={{ display: 'grid', gap: 1 }}>
        {Object.entries(groupedTasks)
          .sort(([a], [b]) => (dayOrder[a] ?? 99) - (dayOrder[b] ?? 99))
          .map(([day, dayTasks]) => (
            <ListItemButton
              component={dayTasks.length > 1 ? 'button' : 'div'}
              disableRipple={dayTasks.length <= 1}
              key={day}
              onClick={
                dayTasks.length > 1 ? () => setSelectedDay(day) : undefined
              }
              sx={{
                border: '1px solid',
                borderColor:
                  dayTasks.length === 1
                    ? alpha(dayTasks[0].subject.color || '#ccc', 0.25)
                    : 'divider',
                borderRadius: '12px',
                cursor: dayTasks.length > 1 ? 'pointer' : 'default',
                display: 'block',
                flex: 1,
                minWidth: 0,
                p: 1.5,
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
                      alignItems: 'center',
                      gap: 1.5,
                      minWidth: 0,
                      flex: '1 1 200px',
                    }}
                  >
                    {getTaskIcon(dayTasks[0].status)}
                    <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                        {day}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          minWidth: 0,
                        }}
                      >
                        <AppSubjectsTags
                          subjects={[dayTasks[0].subject]}
                          size="sm"
                        />
                        <Typography
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {dayTasks[0].title}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {!hideStatus && (
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        minWidth: 0,
                        maxWidth: 100,
                        flexShrink: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
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
                  )}
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
                      alignItems: 'center',
                      gap: 2,
                      minWidth: 0,
                      flex: '1 1 200px',
                    }}
                  >
                    {getMoreThanOneTaskDayIcon(dayTasks)}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                        {day}
                      </Typography>
                      <Typography color="text.secondary">
                        {dayTasks.length} tarefas
                      </Typography>
                    </Box>
                  </Box>

                  {!hideStatus && (
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        minWidth: 0,
                        maxWidth: 110,
                        textAlign: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        flexShrink: 1,
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: { xs: '100%', sm: 'auto' },
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      Ver tarefas →
                    </Typography>
                  )}
                </Box>
              )}
            </ListItemButton>
          ))}
      </List>

      <Dialog
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {selectedDay}
        </DialogTitle>

        <DialogContent>
          <List disablePadding sx={{ display: 'grid', gap: 2 }}>
            {selectedDay &&
              groupedTasks[selectedDay]?.map(task => (
                <ListItem
                  key={task.id}
                  disablePadding
                  secondaryAction={
                    !hideStatus ? (
                      <Typography
                        sx={{
                          alignItems: 'center',
                          color: 'text.secondary',
                          display: { xs: 'none', sm: 'flex' },
                          justifyContent: 'flex-end',
                          minWidth: 90,
                          textAlign: 'right',
                        }}
                      >
                        {task.status === 'done'
                          ? 'Concluído'
                          : task.status === 'adjust'
                            ? 'Ajustar'
                            : 'Pendente'}
                      </Typography>
                    ) : undefined
                  }
                  sx={{
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: alpha(task.subject.color || '#ccc', 0.25),
                    borderRadius: '10px',
                    justifyContent: 'space-between',
                    p: 1.5,
                    pr: hideStatus ? 1.5 : { sm: 13, xs: 1.5 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    {getTaskIcon(task.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <AppSubjectsTags subjects={[task.subject]} size="sm" />
                        <Typography>{task.title}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Planner
