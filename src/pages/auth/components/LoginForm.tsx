import { Alert, MenuItem, Stack } from '@mui/material'
import { useState, type FormEvent } from 'react'
import AppButton from '@/components/ui/AppButton'
import AppCard from '@/components/ui/AppCard'
import AppInput from '@/components/ui/AppInput'
import { ROLE_LABELS, USER_ROLES } from '@/constants/roles'
import type { AuthCredentials } from '@/types/auth'
import { hasMinLength, isRequired, isValidEmail } from '@/utils/validators'

interface LoginFormProps {
  isSubmitting?: boolean
  onSubmit: (values: AuthCredentials) => Promise<void>
}

type LoginFormErrors = Partial<Record<keyof AuthCredentials, string>>

function LoginForm({ isSubmitting = false, onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<AuthCredentials>({
    email: 'aluno@mapadigital.com',
    password: '123456',
    role: 'student',
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})

  function updateField<K extends keyof AuthCredentials>(
    field: K,
    value: AuthCredentials[K]
  ) {
    setValues(currentValues => ({
      ...currentValues,
      [field]: value,
    }))
    setErrors(currentErrors => ({
      ...currentErrors,
      [field]: undefined,
    }))
  }

  function validate() {
    const nextErrors: LoginFormErrors = {}

    if (!isRequired(values.email) || !isValidEmail(values.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!hasMinLength(values.password, 6)) {
      nextErrors.password = 'A senha mock deve ter pelo menos 6 caracteres.'
    }

    if (!isRequired(values.role)) {
      nextErrors.role = 'Selecione um perfil.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit(values)
  }

  return (
    <AppCard contentSx={{ p: 4 }}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
        <Alert severity="info">Use o e-mail e senha mockados para teste.</Alert>

        <AppInput
          error={Boolean(errors.email)}
          helperText={errors.email}
          label="E-mail"
          onChange={event => updateField('email', event.target.value)}
          placeholder="voce@mapadigital.com"
          value={values.email}
        />

        <AppInput
          error={Boolean(errors.password)}
          helperText={errors.password}
          label="Senha"
          onChange={event => updateField('password', event.target.value)}
          type="password"
          value={values.password}
        />

        <AppInput
          error={Boolean(errors.role)}
          helperText={errors.role}
          label="Perfil"
          onChange={event =>
            updateField('role', event.target.value as AuthCredentials['role'])
          }
          select
          value={values.role}
        >
          {USER_ROLES.map(role => (
            <MenuItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </MenuItem>
          ))}
        </AppInput>

        <AppButton disabled={isSubmitting} size="large" type="submit">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </AppButton>
      </Stack>
    </AppCard>
  )
}

export default LoginForm
