import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import { Box, type CardProps, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { buildStudentTrailRoute } from '@/app/router/paths'
import SubjectBaseCard from '../../shared/components/SubjectBaseCard'
import type { Trail } from '../data/trails'
import { getSubjectIcon } from '@/shared/utils/subjectIcons'

function TrailInfoChip({
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
  return (
    <SubjectBaseCard
      aria-label={`Abrir trilha ${trail.name}`}
      component={Link}
      to={buildStudentTrailRoute(trail.id)}
      icon={getSubjectIcon(trail.subject?.id)}
      progress={trail.progress}
      subject={trail.subject}
      title={trail.subject?.label ?? trail.name}
      progressLabel={`${trail.progress}% concluído`}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    ></SubjectBaseCard>
  )
}
