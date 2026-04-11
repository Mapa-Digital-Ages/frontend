import { Box, Button, MenuItem, Stack, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import { ROLE_LABELS, USER_ROLES } from '@/constants/roles'
import type { AuthCredentials } from '@/types/auth'
import { hasMinLength, isRequired, isValidEmail } from '@/utils/validators'
import AppLink from '@/components/ui/AppLink'

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
    <Stack className="gap-6" component="form" onSubmit={handleSubmit}>
      <Box className="grid grid-cols-2 gap-1 rounded-[10px] border border-slate-200 bg-slate-200 p-1 h-10">
        <Button
          className={[
            'rounded-md text-base font-semibold transition !min-h-0 !h-8',
            mode === 'login' ? '!bg-[#359CDF] !text-white' : '!text-slate-500',
          ].join(' ')}
          onClick={() => setMode('login')}
          type="button"
        >
          Login
        </Button>
        <Button
          className={[
            'rounded-md text-base font-semibold transition !min-h-0 !h-8',
            mode === 'register' ? '!bg-[#359CDF] !text-white' : '!text-slate-500',
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
        type="email"
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
        <Box className="flex flex-col">
          <AppInput
            error={Boolean(errors.password)}
            helperText={errors.password}
            label="Senha"
            onChange={event => updateField('password', event.target.value)}
            type="password"
            value={values.password}
            backgroundColor="background.default"
          />

          <AppLink to="/forgot-password" className="text-sx self-end ml-auto mt-1">
            Esqueci minha senha
          </AppLink>
        </Box>
        
      )}


      <AppButton
        className="mt-1"
        disabled={isSubmitting}
        size="medium"
        type="submit"
        borderRadius="12px"
      >
        {isSubmitting
          ? 'Processando...'
          : mode === 'login'
            ? 'Entrar'
            : 'Criar conta'}
      </AppButton>
    </Stack>
  )
}

export default LoginForm
