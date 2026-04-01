import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppPageContainer from '@/components/ui/AppPageContainer'
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
        className="flex min-h-[80vh] flex-col justify-center rounded-2xl p-8"
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      ></Box>
      <StudentComponentsShowcase />
    </AppPageContainer>
  )
}

export default StudentComponentsPage
