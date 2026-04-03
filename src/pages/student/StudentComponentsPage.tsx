import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppCalendar from '@/components/ui/AppCalendar'
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
        className="flex min-h-[80vh] flex-col gap-6 rounded-2xl bg-white p-8"
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Testes de Input</Typography>

        <Stack spacing={3}>
          <AppInput label="Texto normal" placeholder="Digite algo" />

          <AppInput label="Email" type="email" placeholder="voce@exemplo.com" />

          <AppInput
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
          />

          <AppInput label="Busca" type="search" placeholder="Pesquisar..." />

          <AppInput
            label="Grande"
            inputSize="large"
            placeholder="Input grande"
          />

          <AppInput
            label="Customizado"
            placeholder="Input customizado"
            customSize={{
              height: 70,
              fontSize: '18px',
              padding: '0 20px',
            }}
          />
        </Stack>
      </Box>
      <StudentComponentsShowcase />
    </AppPageContainer>
  )
}

export default StudentComponentsPage
