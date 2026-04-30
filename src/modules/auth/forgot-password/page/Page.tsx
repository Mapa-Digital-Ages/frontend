import { Paper, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import AppButton from '@/shared/ui/AppButton'
import AppInput from '@/shared/ui/AppInput'
import { Link as RouterLink } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import { useState } from 'react'
import { forgotPasswordService } from '../services/service'

export default function Page() {
  const theme = useTheme()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await forgotPasswordService.requestReset(email)
    setSent(true)
  }

  return (
    <Paper
      className="flex flex-col p-7 md:p-8"
      component="form"
      elevation={0}
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor:
          theme.palette.mode === 'dark'
            ? 'background.border'
            : alpha(theme.palette.common.black, 0.1),
        borderRadius: '16px',
        height: { xs: 'auto', md: 480 },
        width: '100%',
      }}
    >
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 1 }}>
        Recuperar senha
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Informe seu e-mail para receber instruções de redefinição.
      </Typography>

      <Stack spacing={2}>
        <AppInput
          label="E-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {sent && (
          <Typography color="success.main" variant="body2">
            Se o e-mail existir, você receberá as próximas etapas em instantes.
          </Typography>
        )}
        <AppButton disabled={!email} type="submit" variant="contained">
          Enviar
        </AppButton>
        <AppButton
          component={RouterLink}
          to={APP_ROUTES.auth.login}
          variant="text"
        >
          Voltar ao login
        </AppButton>
      </Stack>
    </Paper>
  )
}
