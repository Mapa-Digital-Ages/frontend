import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { Box, Typography, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'
import siteLogo from '@/assets/logos/white_logo.svg'
import { APP_CONFIG } from '@/constants/app'
import type { AuthMode } from '@/pages/auth/components/AuthModeSelect'
import { useState } from 'react'

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
  const [mode, setMode] = useState<'login' | 'register'>('login')
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

          <Stack spacing={2}>
            <Typography
              className="max-w-[450px] leading-tight"
              sx={{ fontSize: '30px', fontWeight: 700 }}
            >
              {mode === 'register'
                ? 'Cadastre-se no Mapa Digital'
                : 'Entre no Mapa Digital'}
            </Typography>

            <Typography
              className="mt-12 max-w-[450px] text-white/90"
              sx={{ fontSize: '16px', lineHeight: '21px' }}
            >
              {mode === 'register'
                ? 'Seja bem-vindo! Descubra um novo jeito de aprender, acompanhar e transformar a educação.'
                : 'Bem-vindo de volta! Continue sua jornada de conquistas.'}
            </Typography>
          </Stack>
          <SiteLogo />
        </Box>

        <Outlet context={{ mode, setMode }} />
      </Box>
    </Box>
  )
}

export default AuthLayout
