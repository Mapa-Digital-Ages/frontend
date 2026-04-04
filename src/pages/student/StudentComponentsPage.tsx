import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppButton from '@/components/ui/AppButton'

function StudentComponentsPage() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography className="text-2xl font-bold text-slate-900 md:text-3xl">
        Componentes
      </Typography>

      <Box className="flex min-h-[80vh] flex-col items-center justify-center rounded-2xl bg-white p-8">
        <Typography className="text-lg text-slate-400"></Typography>

        {}
        <AppButton
          size="small"
          color="primary"
          label="Sou pequeno e padrao"
          borderRadius={0}
        />

        {}
        <AppButton
          size="medium"
          color="secondary"
          label="Sou qual cor?"
          hasBorder={true}
          borderRadius="8px"
          iconPosition="left"
        />

        {}
        <AppButton
          size="large"
          color="error"
          label="Sou grande e laranja"
          borderRadius="50%"
          iconPosition="right"
        />
        <AppButton
          label="Voltar"
          iconPosition="left"
          hasBorder={true}
          borderRadius="50px"
          color="primary"
        />
        <AppButton label="Confirmar" color="warning" />
        <AppButton label="Botao padrao conforme solicitado" />
        <AppButton color="info" label="Botao com cor info"></AppButton>
      </Box>
    </AppPageContainer>
  )
}

export default StudentComponentsPage
