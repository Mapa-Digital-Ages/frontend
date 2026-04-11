import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { Box, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import siteLogo from '@/assets/logos/white_logo.svg'
import { APP_CONFIG } from '@/constants/app'

function SiteLogo() {
  return (
    <Box
      className="flex w-full flex-1 items-center justify-center"
      sx={{ minHeight: { xs: 140, md: 220 }, py: { xs: 4, md: 5 } }}
    >
      <Box
        component="img"
        src={siteLogo}
        alt={`${APP_CONFIG.name} logo`}
        sx={{
          width: 'clamp(150px, 45%, 220px)',
          height: 'auto',
          maxWidth: '100%',
        }}
      />
    </Box>
  )
}

function AuthLayout() {
  return (
    <Box
      className="flex items-center justify-center px-4 py-6"
      sx={{
        minHeight: '100dvh',
        backgroundColor: '#edf4f7',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        className="grid items-stretch gap-5"
        sx={{
          width: 'min(100%, 1300px)',
          height: { xs: 'auto', md: 600 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          justifyContent: 'center',
        }}
      >
        <Box
          className="flex min-h-[420px] flex-col p-7 text-white md:min-h-0 md:p-9"
          sx={{
            background: '#359CDF',
            border: '1px solid rgba(16, 42, 67, 0.1)',
            borderRadius: '16px',
          }}
        >
          <Box
            className="mb-7 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-sm font-semibold"
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.36)',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
            }}
          >
            <SecurityRoundedIcon sx={{ fontSize: 18 }} />
            Acesso seguro à plataforma
          </Box>

          <Typography className="max-w-[310px] text-4xl font-bold leading-tight">
            {APP_CONFIG.name}
          </Typography>
          <Typography className="mt-4 max-w-[330px] text-base leading-7 text-white/90">
            Acompanhe a aprendizagem com clareza, rotina e cuidado em um único
            lugar.
          </Typography>

          <SiteLogo />
        </Box>

        <Outlet />
      </Box>
    </Box>
  )
}

export default AuthLayout
