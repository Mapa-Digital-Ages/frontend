import {
  Box,
  Card,
  CardContent,
  Typography,
  type CardProps,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import type { SubjectContext } from '@/types/common'
import { getSubjectTheme } from '@/utils/subjectThemes'
import ProgressBar from '@/components/ui/ProgressBar'

type SubjectBaseCardProps = CardProps & {
  icon: ReactNode
  progress: number
  progressLabel?: string
  subject?: SubjectContext
  title: string
}

function SubjectBaseCard({
  icon,
  progress,
  progressLabel,
  subject = { label: 'Geral' },
  title,
  ...cardProps
}: SubjectBaseCardProps) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(subject, { mode: theme.palette.mode })
  const normalizedProgress = Math.max(0, Math.min(100, progress))
  const resolvedLabel =
    progressLabel ?? `${Math.round(normalizedProgress)}% concluído`

  return (
    <Card
      {...cardProps}
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        boxShadow: 'var(--app-card-shadow)',
        overflow: 'hidden',
        position: 'relative',
        ...cardProps.sx,
      }}
    >
      <Box
        sx={{
          backgroundColor: subjectTheme.color,
          height: 8,
          width: '100%',
        }}
      />
      <CardContent
        sx={{
          display: 'grid',
          gap: { xs: 1.5, sm: 2 },
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: subjectTheme.color,
              borderRadius: 'var(--app-radius-control)',
              color: subjectTheme.solidSurface.color,
              display: 'grid',
              flexShrink: 0,
              height: { xs: 44, sm: 52 },
              width: { xs: 44, sm: 52 },
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { xs: 20, sm: 22 },
              fontWeight: 700,
              lineHeight: 1,
              textAlign: 'right',
            }}
          >
            {Math.round(normalizedProgress)}%
          </Typography>
        </Box>

        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { xs: 24, sm: 28 },
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>

        <ProgressBar
          showValueLabel={false}
          subject={subject}
          value={progress}
        />

        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: 13, sm: 14 },
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {resolvedLabel}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SubjectBaseCard
