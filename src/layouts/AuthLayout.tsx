import { Box, Container, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { APP_CONFIG } from '@/constants/app'

function AuthLayout() {
  return (
    <Container maxWidth="lg" sx={{ py: { md: 8, xs: 4 } }}>
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { lg: '1.1fr 0.9fr', xs: '1fr' },
          minHeight: '70vh',
        }}
      >
        <Paper
          sx={{
            bgcolor: 'primary.dark',
            color: 'primary.contrastText',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { md: 5, xs: 4 },
          }}
        >
          <Box>
            <Typography sx={{ letterSpacing: 1.4 }} variant="overline">
              Autenticação
            </Typography>
            <Typography sx={{ mt: 1 }} variant="h2">
              Acesse ao {APP_CONFIG.name}.
            </Typography>
            <Typography
              sx={{ mt: 2, maxWidth: 520 }}
              variant="body1"
            ></Typography>
          </Box>

          <Typography
            color="primary.contrastText"
            sx={{ opacity: 0.72 }}
            variant="body2"
          ></Typography>
        </Paper>

        <Outlet />
      </Box>
    </Container>
  )
}

export default AuthLayout
