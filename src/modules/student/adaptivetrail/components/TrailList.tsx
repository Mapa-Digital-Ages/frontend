import { Box, Typography } from '@mui/material'
import TrailCard from './TrailCard'
import type { Trail } from '../data/trails'

interface TrailListProps {
  trails: Trail[]
}

export default function TrailList({ trails }: TrailListProps) {
  if (trails.length === 0) {
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
      {trails.map(trail => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </Box>
  )
}
