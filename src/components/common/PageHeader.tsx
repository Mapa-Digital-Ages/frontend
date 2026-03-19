import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  actions?: ReactNode
  eyebrow?: string
  subtitle?: string
  title: string
}

function PageHeader({ actions, eyebrow, subtitle, title }: PageHeaderProps) {
  return (
    <Stack className="flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <Box className="min-w-0">
        {eyebrow && (
          <Typography
            className="mb-0.5 tracking-[0.12em]"
            color="primary.main"
            variant="overline"
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3">{title}</Typography>
        {subtitle && (
          <Typography className="mt-1" color="text.secondary" variant="body1">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions}
    </Stack>
  )
}

export default PageHeader
