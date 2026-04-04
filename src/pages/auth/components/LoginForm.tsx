import { Box, Button, MenuItem, Stack, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import { ROLE_LABELS, USER_ROLES } from '@/constants/roles'
import type { AuthCredentials } from '@/types/auth'
import { hasMinLength, isRequired, isValidEmail } from '@/utils/validators'

interface LoginFormProps {
  isSubmitting?: boolean
  onSubmit: (values: AuthCredentials) => Promise<void>
}

type LoginMode = 'login' | 'register'
type LoginFormErrors = Partial<
  Record<keyof AuthCredentials | 'confirmPassword' | 'fullName', string>
>

function LoginForm({ isSubmitting = false, onSubmit }: LoginFormProps) {
  const [mode, setMode] = useState<LoginMode>('login')
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
    <Stack className="gap-4" component="form" onSubmit={handleSubmit}>
      <Box className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-200 p-1">
        <Button
          className={[
            'rounded-xl py-2 text-base font-semibold transition',
            mode === 'login' ? 'bg-white text-slate-900' : 'text-slate-500',
          ].join(' ')}
          onClick={() => setMode('login')}
          type="button"
        >
          Login
        </Button>
        <Button
          className={[
            'rounded-xl py-2 text-base font-semibold transition',
            mode === 'register' ? 'bg-white text-slate-900' : 'text-slate-500',
          ].join(' ')}
          onClick={() => setMode('register')}
          type="button"
        >
          Cadastro
        </Button>
      </Box>

      {mode === 'register' && (
        <AppInput
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
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
          backgroundColor="background.default"
        />
      )}

      <AppInput
        error={Boolean(errors.email)}
        helperText={errors.email}
        label="E-mail"
        onChange={event => updateField('email', event.target.value)}
        placeholder="voce@exemplo.com"
        value={values.email}
        backgroundColor="background.default"
      />

      {mode === 'register' ? (
        <Box className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AppInput
            error={Boolean(errors.password)}
            helperText={errors.password}
            label="Senha"
            onChange={event => updateField('password', event.target.value)}
            placeholder="Mín. 8 caracteres"
            type="password"
            value={values.password}
            backgroundColor="background.default"
          />
          <AppInput
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            label="Confirmar senha"
            onChange={event => {
              setConfirmPassword(event.target.value)
              setErrors(currentErrors => ({
                ...currentErrors,
                confirmPassword: undefined,
              }))
            }}
            placeholder="Repita a senha"
            type="password"
            value={confirmPassword}
            backgroundColor="background.default"
          />
        </Box>
      ) : (
        <AppInput
          error={Boolean(errors.password)}
          helperText={errors.password}
          label="Senha"
          onChange={event => updateField('password', event.target.value)}
          type="password"
          value={values.password}
          backgroundColor="background.default"
        />
      )}

      <AppInput
        error={Boolean(errors.role)}
        helperText={errors.role}
        label={mode === 'register' ? 'Perfil de acesso' : 'Perfil'}
        onChange={event =>
          updateField('role', event.target.value as AuthCredentials['role'])
        }
        select
        value={values.role}
        backgroundColor="background.default"
      >
        {USER_ROLES.map(role => (
          <MenuItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </MenuItem>
        ))}
      </AppInput>

      <AppButton
        className="mt-1"
        disabled={isSubmitting}
        size="medium"
        type="submit"
        borderRadius="50px"
      >
        {isSubmitting
          ? 'Processando...'
          : mode === 'login'
            ? 'Entrar'
            : 'Criar conta'}
      </AppButton>

      <Typography className="text-center text-sm text-slate-500">
        {mode === 'login'
          ? 'Use as credenciais mockadas para acessar.'
          : 'Cadastro em modo demonstrativo para validação visual.'}
      </Typography>
    </Stack>
  )
}

export default LoginForm
