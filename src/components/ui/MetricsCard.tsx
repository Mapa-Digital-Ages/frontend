import {
  Box,
  Card,
  CardContent,
  Typography,
  type CardProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import type { ReactNode } from 'react'

interface MetricsCardProps extends CardProps {
  contentClassName?: string
  contentSx?: SxProps<Theme>
  title?: string
  icon?: ReactNode
  iconColor?: string
  iconBackground?: string
  value?: string | number
}

function MetricsCard({
  className,
  contentClassName,
  contentSx,
  title,
  icon,
  iconColor,
  iconBackground,
  value,
  ...cardProps
}: MetricsCardProps) {
  return (
    <Card
      {...cardProps}
      className={[
        'rounded-3xl solid 1px border border-md border-var(--app-border-strong) bg-var(--app-surface) shadow-var(--app-card-shadow) text-var(--app-foreground)',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CardContent
        className={['grid gap-3 p-6 md:p-7', contentClassName]
          .filter(Boolean)
          .join(' ')}
        sx={Array.isArray(contentSx) ? contentSx : [contentSx]}
      >
        <Box className="flex items-start justify-between">
          <Typography className="text-lg" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Box
            className="grid size-12 place-items-center rounded-2xl"
            sx={{
              backgroundColor: iconBackground,
              color: iconColor,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          className="text-3xl font-bold md:text-[2.5rem]"
          sx={{
            color: 'text.primary',
            fontSize: { md: 25, xs: 10 },
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MetricsCard
