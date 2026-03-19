import {
  Card,
  CardContent,
  CardHeader,
  type CardHeaderProps,
  type CardProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import type { ReactNode } from 'react'

interface AppCardProps extends CardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  subheaderTypographyProps?: CardHeaderProps['subheaderTypographyProps']
  titleTypographyProps?: CardHeaderProps['titleTypographyProps']
  contentClassName?: string
  contentSx?: SxProps<Theme>
}

function AppCard({
  title,
  subtitle,
  action,
  subheaderTypographyProps,
  titleTypographyProps,
  children,
  className,
  contentClassName,
  contentSx,
  ...cardProps
}: AppCardProps) {
  return (
    <Card
      {...cardProps}
      className={[
        'rounded-3xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] dark:border-white/10 dark:bg-slate-900/70',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || subtitle || action) && (
        <CardHeader
          action={action}
          subheader={subtitle}
          subheaderTypographyProps={subheaderTypographyProps}
          title={title}
          titleTypographyProps={titleTypographyProps}
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
