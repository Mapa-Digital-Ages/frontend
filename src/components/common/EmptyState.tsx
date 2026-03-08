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
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 4,
        textAlign: 'center',
      }}
      variant="outlined"
    >
      <Box
        sx={theme => ({
          bgcolor: theme.palette.action.hover,
          borderRadius: '50%',
          display: 'grid',
          height: 56,
          placeItems: 'center',
          width: 56,
        })}
      >
        <InboxOutlinedIcon color="action" />
      </Box>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action}
    </Paper>
  )
}

export default EmptyState
