import {
  Card,
  CardContent,
  CardHeader,
  type CardProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import type { ReactNode } from 'react'

interface AppCardProps extends CardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  contentSx?: SxProps<Theme>
}

function AppCard({
  title,
  subtitle,
  action,
  children,
  contentSx,
  ...cardProps
}: AppCardProps) {
  return (
    <Card {...cardProps}>
      {(title || subtitle || action) && (
        <CardHeader action={action} subheader={subtitle} title={title} />
      )}
      <CardContent
        sx={[{ p: 3 }, ...(Array.isArray(contentSx) ? contentSx : [contentSx])]}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export default AppCard
