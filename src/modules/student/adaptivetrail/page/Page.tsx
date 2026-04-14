import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title="Continue sua trilha adaptativa na Mapa!"
        subtitle="Comece pelo primeiro nível e desbloqueie os próximos à medida que avança."
        variant="aluno"
      />
    </AppPageContainer>
  )
}
