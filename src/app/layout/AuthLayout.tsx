import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import siteLogo from '@/shared/assets/logos/white_logo.svg'
import { APP_CONFIG } from '@/shared/constants/app'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'

export type LayoutMode =
  | 'login'
  | 'register'
  | 'forgot_password_email'
  | 'forgot_password_code'
  | 'forgot_password_new'

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
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const panelBackground = isDark
    ? theme.palette.background.paper
    : 'linear-gradient(135deg, #359CDF 0%, #218cc9 100%)'
  const panelTextColor = isDark
    ? theme.palette.text.primary
    : theme.palette.common.white
  const panelMutedTextColor = isDark
    ? theme.palette.text.secondary
    : alpha(theme.palette.common.white, 0.9)
  const panelBorderColor = isDark
    ? theme.palette.background.border
    : alpha(theme.palette.common.black, 0.1)
  const badgeBackground = isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.white, 0.14)
  const badgeBorderColor = isDark
    ? theme.palette.background.border
    : alpha(theme.palette.common.white, 0.36)
  const badgeTextColor = isDark ? theme.palette.common.white : panelTextColor
  const badgeIconColor = isDark ? theme.palette.primary.main : panelTextColor
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const getLayoutContent = (currentMode: LayoutMode) => {
    switch (currentMode) {
      case 'register':
        return {
          title: 'Cadastre-se no Mapa Digital',
          subtitle:
            'Seja bem-vindo! Descubra um novo jeito de aprender, acompanhar e transformar a educação.',
        }
      case 'forgot_password_email':
        return {
          title: 'Esqueceu sua senha?',
          subtitle:
            'Você receberá um código no seu e-mail para recuperação de senha.',
        }
      case 'forgot_password_code':
        return {
          title: 'Enviamos um código para seu e-mail',
          subtitle:
            'Insira nos campos destinados o código de verificação de 6 dígitos enviado para seu e-mail.',
        }
      case 'forgot_password_new':
        return {
          title: 'Crie uma nova senha',
          subtitle:
            'Digite e confirme sua nova senha para ter acesso ao seu login.',
        }
      case 'login':
      default:
        return {
          title: 'Entre no Mapa Digital',
          subtitle: 'Bem-vindo de volta! Continue sua jornada de conquistas.',
        }
    }
  }

  const { title, subtitle } = getLayoutContent(mode)
  return (
    <Box
      className="flex items-center justify-center px-4 py-6"
      sx={{
        backgroundColor: 'background.default',
        backgroundImage: 'var(--app-body-gradient)',
        minHeight: '100dvh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        className="grid items-stretch gap-5"
        sx={{
          width: 'min(100%, 1300px)',
          height: { xs: 'auto', md: mode === 'register' ? 720 : 600 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          justifyContent: 'center',
        }}
      >
        <Paper
          className="flex min-h-105 flex-col p-7 md:min-h-0 md:p-9"
          elevation={0}
          sx={{
            background: panelBackground,
            border: '1px solid',
            borderColor: panelBorderColor,
            borderRadius: '16px',
            color: panelTextColor,
          }}
        >
          <Box
            className="mb-7 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-sm font-semibold"
            sx={{
              border: '1px solid',
              borderColor: badgeBorderColor,
              borderRadius: '999px',
              backgroundColor: badgeBackground,
              color: badgeTextColor,
            }}
          >
            <SecurityRoundedIcon sx={{ color: badgeIconColor, fontSize: 18 }} />
            Acesso seguro à plataforma
          </Box>

          <Stack spacing={2}>
            <Typography
              className="max-w-112.5 leading-tight"
              sx={{
                color: panelTextColor,
                fontSize: { md: '30px', xs: '26px' },
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            <Typography
              className="mt-12 max-w-112.5"
              sx={{
                color: panelMutedTextColor,
                fontSize: '16px',
                lineHeight: '21px',
              }}
            >
              {subtitle}
            </Typography>
          </Stack>
          <SiteLogo />
        </Paper>

        <Outlet context={{ mode, setMode }} />
      </Box>
    </Box>
  )
}

export default AuthLayout
