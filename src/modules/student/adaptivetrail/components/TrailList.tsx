import { Box, Typography } from '@mui/material'
import SubjectTrailCard from './SubjectTrailCard'
import type { SubjectGroup } from '../types/types'

interface TrailListProps {
  groups: SubjectGroup[]
}

export default function TrailList({ groups }: TrailListProps) {
  if (groups.length === 0) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          border: '1px dashed',
          borderColor: 'background.border',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          minHeight: 180,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Nenhuma trilha encontrada.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 2, md: 2.5 },
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, minmax(0, 1fr))',
          xl: 'repeat(3, minmax(0, 1fr))',
        },
        alignItems: 'stretch',
        width: '100%',
      }}
    >
      {groups.map(group => (
        <SubjectTrailCard key={group.subjectId} group={group} />
      ))}
    </Box>
  )
}
