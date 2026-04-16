import { Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title="Relatórios"
        subtitle="Exportações e indicadores."
        variant="company"
      />
      <Typography color="text.secondary" variant="body2">
        Relatórios corporativos em construção.
      </Typography>
    </AppPageContainer>
  )
}
