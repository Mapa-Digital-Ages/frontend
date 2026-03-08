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
    <Stack
      alignItems={{ md: 'center', xs: 'flex-start' }}
      direction={{ md: 'row', xs: 'column' }}
      justifyContent="space-between"
      spacing={2}
    >
      <Box>
        {eyebrow && (
          <Typography
            color="primary.main"
            sx={{ letterSpacing: 1.2, mb: 0.5 }}
            variant="overline"
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3">{title}</Typography>
        {subtitle && (
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body1">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions}
    </Stack>
  )
}

export default PageHeader
