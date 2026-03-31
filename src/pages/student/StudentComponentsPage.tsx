import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/components/ui/AppPageContainer'

function StudentComponentsPage() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography className="text-2xl font-bold text-slate-900 md:text-3xl">
        Componentes
      </Typography>

      <Box className="flex min-h-[80vh] flex-col items-center justify-center rounded-2xl bg-white p-8">
        <Typography className="text-lg text-slate-400">
          Área para testar componentes
        </Typography>
      </Box>
    </AppPageContainer>
  )
}

export default StudentComponentsPage
