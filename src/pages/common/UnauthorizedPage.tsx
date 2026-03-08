import { Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '@/components/ui/AppButton'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { APP_ROUTES } from '@/constants/routes'

function UnauthorizedPage() {
  return (
    <AppPageContainer>
      <AppCard contentSx={{ p: 5 }}>
        <Stack spacing={2}>
          <Typography color="warning.main" variant="overline">
            Acesso restrito
          </Typography>
          <Typography variant="h3">
            Você não tem permissão para esta rota
          </Typography>
          <Typography color="text.secondary">
            O guard de autorização bloqueou o acesso porque o perfil atual não
            corresponde à área solicitada.
          </Typography>
          <AppButton
            component={RouterLink}
            to={APP_ROUTES.root}
            sx={{ alignSelf: 'flex-start' }}
          >
            Ir para o login
          </AppButton>
        </Stack>
      </AppCard>
    </AppPageContainer>
  )
}

export default UnauthorizedPage
