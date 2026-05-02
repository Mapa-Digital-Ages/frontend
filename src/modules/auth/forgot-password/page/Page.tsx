import { Box, Stack, Typography, TextField } from '@mui/material'
import AppButton from '@/shared/ui/AppButton'
import AppInput from '@/shared/ui/AppInput'
import AppLink from '@/shared/ui/AppLink'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import React, { useState, useEffect } from 'react'
import type { LayoutMode } from '@/app/layout/AuthLayout'
import { isValidEmail } from '@/shared/utils/validators'

export default function Page() {
  const { setMode } = useOutletContext<{
    setMode: (mode: LayoutMode) => void
  }>()
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [codeError, setCodeError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (step === 1) setMode('forgot_password_email')
    if (step === 2) setMode('forgot_password_code')
    if (step === 3) setMode('forgot_password_new')
  }, [step, setMode])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.substring(value.length - 1)
    }
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setCodeError('')

    // auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`)
      nextInput?.focus()
    }
  }

  function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setEmailError('Informe um e-mail válido.')
      return
    }
    setEmailError('')
    setStep(2)
  }

  function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault()
    if (code.some(d => !d)) {
      setCodeError('Informe o código completo de 6 dígitos.')
      return
    }

    // Mock de validação: só avança se o código for '123456'
    const enteredCode = code.join('')
    if (enteredCode !== '123456') {
      setCodeError('Código inválido. Para testar, use: 123456')
      return
    }

    setCodeError('')
    setStep(3)
  }

  function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setPasswordError('Preencha os dois campos de senha.')
      return
    }
    if (password !== confirmPassword) {
      setPasswordError('As senhas devem ser iguais.')
      return
    }
    setPasswordError('')
    setPassword('')
    setConfirmPassword('')
    navigate(APP_ROUTES.auth.login)
  }

  return (
    <Box
      className="flex flex-col bg-white p-7 md:p-8"
      sx={{
        width: '100%',
        height: { xs: 600, md: 600 },
        border: '1px solid rgba(16, 42, 67, 0.1)',
        borderRadius: '16px',
      }}
    >
      <Box className="min-h-0 flex-1 flex flex-col justify-center">
        {step === 1 && (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmitEmail}
            noValidate
          >
            <AppInput
              label="E-mail"
              type="email"
              icon={<></>}
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              placeholder="voce@exemplo.com"
              labelSx={{ color: '#334155', fontWeight: 600 }}
              backgroundColor="#ffffff"
              error={Boolean(emailError)}
              helperText={emailError || ' '}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 48,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: emailError ? '#dc2626' : '#cbd5e1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: emailError ? '#dc2626' : '#94a3b8',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: emailError ? '#dc2626' : '#359CDF',
                  },
              }}
            />
            <AppButton
              type="submit"
              borderRadius="8px"
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
            >
              Enviar link
            </AppButton>
            <Box className="flex justify-center">
              <AppLink
                to={APP_ROUTES.auth.login}
                sx={{
                  color: '#359CDF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#218cc9',
                    textDecoration: 'underline',
                  },
                }}
              >
                Voltar ao login &rarr;
              </AppLink>
            </Box>
          </form>
        )}

        {step === 2 && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmitCode}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              {code.map((digit, index) => (
                <TextField
                  key={index}
                  id={`code-input-${index}`}
                  value={digit}
                  onChange={e => handleCodeChange(index, e.target.value)}
                  error={Boolean(codeError)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      padding: '12px',
                    },
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                  }}
                />
              ))}
            </Stack>

            {codeError && (
              <Typography
                sx={{ color: '#dc2626', fontSize: '0.85rem', mt: -1 }}
              >
                {codeError}
              </Typography>
            )}

            <Box className="flex justify-start">
              <Typography
                sx={{
                  color: '#359CDF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Reenviar código
              </Typography>
            </Box>

            <AppButton
              type="submit"
              borderRadius="8px"
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
            >
              Enviar
            </AppButton>
            <Box className="flex justify-center">
              <AppLink
                to={APP_ROUTES.auth.login}
                sx={{
                  color: '#359CDF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#218cc9',
                    textDecoration: 'underline',
                  },
                }}
              >
                Voltar ao login &rarr;
              </AppLink>
            </Box>
          </form>
        )}

        {step === 3 && (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmitPassword}
            noValidate
          >
            <AppInput
              label="Senha"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              placeholder="••••••••"
            />
            <AppInput
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
                setPasswordError('')
              }}
              error={Boolean(passwordError)}
              helperText={passwordError || ' '}
              placeholder="••••••••"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: passwordError ? '#dc2626' : '#cbd5e1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: passwordError ? '#dc2626' : '#94a3b8',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: passwordError ? '#dc2626' : '#359CDF',
                  },
              }}
            />
            <AppButton
              type="submit"
              borderRadius="8px"
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
            >
              Salvar senha
            </AppButton>
            <Box className="flex justify-center">
              <AppLink
                to={APP_ROUTES.auth.login}
                sx={{
                  color: '#359CDF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#218cc9',
                    textDecoration: 'underline',
                  },
                }}
              >
                Voltar ao login &rarr;
              </AppLink>
            </Box>
          </form>
        )}
      </Box>
    </Box>
  )
}
