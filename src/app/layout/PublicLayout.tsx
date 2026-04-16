import { Box, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import AppButton from '@/shared/ui/AppButton'
import AppTopbar from '@/shared/ui/AppTopbar'
import ThemeModeToggle from '@/shared/ui/ThemeMode'
import { APP_CONFIG } from '@/shared/constants/app'
import { DEFAULT_ROUTE_BY_ROLE, APP_ROUTES } from '@/app/router/paths'
import { useAuth } from '@/app/auth/hook'

function PublicLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const dashboardPath = user
    ? DEFAULT_ROUTE_BY_ROLE[user.role]
    : APP_ROUTES.auth.login

  return (
    <Box className="min-h-screen">
      <AppTopbar
        leading={
          <Box>
            <Typography variant="h6">{APP_CONFIG.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Acesso, autorização e navegação base do frontend.
            </Typography>
          </Box>
        }
        actions={
          <Stack className="flex-row items-center gap-1">
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
            <ThemeModeToggle />
          </Stack>
        }
      />

      <Container className="py-4 md:py-6" maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  )
}

export default PublicLayout
