import { Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { schoolDashboardService } from '../services/service'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title={schoolDashboardService.getTitle()}
        subtitle="Visão geral da instituição."
        variant="school"
      />
      <Typography color="text.secondary" variant="body2">
        Módulo escola em implantação — métricas e atalhos aparecerão aqui.
      </Typography>
    </AppPageContainer>
  )
}
