import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppSubjectsTags from '@/components/ui/AppSubjectsTags'
import { SUBJECTS } from '@/utils/subjectThemes'
import StudentComponentsShowcase from './components/StudentComponentsShowcase'
import AppInput from '@/components/ui/AppInput'

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
        className="flex min-h-[80vh] flex-col gap-6 rounded-2xl p-8"
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Testes de Input</Typography>

        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="body2">Texto normal</Typography>
            <AppInput placeholder="Digite algo" />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">Email</Typography>
            <AppInput type="email" placeholder="voce@exemplo.com" />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">Senha</Typography>
            <AppInput type="password" placeholder="Digite sua senha" />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">Busca</Typography>
            <AppInput type="search" placeholder="Pesquisar..." />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">Grande</Typography>
            <AppInput inputSize="large" placeholder="Input grande" />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">Customizado</Typography>
            <AppInput
              placeholder="Input customizado"
              customSize={{
                height: 70,
                fontSize: '18px',
                padding: '0 20px',
              }}
            />
          </Stack>
        </Stack>
      </Box>
      <StudentComponentsShowcase />
    </AppPageContainer>
  )
}

export default StudentComponentsPage
