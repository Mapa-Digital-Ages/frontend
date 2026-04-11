import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { Box, Container, Typography } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import AppButton from '@/components/ui/AppButton'
import { APP_CONFIG } from '@/constants/app'
import { APP_ROUTES } from '@/constants/routes'
import { AppColors } from '@/styles/AppColors'

function AuthLayout() {
  return (
    <Box
      className="py-10 md:py-14"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 10%, #d9e7f5 0%, transparent 30%), linear-gradient(90deg, #e8edf4 0%, #dce5f1 50%, #d2deee 100%)',
      }}
    >
      <Container className="space-y-8 px-3 md:space-y-10" maxWidth="lg">
        <AppButton
          className="rounded-2xl border border-slate-300 bg-white/80 px-4 text-slate-600"
          component={RouterLink}
          startIcon={<ChevronLeftRoundedIcon />}
          to={APP_ROUTES.root}
          variant="outlined"
        >
          Voltar para início
        </AppButton>

        <Box className="mt-4 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
          <Box
            className="rounded-3xl p-5 text-white shadow-[0_12px_32px_rgba(29,78,216,0.28)] md:p-8"
            style={{
              background: '#359CDF',
            }}
          >

            <Box className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold">
              <SecurityRoundedIcon fontSize="small" />
              Acesso seguro à plataforma
            </Box>

            <Typography className="max-w-xl text-3xl font-bold leading-tight md:text-5xl">
              Seja bem-vindo(a)!
            </Typography>
            <Typography className="mt-4 max-w-xl text-lg text-white/90">
            Continue sua jornada de conquistas na {APP_CONFIG.name.toUpperCase()}.
            </Typography>

            <img
              src="/logo-mapa.png"
              alt="Mapa"
              className="w-24 mt-30 block mx-auto"
            />

          </Box>

          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}

export default AuthLayout
