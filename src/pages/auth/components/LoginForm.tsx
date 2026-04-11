import { Box, Stack, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import AppLink from '@/components/ui/AppLink'
import type { AuthCredentials } from '@/types/auth'
import { hasMinLength, isRequired, isValidEmail } from '@/utils/validators'
import type { AuthMode } from './AuthModeSelect'

interface LoginFormProps {
  isSubmitting?: boolean
  mode: AuthMode
  onSubmit: (values: AuthCredentials) => Promise<void>
}

type LoginFormErrors = Partial<
  Record<keyof AuthCredentials | 'confirmPassword' | 'fullName', string>
>

function LoginForm({ isSubmitting = false, mode, onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<AuthCredentials>({
    email: 'aluno@mapadigital.com',
    password: '12345678',
    role: 'student',
  })
  const [fullName, setFullName] = useState('Lucas Silva')
  const [confirmPassword, setConfirmPassword] = useState('12345678')
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

    if (mode === 'register' && !isRequired(fullName)) {
      nextErrors.fullName = 'Informe seu nome completo.'
    }

    if (!isRequired(values.email) || !isValidEmail(values.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!hasMinLength(values.password, 8)) {
      nextErrors.password = 'A senha deve ter pelo menos 8 caracteres.'
    }

    if (mode === 'register' && values.password !== confirmPassword) {
      nextErrors.confirmPassword = 'As senhas devem ser iguais.'
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
    <Box
      className="relative h-full"
      component="form"
      onSubmit={handleSubmit}
      sx={{ pb: 8.5 }}
    >
      <Stack
        spacing={mode === 'register' ? 1 : 2}
        sx={{
          height: '100%',
          overflowY: 'visible',
          pr: 0.5,
        }}
      >
        {mode === 'register' && (
          <AppInput
            backgroundColor="background.default"
            error={Boolean(errors.fullName)}
            helperText={errors.fullName ?? ' '}
            inputSize="medium"
            label="Nome completo"
            onChange={event => {
              setFullName(event.target.value)
              setErrors(currentErrors => ({
                ...currentErrors,
                fullName: undefined,
              }))
            }}
            placeholder="Ex.: Lucas Silva"
            value={fullName}
          />
        )}

        <Stack
          spacing={mode === 'register' ? 0 : 3}
          sx={{ pt: mode === 'login' ? { xs: 3, md: 5 } : 0 }}
        >
          <AppInput
            backgroundColor="background.default"
            error={Boolean(errors.email)}
            helperText={errors.email ?? ' '}
            inputSize="medium"
            label="E-mail"
            onChange={event => updateField('email', event.target.value)}
            placeholder="voce@exemplo.com"
            type="email"
            value={values.email}
          />
          <AppInput
            backgroundColor="background.default"
            error={Boolean(errors.password)}
            helperText={errors.password ?? ' '}
            inputSize="medium"
            label="Senha"
            onChange={event => updateField('password', event.target.value)}
            type="password"
            placeholder="digite sua senha"
            value={values.password}
          />

          {mode === 'login' && (
            <Box className="flex justify-end">
              <AppLink
                href="#"
                onClick={event => event.preventDefault()}
                sx={{ fontSize: '0.875rem' }}
              >
                Esqueci minha senha
              </AppLink>
            </Box>
          )}
        </Stack>

        {mode === 'register' && (
          <AppInput
            backgroundColor="background.default"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword ?? ' '}
            inputSize="medium"
            label="Confirmar senha"
            placeholder="confirme sua senha"
            onChange={event => {
              setConfirmPassword(event.target.value)
              setErrors(currentErrors => ({
                ...currentErrors,
                confirmPassword: undefined,
              }))
            }}
            type="password"
            value={confirmPassword}
          />
        )}
      </Stack>

      <AppButton
        className="absolute bottom-0 left-0"
        borderRadius="8px"
        disabled={isSubmitting}
        fullWidth
        size="medium"
        sx={{ minHeight: 50, fontSize: '1rem' }}
        type="submit"
      >
        {isSubmitting
          ? 'Processando...'
          : mode === 'login'
            ? 'Entrar'
            : 'Confirmar cadastro'}
      </AppButton>
    </Box>
  )
}

export default LoginForm
