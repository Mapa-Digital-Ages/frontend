import { Stack, Typography } from '@mui/material'
import AppCard from '@/components/ui/AppCard'
import type { AdminStat } from '@/types/common'

interface AdminStatsCardProps {
  stat: AdminStat
}

function AdminStatsCard({ stat }: AdminStatsCardProps) {
  return (
    <AppCard>
      <Stack spacing={1}>
        <Typography color="text.secondary">{stat.label}</Typography>
        <Typography variant="h3">{stat.value}</Typography>
        <Typography color="text.secondary" variant="body2">
          {stat.description}
        </Typography>
      </Stack>
    </AppCard>
  )
}

export default AdminStatsCard
