import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme, type Theme } from '@mui/material/styles'
import { useState, type FormEvent } from 'react'
import AppButton from '@/shared/ui/AppButton'
import AppInput from '@/shared/ui/AppInput'
import AppLink from '@/shared/ui/AppLink'
import { APP_ROUTES } from '@/app/router/paths'
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

function getAuthInputSx(hasError: boolean, theme: Theme) {
  const isDark = theme.palette.mode === 'dark'
  const fieldBackground = isDark
    ? alpha(theme.palette.common.white, 0.03)
    : '#ffffff'
  const fieldTextColor = theme.palette.text.primary
  const fieldMutedColor = theme.palette.text.secondary
  const borderColor = hasError
    ? theme.palette.error.main
    : isDark
      ? theme.palette.background.border
      : '#cbd5e1'
  const hoverBorderColor = hasError
    ? theme.palette.error.main
    : isDark
      ? theme.palette.background.hoverBorder
      : '#94a3b8'
  const focusedBorderColor = hasError
    ? theme.palette.error.main
    : theme.palette.primary.main

  return {
    '& .MuiOutlinedInput-root': {
      backgroundColor: fieldBackground,
      color: fieldTextColor,
      height: 48,
      fontSize: '0.95rem',
    },
    '& .MuiInputBase-input': {
      color: fieldTextColor,
      caretColor: fieldTextColor,
      fontSize: '0.95rem',
      height: '24px',
      lineHeight: '24px',
      paddingBottom: '12px',
      paddingTop: '12px',
      '&::placeholder': {
        color: fieldMutedColor,
        opacity: 1,
      },
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        {
          backgroundColor: fieldBackground,
          backgroundImage: 'none',
          color: fieldTextColor,
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          height: '24px',
          lineHeight: '24px',
          paddingBottom: '12px',
          paddingTop: '12px',
          WebkitBoxShadow: `0 0 0 1000px ${fieldBackground} inset`,
          WebkitTextFillColor: fieldTextColor,
          caretColor: fieldTextColor,
          transition: 'background-color 9999s ease-out 0s',
        },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root, & .MuiIconButton-root': {
      color: fieldMutedColor,
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
      color: hasError ? theme.palette.error.main : fieldMutedColor,
    },
  }
}

function LoginForm({ isSubmitting = false, mode, onSubmit }: LoginFormProps) {
  const theme = useTheme()
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
      noValidate
      onSubmit={handleSubmit}
      sx={{
        boxSizing: 'border-box',
        '& .auth-login-input .MuiTypography-root': {
          color: 'text.secondary',
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
              sx={{ ...getAuthInputSx(Boolean(errors.firstName), theme) }}
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
              sx={{ ...getAuthInputSx(Boolean(errors.lastName), theme) }}
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
            sx={getAuthInputSx(Boolean(errors.email), theme)}
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
            placeholder="digite sua senha"
            sx={getAuthInputSx(Boolean(errors.password), theme)}
            value={values.password}
          />

          {mode === 'login' && (
            <Box className="flex justify-end">
              <AppLink
                data-testid="link-forgot-password"
                to={APP_ROUTES.auth.forgotPassword}
                sx={{
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  textDecorationColor: theme.palette.primary.main,
                  '&:hover': {
                    color: 'primary.dark',
                    textDecorationColor: theme.palette.primary.dark,
                  },
                  '&:active': {
                    color: 'primary.dark',
                  },
                  '&:visited': {
                    color: 'primary.main',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.primary.main}`,
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
            sx={getAuthInputSx(Boolean(errors.confirmPassword), theme)}
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
        textColor={theme.palette.common.white}
        sx={{
          bottom: 0,
          backgroundColor: 'primary.main',
          color: theme.palette.common.white,
          fontSize: '1rem',
          left: 0,
          mt: 2,
          minHeight: 50,
          position: 'absolute',
          right: 0,
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.primary.main, 0.45),
            color: alpha(theme.palette.common.white, 0.72),
          },
          '&:hover': {
            backgroundColor: 'primary.dark',
            filter: 'none',
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
