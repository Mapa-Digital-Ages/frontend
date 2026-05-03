import React from 'react'
import { Box, Typography } from '@mui/material'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { alpha } from '@mui/material/styles'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import type { TagContext } from '@/shared/types/common'

export type Task = {
  id: string
  title: string
  subject: TagContext
  type: TaskType
}

type TaskType = string

type Props = {
  tasks: Task[]
}

function TaskCard({ task }: { task: Task }) {
  const color = task.subject.color || '#9ca3af'

  return (
    <Box
      data-testid={`task-card-${task.id}`}
      sx={{
        height: 84,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        p: 2,
        gap: 2,
        minWidth: 0,
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: 0,
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(color, 0.1),
            color: color,
            borderRadius: '8px',
            flexShrink: 0,
          }}
        >
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: '16px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <AppSubjectsTags subjects={[task.subject]} size="sm" />
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'right',
        }}
      >
        {task.type}
      </Typography>
    </Box>
  )
}

function TaskList({ tasks }: Props) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}
    >
      {tasks.length === 0 ? (
        <Typography color="text.secondary">Nenhuma atividade</Typography>
      ) : (
        tasks.map(task => <TaskCard key={task.id} task={task} />)
      )}
    </Box>
  )
}

export default TaskList
