import { Box, Stack, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import AppButton from '@/shared/ui/AppButton'
import AppInput from '@/shared/ui/AppInput'
import AppLink from '@/shared/ui/AppLink'
import type {
  AuthCredentials,
  RegisterCredentials,
} from '@/app/auth/core/types'
import {
  hasMinLength,
  isRequired,
  isValidEmail,
} from '@/shared/utils/validators'
import type { AuthMode } from './AuthModeSelect'

interface LoginFormProps {
  isSubmitting?: boolean
  mode: AuthMode
  onSubmit: (values: AuthCredentials | RegisterCredentials) => Promise<void>
}

type LoginFormErrors = Partial<
  Record<
    keyof AuthCredentials | 'confirmPassword' | 'firstName' | 'lastName',
    string
  >
>

function getAuthInputSx(hasError: boolean) {
  const borderColor = hasError ? '#dc2626' : '#cbd5e1'
  const hoverBorderColor = hasError ? '#dc2626' : '#94a3b8'
  const focusedBorderColor = hasError ? '#dc2626' : '#359CDF'

  return {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      height: 48,
      fontSize: '0.95rem',
    },
    '& .MuiInputBase-input': {
      color: '#0f172a',
      caretColor: '#0f172a',
      fontSize: '0.95rem',
      height: '24px',
      lineHeight: '24px',
      paddingBottom: '12px',
      paddingTop: '12px',
      '&::placeholder': {
        color: '#64748b',
        opacity: 1,
      },
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        {
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
          color: '#0f172a',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          height: '24px',
          lineHeight: '24px',
          paddingBottom: '12px',
          paddingTop: '12px',
          WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
          WebkitTextFillColor: '#0f172a',
          caretColor: '#0f172a',
          transition: 'background-color 9999s ease-out 0s',
        },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root, & .MuiIconButton-root': {
      color: '#64748b',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: hoverBorderColor,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: focusedBorderColor,
    },
    '& .MuiFormHelperText-root': {
      color: hasError ? '#dc2626' : '#64748b',
    },
  }
}

function LoginForm({ isSubmitting = false, mode, onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<AuthCredentials>({
    email: '',
    password: '',
  })
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (mode === 'register' && !isRequired(firstName)) {
      nextErrors.firstName = 'Informe seu nome.'
    }

    if (mode === 'register' && !isRequired(lastName)) {
      nextErrors.lastName = 'Informe seu sobrenome.'
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

    const submitValues = {
      email: values.email.trim(),
      password: values.password,
    }

    await onSubmit(
      mode === 'register'
        ? {
            ...submitValues,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }
        : submitValues
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        boxSizing: 'border-box',
        '& .auth-login-input .MuiTypography-root': {
          color: '#334155',
        },
      }}
    >
      <Stack
        spacing={0}
        sx={{
          height: '100%',
          overflowY: 'visible',
          pr: 0.5,
        }}
      >
        {mode === 'register' && (
          <Stack spacing={0}>
            <AppInput
              fullWidth
              className="auth-login-input"
              data-testid="input-firstname"
              backgroundColor="#ffffff"
              type="name"
              error={Boolean(errors.firstName)}
              helperText={errors.firstName ?? ' '}
              inputSize="medium"
              label="Nome"
              onChange={event => {
                setFirstName(event.target.value)
                setErrors(currentErrors => ({
                  ...currentErrors,
                  firstName: undefined,
                }))
              }}
              placeholder="Ex.: Lucas"
              sx={{ ...getAuthInputSx(Boolean(errors.firstName)) }}
              value={firstName}
            />
            <AppInput
              fullWidth
              className="auth-login-input"
              data-testid="input-lastname"
              backgroundColor="#ffffff"
              type="name"
              error={Boolean(errors.lastName)}
              helperText={errors.lastName ?? ' '}
              inputSize="medium"
              label="Sobrenome"
              onChange={event => {
                setLastName(event.target.value)
                setErrors(currentErrors => ({
                  ...currentErrors,
                  lastName: undefined,
                }))
              }}
              placeholder="Ex.: Silva"
              sx={{ ...getAuthInputSx(Boolean(errors.lastName)) }}
              value={lastName}
            />
          </Stack>
        )}

        {mode === 'login' && (
          <Box aria-hidden sx={{ flexShrink: 0, height: { xs: 52, md: 64 } }} />
        )}

        <Stack spacing={0}>
          <AppInput
            className="auth-login-input"
            data-testid="input-email"
            backgroundColor="#ffffff"
            error={Boolean(errors.email)}
            helperText={errors.email ?? ' '}
            inputSize="medium"
            label="E-mail"
            onChange={event => updateField('email', event.target.value)}
            placeholder="voce@exemplo.com"
            sx={getAuthInputSx(Boolean(errors.email))}
            type="email"
            value={values.email}
          />
          <AppInput
            className="auth-login-input"
            data-testid="input-password"
            backgroundColor="#ffffff"
            error={Boolean(errors.password)}
            helperText={errors.password ?? ' '}
            inputSize="medium"
            label="Senha"
            onChange={event => updateField('password', event.target.value)}
            type="password"
            placeholder="Digite sua senha"
            sx={getAuthInputSx(Boolean(errors.password))}
            value={values.password}
          />

          {mode === 'login' && (
            <Box className="flex justify-end">
              <AppLink
                data-testid="link-forgot-password"
                href="#"
                onClick={event => event.preventDefault()}
                sx={{
                  color: '#359CDF',
                  fontSize: '0.875rem',
                  textDecorationColor: '#359CDF',
                  '&:hover': {
                    color: '#218cc9',
                    textDecorationColor: '#218cc9',
                  },
                  '&:active': {
                    color: '#1b78ad',
                  },
                  '&:visited': {
                    color: '#359CDF',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #359CDF',
                  },
                }}
              >
                Esqueci minha senha
              </AppLink>
            </Box>
          )}
        </Stack>

        {mode === 'register' && (
          <AppInput
            className="auth-login-input"
            data-testid="input-confirm-password"
            backgroundColor="#ffffff"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword ?? ' '}
            inputSize="medium"
            label="Confirmar senha"
            placeholder="Confirme sua senha"
            onChange={event => {
              setConfirmPassword(event.target.value)
              setErrors(currentErrors => ({
                ...currentErrors,
                confirmPassword: undefined,
              }))
            }}
            sx={getAuthInputSx(Boolean(errors.confirmPassword))}
            type="password"
            value={confirmPassword}
          />
        )}
      </Stack>

      <AppButton
        data-testid={mode === 'login' ? 'button-login' : 'button-register'}
        borderRadius="8px"
        disabled={isSubmitting}
        fullWidth
        size="medium"
        textColor="#ffffff"
        sx={{
          mt: 2,
          minHeight: 50,
          fontSize: '1rem',
          backgroundColor: '#359CDF',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#218cc9',
            filter: 'none',
          },
          '&.Mui-disabled': {
            backgroundColor: '#9ccfe9',
            color: '#ffffff',
          },
        }}
        type="submit"
      >
        {isSubmitting
          ? 'Processando...'
          : mode === 'login'
            ? 'Entrar'
            : 'Criar conta'}
      </AppButton>
    </Box>
  )
}

export default LoginForm
