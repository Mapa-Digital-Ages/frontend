import { Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title="Parcerias"
        subtitle="Convênios e redes."
        variant="company"
      />
      <Typography color="text.secondary" variant="body2">
        Gestão de parcerias em construção.
      </Typography>
    </AppPageContainer>
  )
}
