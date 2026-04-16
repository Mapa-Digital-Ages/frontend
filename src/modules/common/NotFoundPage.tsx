import { Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { APP_ROUTES } from '@/app/router/paths'

function NotFoundPage() {
  return (
    <AppPageContainer>
      <AppCard contentClassName="gap-2 p-5">
        <Stack className="gap-2">
          <Typography color="primary.main" variant="overline">
            404
          </Typography>
          <Typography variant="h3">Página não encontrada</Typography>
          <Typography color="text.secondary">
            A rota solicitada não existe nesta demonstração.
          </Typography>
          <AppButton
            className="self-start"
            component={RouterLink}
            to={APP_ROUTES.root}
          >
            Voltar para o login
          </AppButton>
        </Stack>
      </AppCard>
    </AppPageContainer>
  )
}

export default NotFoundPage
