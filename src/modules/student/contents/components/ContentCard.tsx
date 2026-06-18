import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getSubjectTheme } from '@/shared/utils/themes'
import AppCard from '@/shared/ui/AppCard'
import { AppTag } from '@/shared/ui/AppTags'
import ProgressBar from '@/shared/ui/ProgressBar'
import type { ContentTrail } from '../types/types'

function ContentInfoChip({
  children,
  icon,
}: {
  children: React.ReactNode
  icon: React.ReactNode
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
        minHeight: 26,
        px: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1 }}>
        {children}
      </Typography>
    </Stack>
  )
}

interface ContentCardProps {
  content: ContentTrail
}

export default function ContentCard({ content }: ContentCardProps) {
  const theme = useTheme()
  const subject = content.subject ?? { label: 'Geral' }
  const subjectTheme = getSubjectTheme(subject, { mode: theme.palette.mode })
  const completedLabel = `${content.completedSteps}/${content.steps} etapas`

  return (
    <AppCard
      contentClassName="p-0"
      contentSx={{ display: 'block', p: 0 }}
      data-testid={`content-card-${content.id}`}
      sx={{
        boxShadow: 'var(--app-card-shadow)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{ backgroundColor: subjectTheme.color, height: 4, width: '100%' }}
      />

      <Box sx={{ display: 'grid', gap: 1.5, p: { sm: 3, xs: 2 } }}>
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <AppTag size="sm" tag={subject} />
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: subjectTheme.icon.backgroundColor,
              borderRadius: 'var(--app-radius-control)',
              color: subjectTheme.icon.color,
              display: 'grid',
              height: 40,
              justifyContent: 'center',
              width: 40,
            }}
          >
            <LayersOutlinedIcon fontSize="small" />
          </Box>
        </Box>

        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { sm: 20, xs: 18 },
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {content.name}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            fontSize: 13,
            lineHeight: 1.4,
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {content.description}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          <ContentInfoChip
            icon={<PlayCircleOutlineRoundedIcon sx={{ fontSize: 14 }} />}
          >
            {content.videoCount}
          </ContentInfoChip>
          <ContentInfoChip icon={<ArticleOutlinedIcon sx={{ fontSize: 14 }} />}>
            {content.articleCount}
          </ContentInfoChip>
          <ContentInfoChip icon={<LayersOutlinedIcon sx={{ fontSize: 14 }} />}>
            {content.steps} etapas
          </ContentInfoChip>
          <ContentInfoChip
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
          >
            {content.timeEstimate}
          </ContentInfoChip>
        </Stack>

        <ProgressBar
          headerSlot={
            <Typography
              sx={{ color: 'text.secondary', fontSize: 13, fontWeight: 600 }}
            >
              {completedLabel}
            </Typography>
          }
          subject={subject}
          value={content.progress}
          valueLabelVariant="subject"
        />
      </Box>
    </AppCard>
  )
}
