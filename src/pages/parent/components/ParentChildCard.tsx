import { Chip, Stack, Typography } from '@mui/material'
import AppCard from '@/components/ui/AppCard'
import type { ParentChild } from '@/types/common'

interface ParentChildCardProps {
  child: ParentChild
}

function ParentChildCard({ child }: ParentChildCardProps) {
  return (
    <AppCard>
      <Stack spacing={1.5}>
        <Typography variant="h5">{child.name}</Typography>
        <Chip label={child.grade} size="small" variant="outlined" />
        <Typography color="text.secondary">{child.status}</Typography>
      </Stack>
    </AppCard>
  )
}

export default ParentChildCard
