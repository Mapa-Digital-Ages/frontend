import { Box, Stack, Typography, TextField } from '@mui/material'
import AppButton from '@/shared/ui/AppButton'
import AppInput from '@/shared/ui/AppInput'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import React, { useState, useEffect } from 'react'
import type { LayoutMode } from '@/app/layout/AuthLayout'

export default function Page() {
  const { setMode } = useOutletContext<{ setMode: (mode: LayoutMode) => void }>()
  
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
    
    // auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`)
      nextInput?.focus()
    }
  }

  function handleSubmitEmail(e: React.FormEvent) {
    e.preventDefault()
    setStep(2)
  }

  function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault()
    setStep(3)
  }

  function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault()
    setPassword('')
    setConfirmPassword('')
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmitEmail}>
            <AppInput
              label="E-mail"
              type="text"
              icon={<></>}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="voce@exemplo.com"
            />
            <AppButton type="submit" variant="contained" disabled={!email} sx={{ mt: 2 }}>
              Enviar link
            </AppButton>
            <AppButton
              component={RouterLink}
              to={APP_ROUTES.auth.login}
              variant="text"
            >
              Voltar ao login &rarr;
            </AppButton>
          </form>
        )}

        {step === 2 && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmitCode}>
            <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 1 }}>
              {code.map((digit, index) => (
                <TextField
                  key={index}
                  id={`code-input-${index}`}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.25rem', padding: '12px' }
                  }}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              ))}
            </Stack>
            
            <Box className="flex justify-start">
              <Typography sx={{ color: '#359CDF', fontSize: '14px', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' }}}>
                Reenviar código
              </Typography>
            </Box>

            <AppButton type="submit" variant="contained" disabled={code.some(d => !d)} sx={{ mt: 2 }}>
              Enviar
            </AppButton>
            <AppButton
              component={RouterLink}
              to={APP_ROUTES.auth.login}
              variant="text"
            >
              Voltar ao login &rarr;
            </AppButton>
          </form>
        )}

        {step === 3 && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmitPassword}>
            <AppInput
              label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <AppInput
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <AppButton type="submit" variant="contained" disabled={!password || !confirmPassword || password !== confirmPassword} sx={{ mt: 2 }}>
              Salvar senha
            </AppButton>
            <AppButton
              component={RouterLink}
              to={APP_ROUTES.auth.login}
              variant="text"
            >
              Voltar ao login &rarr;
            </AppButton>
          </form>
        )}
      </Box>
    </Box>
  )
}
