import dayjs from 'dayjs'
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import AppSubjectsTags from './AppSubjectsTags'
import { Pending } from '@mui/icons-material'

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

function getTaskIcon(status: task['status']) {
    if (status === 'done') {
        return <CheckCircleIcon fontSize="small"/>
    }
    return <PendingIcon fontSize="small"/>
}

