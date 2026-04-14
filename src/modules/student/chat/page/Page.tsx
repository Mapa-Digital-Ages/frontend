import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title="Chat Inteligente"
        subtitle="Tire dúvidas e acompanhe o histórico das conversas criadas durante as atividades."
        variant="aluno"
      />
    </AppPageContainer>
  )
}
