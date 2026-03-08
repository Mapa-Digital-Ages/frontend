import { Typography } from '@mui/material'
import AppCard from '@/components/ui/AppCard'
import type { SummaryMetric } from '@/types/common'

interface StudentSummaryCardProps {
  metric: SummaryMetric
}

function StudentSummaryCard({ metric }: StudentSummaryCardProps) {
  return (
    <AppCard contentSx={{ display: 'grid', gap: 1 }}>
      <Typography color="text.secondary" variant="body2">
        {metric.title}
      </Typography>
      <Typography variant="h3">{metric.value}</Typography>
      <Typography color="text.secondary" variant="body2">
        {metric.helperText}
      </Typography>
    </AppCard>
  )
}

export default StudentSummaryCard
