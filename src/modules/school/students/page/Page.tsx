import { Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title="Alunos"
        subtitle="Cadastro e matrículas."
        variant="school"
      />
      <Typography color="text.secondary" variant="body2">
        Lista de alunos será carregada da API.
      </Typography>
    </AppPageContainer>
  )
}
