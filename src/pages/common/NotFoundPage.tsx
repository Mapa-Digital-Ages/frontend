import { Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '@/components/ui/AppButton'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { APP_ROUTES } from '@/constants/routes'

function NotFoundPage() {
  return (
    <AppPageContainer>
      <AppCard contentSx={{ p: 5 }}>
        <Stack spacing={2}>
          <Typography color="primary.main" variant="overline">
            404
          </Typography>
          <Typography variant="h3">Página não encontrada</Typography>
          <Typography color="text.secondary">
            A rota solicitada não existe nesta demonstração.
          </Typography>
          <AppButton
            component={RouterLink}
            to={APP_ROUTES.root}
            sx={{ alignSelf: 'flex-start' }}
          >
            Voltar para o login
          </AppButton>
        </Stack>
      </AppCard>
    </AppPageContainer>
  )
}

export default NotFoundPage
