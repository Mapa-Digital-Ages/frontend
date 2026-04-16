import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader title="Upload de Atividades" subtitle="..." variant="aluno" />
    </AppPageContainer>
  )
}
