import { Chip, Stack, Typography } from '@mui/material'
import AppCard from '@/components/ui/AppCard'
import type { PartnerProject } from '@/types/common'

interface PartnerProjectCardProps {
  project: PartnerProject
}

function PartnerProjectCard({ project }: PartnerProjectCardProps) {
  return (
    <AppCard>
      <Stack spacing={1.5}>
        <Typography variant="h5">{project.name}</Typography>
        <Chip label={project.status} size="small" variant="outlined" />
        <Typography color="text.secondary">
          Escolas impactadas: {project.schools}
        </Typography>
      </Stack>
    </AppCard>
  )
}

export default PartnerProjectCard
