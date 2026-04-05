import dayjs from 'dayjs'
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import AppSubjectsTags from './AppSubjectsTags'

type Status = 'done' | 'pending' | 'adjust'

type Task = {
    id: string
    date: string
    title: string
    status: Status
    subject: {
        id: string
        label: string
        color: string
    }
}

interface PlannerModalProps {
    open: boolean
    onClose: () => void
    tasks: Task[]
}

const weekOrder = [
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
    'domingo',
]

function getTaskIcon(status: Task['status']) {
    if (status === 'done') {
        return <CheckCircleIcon fontSize="small"/>
    }
    return <PendingIcon fontSize="small"/>
}

function PlannerModal({ open, onClose, tasks }: PlannerModalProps) {
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
        const dayKey = dayjs(task.date).format('dddd')

        if(!groupedTasks[dayKey]) {
            groupedTasks[dayKey] = []
        }
        groupedTasks[dayKey].push(task)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pr:6 }}>
                Planner da Semana
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{ position: 'absolute', right: 12, top: 12 }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
            </DialogTitle>

            <DialogContent>
                {weekOrder.map(day => {
                    const tasks = groupedTasks[day] || []

                    return (
                        <Box key={day} sx={{ mb: 2 }}>
                            <Typography sx={{ fontWeight: 600, mb: 1}}>
                                {day}
                            </Typography>

                            {tasks.length === 0? (
                                <Typography variant="caption" color="text.secondary">
                                    Nenhuma tarefa
                                </Typography>
                            ) : (
                            tasks.map(task => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: 1.5, mb: 1}}
                                >
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    
                                    <Box
                                        sx={{
                                            color:
                                            task.status === 'done' ? 'success.main'
                                            : task.status === 'adjust' ? 'warning.main'
                                            : 'text.disabled',
                                        }}
                                    >
                                        {getTaskIcon(task.status)}
                                    </Box>

                                    <Box>
                                        <AppSubjectsTags subjects={[task.subject]} size="sm" />

                                        <Typography variant="body2">
                                                {task.title}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                        task.status === 'done' ? 'success.main'
                                        : task.status === 'adjust' ? 'warning.main'
                                        : 'text.secondary',
                                        fontWeight: 500,
                                    }}
                                >
                                    {task.status === 'done' ? 'concluído'
                                    : task.status === 'adjust' ? 'ajustar'
                                    : 'pendente'}
                                </Typography>
                                </Box>
                            ))
                            )}
                        </Box>
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}

export default PlannerModal