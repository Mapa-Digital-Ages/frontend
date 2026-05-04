import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import { Box, Card, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import ProgressBar from '@/shared/ui/ProgressBar'
import { getSubjectTheme } from '@/shared/utils/themes'
import type { Trail } from '../data/trails'
import { AppColors } from '@/app/theme/core/colors'

function TrailInfoChip({
  children,
  icon,
}: {
  children: ReactNode
  icon: ReactNode
}) {
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={0.5}
      sx={{
        backgroundColor: 'background.default',
        borderRadius: '999px',
        color: 'text.secondary',
        minHeight: 23,
        px: 0.65,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: 1 }}>
        {children}
      </Typography>
    </Stack>
  )
}

interface TrailCardProps {
  trail: Trail
}

export default function TrailCard({ trail }: TrailCardProps) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(trail.subject, {
    mode: theme.palette.mode,
  })

  return (
    <Card
      component="article"
      role="listitem"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: '18px',
        boxShadow: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
        '&:hover': {
          border: '1px solid',
          borderColor: alpha(subjectTheme.color, 0.3),
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ backgroundColor: subjectTheme.color, height: 5 }} />

      <Box sx={{ p: { md: 2.2, xs: 2 } }}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          sx={{ gap: 2, mb: 1.5 }}
        >
          <AppSubjectsTags
            subjects={trail.subject ? [trail.subject] : []}
            size="sm"
          />

          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: alpha(subjectTheme.color, 0.12),
              color: subjectTheme.color,
              borderRadius: '14px',
              display: 'flex',
              height: 40,
              justifyContent: 'center',
              width: 40,
              '& svg': {
                color: 'currentColor',
              },
            }}
          >
            <LayersOutlinedIcon
              sx={{
                fontSize: 22,
                color: AppColors.light.contrastText,
              }}
            />
          </Box>
        </Stack>

        <Typography
          component="h2"
          sx={{
            color: 'text.primary',
            fontSize: 16,
            fontWeight: 800,
            lineHeight: 1.25,
            mb: 1,
          }}
        >
          {trail.name}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: 13,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            lineHeight: 1.45,
            mb: 1.5,
            overflow: 'hidden',
          }}
        >
          {trail.description}
        </Typography>

        <Stack
          alignItems="center"
          direction="row"
          sx={{ flexWrap: 'nowrap', gap: 0.5, mb: 1.5, overflow: 'hidden' }}
        >
          <TrailInfoChip
            icon={<PlayCircleOutlineRoundedIcon sx={{ fontSize: 13 }} />}
          >
            1
          </TrailInfoChip>
          <TrailInfoChip icon={<ArticleOutlinedIcon sx={{ fontSize: 13 }} />}>
            1
          </TrailInfoChip>
          <TrailInfoChip icon={<LayersOutlinedIcon sx={{ fontSize: 13 }} />}>
            {trail.steps} {trail.steps === 1 ? 'etapa' : 'etapas'}
          </TrailInfoChip>
          <TrailInfoChip icon={<AccessTimeRoundedIcon sx={{ fontSize: 13 }} />}>
            {trail.timeEstimate}
          </TrailInfoChip>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
            {trail.completed}/{trail.steps} etapas
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
            {trail.progress}%
          </Typography>
        </Stack>

        <ProgressBar
          showValueLabel
          subject={trail.subject}
          thickness={8}
          value={trail.progress}
          valueLabelVariant="alternative"
        />
      </Box>
    </Card>
  )
}
