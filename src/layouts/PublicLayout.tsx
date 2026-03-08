import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Box, Container, IconButton, Stack, Typography } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import AppButton from '@/components/ui/AppButton'
import AppTopbar from '@/components/ui/AppTopbar'
import { APP_CONFIG } from '@/constants/app'
import { DEFAULT_ROUTE_BY_ROLE, APP_ROUTES } from '@/constants/routes'
import { ThemeContext } from '@/context/theme-context'
import { useAuth } from '@/hooks/useAuth'
import { useContext } from 'react'

function PublicLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const themeContext = useContext(ThemeContext)
  const dashboardPath = user
    ? DEFAULT_ROUTE_BY_ROLE[user.role]
    : APP_ROUTES.auth.login

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppTopbar
        actions={
          <Stack alignItems="center" direction="row" spacing={1}>
            {isAuthenticated ? (
              <>
                <AppButton
                  component={RouterLink}
                  to={dashboardPath}
                  variant="outlined"
                >
                  Abrir painel
                </AppButton>
                <AppButton onClick={logout} variant="contained">
                  Sair
                </AppButton>
              </>
            ) : (
              <AppButton component={RouterLink} to={APP_ROUTES.auth.login}>
                Ir para login
              </AppButton>
            )}
            <IconButton color="inherit" onClick={themeContext?.toggleMode}>
              {themeContext?.mode === 'dark' ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
          </Stack>
        }
        subtitle="Acesso, autorização e navegação base do frontend."
        title={APP_CONFIG.name}
      />

      <Container maxWidth="lg" sx={{ py: { md: 6, xs: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default PublicLayout
