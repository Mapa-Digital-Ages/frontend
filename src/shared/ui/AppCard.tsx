import {
  Card,
  CardContent,
  CardHeader,
  type CardProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import React from 'react'
import type { ReactNode } from 'react'

interface AppCardProps extends CardProps {
  action?: ReactNode
  contentClassName?: string
  contentSx?: SxProps<Theme>
  subtitle?: string
  subtitleClassName?: string
  title?: string
  titleClassName?: string
}

function AppCard({
  action,
  children,
  className,
  contentClassName,
  contentSx,
  subtitle,
  subtitleClassName,
  sx,
  title,
  titleClassName,
  ...cardProps
}: AppCardProps) {
  return (
    <Card
      {...cardProps}
      sx={[
        {
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: 'var(--app-radius-card)',
          boxShadow: 'none',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      className={[
        'rounded-3xl solid 1px border border-md border-background-border bg-background-paper shadow-var(--app-card-shadow) text-var(--app-foreground)',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || subtitle || action) && (
        <CardHeader
          action={action}
          subheader={subtitle}
          slotProps={{
            subheader: {
              className: ['text-sm', subtitleClassName]
                .filter(Boolean)
                .join(' '),
            },
            title: {
              className: ['text-xl font-bold', titleClassName]
                .filter(Boolean)
                .join(' '),
            },
          }}
          sx={{
            '& .MuiCardHeader-subheader': {
              color: 'var(--app-muted-foreground)',
            },
            '& .MuiCardHeader-title': {
              color: 'var(--app-foreground)',
            },
          }}
          title={title}
        />
      )}
      <CardContent
        className={['grid gap-3 p-6 md:p-7', contentClassName]
          .filter(Boolean)
          .join(' ')}
        sx={Array.isArray(contentSx) ? contentSx : [contentSx]}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export default AppCard
