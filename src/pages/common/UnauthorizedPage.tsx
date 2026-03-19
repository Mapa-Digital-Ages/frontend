import { Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '@/components/ui/AppButton'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { APP_ROUTES } from '@/constants/routes'

function UnauthorizedPage() {
  return (
    <AppPageContainer>
      <AppCard contentClassName="gap-2 p-5">
        <Stack className="gap-2">
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
            className="self-start"
            component={RouterLink}
            to={APP_ROUTES.root}
          >
            Ir para o login
          </AppButton>
        </Stack>
      </AppCard>
    </AppPageContainer>
  )
}

export default UnauthorizedPage
