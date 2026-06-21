import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  TextField,
} from '@mui/material'
import AppButton from '@/shared/ui/AppButton'
import AppInput from '@/shared/ui/AppInput'
import AppLink from '@/shared/ui/AppLink'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import React, { useEffect, useMemo, useState } from 'react'
import type { LayoutMode } from '@/app/layout/AuthLayout'
import { isValidEmail } from '@/shared/utils/validators'
import { forgotPasswordService } from '../services/service'
import { parsePasswordResetLink } from '../services/resetLink'
import { HttpRequestError } from '@/shared/lib/http/client'

const PASSWORD_MIN_LENGTH = 8

export default function Page() {
  const { setMode } = useOutletContext<{
    setMode: (mode: LayoutMode) => void
  }>()
  const navigate = useNavigate()
  const location = useLocation()
  const resetLink = useMemo(
    () => parsePasswordResetLink(location.hash),
    [location.hash]
  )

  const [step, setStep] = useState<1 | 2 | 3>(() => (resetLink ? 3 : 1))
  const [email, setEmail] = useState(() => resetLink?.email ?? '')
  const [emailError, setEmailError] = useState('')
  const [code, setCode] = useState(() =>
    resetLink ? resetLink.code.split('') : ['', '', '', '', '', '']
  )
  const [codeError, setCodeError] = useState('')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (step === 1) setMode('forgot_password_email')
    if (step === 2) setMode('forgot_password_code')
    if (step === 3) setMode('forgot_password_new')
  }, [step, setMode])

  useEffect(() => {
    if (resetLink) {
      navigate(APP_ROUTES.auth.forgotPassword, { replace: true })
    }
  }, [navigate, resetLink])

  const focusCodeInput = (index: number) => {
    document.getElementById(`code-input-${index}`)?.focus()
  }

  const handleCodeChange = (index: number, rawValue: string) => {
    const digit = rawValue.replace(/\D/g, '').slice(-1)
    const newCode = [...code]
    newCode[index] = digit
    setCode(newCode)
    setCodeError('')

    if (digit && index < 5) {
      focusCodeInput(index + 1)
    }
  }

  const handleCodeKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      event.preventDefault()
      focusCodeInput(index - 1)
    }
  }

  const handleCodePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLDivElement>
  ) => {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!digits) return
    event.preventDefault()

    const newCode = [...code]
    for (
      let offset = 0;
      offset < digits.length && index + offset < 6;
      offset++
    ) {
      newCode[index + offset] = digits[offset]
    }
    setCode(newCode)
    setCodeError('')

    const nextEmpty = newCode.findIndex((d, i) => i >= index && !d)
    focusCodeInput(nextEmpty === -1 ? 5 : nextEmpty)
  }

  async function handleResendCode() {
    if (isSubmitting) return
    setCodeError('')
    setCode(['', '', '', '', '', ''])
    setIsSubmitting(true)
    try {
      const result = await forgotPasswordService.requestReset(email)
      setGeneratedCode(result.resetCode)
      focusCodeInput(0)
    } catch {
      setCodeError('Não foi possível reenviar o código. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    if (!isValidEmail(email)) {
      setEmailError('Informe um e-mail válido.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await forgotPasswordService.requestReset(email)
      setGeneratedCode(result.resetCode)
      setEmailError('')
      setStep(2)
    } catch {
      setEmailError('Não foi possível enviar o código. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault()
    if (code.some(d => !d)) {
      setCodeError('Informe o código completo de 6 dígitos.')
      return
    }

    setCodeError('')
    setStep(3)
  }

  async function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    if (!password || !confirmPassword) {
      setPasswordError('Preencha os dois campos de senha.')
      return
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(
        `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`
      )
      return
    }
    if (password !== confirmPassword) {
      setPasswordError('As senhas devem ser iguais.')
      return
    }

    setIsSubmitting(true)
    try {
      await forgotPasswordService.confirmReset({
        email,
        code: code.join(''),
        newPassword: password,
      })
      setPasswordError('')
      setPassword('')
      setConfirmPassword('')
      navigate(APP_ROUTES.auth.login)
    } catch (error) {
      if (error instanceof HttpRequestError && error.status === 422) {
        setPasswordError(
          `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`
        )
        return
      }
      setPassword('')
      setConfirmPassword('')
      setCodeError('Código inválido ou expirado.')
      setStep(2)
    } finally {
      setIsSubmitting(false)
    }
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
              disabled={isSubmitting}
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
              {isSubmitting ? (
                <CircularProgress size={22} sx={{ color: '#ffffff' }} />
              ) : (
                'Enviar link'
              )}
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
                  onKeyDown={e => handleCodeKeyDown(index, e)}
                  onPaste={e => handleCodePaste(index, e)}
                  error={Boolean(codeError)}
                  autoComplete="off"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 1,
                    autoComplete: 'one-time-code',
                    name: `reset-code-${index}`,
                    'aria-label': `Dígito ${index + 1} do código`,
                    'data-1p-ignore': 'true',
                    'data-lpignore': 'true',
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      padding: '12px 0',
                      color: '#0f172a',
                    },
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      height: 60,
                      backgroundColor: '#ffffff',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: codeError ? '#dc2626' : '#475569',
                      borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: codeError ? '#dc2626' : '#1e293b',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: codeError ? '#dc2626' : '#359CDF',
                        borderWidth: '2px',
                      },
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

            {generatedCode && (
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                Código para teste: {generatedCode}
              </Typography>
            )}

            <Box className="flex justify-start items-center gap-2">
              <Typography
                component="button"
                type="button"
                onClick={handleResendCode}
                disabled={isSubmitting}
                sx={{
                  color: isSubmitting ? '#94a3b8' : '#359CDF',
                  fontSize: '14px',
                  cursor: isSubmitting ? 'default' : 'pointer',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  '&:hover': {
                    textDecoration: isSubmitting ? 'none' : 'underline',
                  },
                }}
              >
                {isSubmitting ? 'Reenviando…' : 'Reenviar código'}
              </Typography>
              {isSubmitting && (
                <CircularProgress size={14} sx={{ color: '#359CDF' }} />
              )}
            </Box>

            <AppButton
              type="submit"
              borderRadius="8px"
              textColor="#ffffff"
              disabled={isSubmitting}
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
              label="E-mail"
              type="email"
              value={email}
              InputProps={{ readOnly: true }}
              labelSx={{ color: '#334155', fontWeight: 600 }}
              backgroundColor="#f8fafc"
            />
            <AppInput
              label="Senha"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              placeholder="••••••••"
              labelSx={{ color: '#334155', fontWeight: 600 }}
              backgroundColor="#ffffff"
              error={Boolean(passwordError)}
              sx={{
                '& .MuiOutlinedInput-root': { height: 48 },
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
              labelSx={{ color: '#334155', fontWeight: 600 }}
              backgroundColor="#ffffff"
              sx={{
                '& .MuiOutlinedInput-root': { height: 48 },
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
              disabled={isSubmitting}
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
              {isSubmitting ? (
                <CircularProgress size={22} sx={{ color: '#ffffff' }} />
              ) : (
                'Salvar senha'
              )}
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
