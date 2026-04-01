import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppCalendar from '@/components/ui/AppCalendar'

function StudentComponentsPage() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography className="text-2xl font-bold text-slate-900 md:text-3xl">
        Componentes
      </Typography>

      <Box className="min-h-[80vh] rounded-2xl bg-white p-6">
        <Box className="flex flex-col gap-6 md:flex-row">
          <Box className="flex-1">
            <AppCalendar />
          </Box>

          <Box className="flex-1">
          </Box>
        </Box>
      </Box>
    </AppPageContainer>
  )
}

export default StudentComponentsPage
