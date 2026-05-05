import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="enterpriseSchool"
        title="Dashboard Escola & Empresa"
        subtitle="Gerencie turmas, parceiros e escolas apadrinhadas em um só lugar."
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          minHeight: 200,
        }}
      >
        <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
          Em construção — conteúdos serão exibidos aqui.
        </Typography>
      </Box>
    </AppPageContainer>
  )
}
