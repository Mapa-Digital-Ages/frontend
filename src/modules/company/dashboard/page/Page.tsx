import { Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { companyDashboardService } from '../services/service'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title={companyDashboardService.getTitle()}
        subtitle="Indicadores da unidade."
        variant="company"
      />
      <Typography color="text.secondary" variant="body2">
        Módulo empresa em implantação.
      </Typography>
    </AppPageContainer>
  )
}
