import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppCalendar from '@/components/ui/AppCalendar'
import AppSubjectsTags from '@/components/ui/AppSubjectsTags'
import { SUBJECTS } from '@/utils/subjectThemes'
import StudentComponentsShowcase from './components/StudentComponentsShowcase'

function StudentComponentsPage() {
  const theme = useTheme()

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: { md: 24, xs: 20 },
          fontWeight: 700,
        }}
      >
        Componentes
      </Typography>
      <Box
        className="flex min-h-[80vh] rounded-2xl bg-white p-6"
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box className="flex-1">
          <AppCalendar />
        </Box>

        <Box className="flex-1"></Box>
      </Box>
      <StudentComponentsShowcase />
    </AppPageContainer>
  )
}

export default StudentComponentsPage
