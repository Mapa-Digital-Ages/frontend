import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { Box, Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  action?: ReactNode
  description: string
  title: string
}

function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Paper
      className="flex flex-col items-center gap-1.5 p-6 text-center md:p-8"
      variant="outlined"
      sx={{
        border: '1px dashed',
        borderColor: theme =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
      }}
    >
      <Box className="grid size-14 place-items-center rounded-full bg-black/5 dark:bg-white/10">
        <InboxOutlinedIcon color="action" />
      </Box>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action}
    </Paper>
  )
}

export default EmptyState
