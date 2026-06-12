import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Box, Button, Collapse, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildStudentTrailRoute } from '@/app/router/paths'
import { getSubjectIcon } from '@/shared/utils/subjectIcons'
import SubjectBaseCard from '../../shared/components/SubjectBaseCard'
import type { SubjectGroup } from '../data/trails'

interface SubjectTrailCardProps {
  group: SubjectGroup
}

export default function SubjectTrailCard({ group }: SubjectTrailCardProps) {
  const [open, setOpen] = useState(false)
  const label = group.subject?.label ?? 'Geral'
  const count = group.trails.length
  const countLabel = `${count} ${count === 1 ? 'trilha' : 'trilhas'}`

  return (
    <SubjectBaseCard
      icon={getSubjectIcon(group.subject?.id)}
      progress={group.averageProgress}
      subject={group.subject}
      title={label}
      progressLabel={countLabel}
    >
      <Button
        aria-expanded={open}
        aria-label={`${open ? 'Ocultar' : 'Ver'} trilhas de ${label}`}
        onClick={() => setOpen(prev => !prev)}
        endIcon={
          <ExpandMoreRoundedIcon
            sx={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        }
        sx={{
          color: 'text.primary',
          fontWeight: 700,
          justifyContent: 'space-between',
          textTransform: 'none',
          width: '100%',
        }}
      >
        {open ? 'Ocultar trilhas' : 'Ver trilhas'}
      </Button>

      <Collapse in={open} unmountOnExit>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {group.trails.map(trail => (
            <Box
              key={trail.id}
              component={Link}
              to={buildStudentTrailRoute(trail.id)}
              aria-label={`Abrir trilha ${trail.name}`}
              sx={{
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: 'var(--app-radius-control)',
                color: 'text.primary',
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                px: 1.5,
                py: 1,
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: 'background.default' },
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {trail.name}
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: 13, fontWeight: 600 }}
              >
                {trail.progress}%
              </Typography>
            </Box>
          ))}
        </Stack>
      </Collapse>
    </SubjectBaseCard>
  )
}
