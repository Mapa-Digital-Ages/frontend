import { Alert, Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React, { useEffect } from 'react'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import { useChangePassword } from '../hooks/useChangePassword'

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
  initialEmail?: string
  title?: string
  subjectLabel?: string
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    height: { md: 46, xs: 44 },
  },
  '& .MuiInputBase-input': {
    fontSize: { md: 14, xs: 13 },
  },
}

function focusCodeInput(prefix: string, index: number) {
  document.getElementById(`${prefix}-${index}`)?.focus()
}

function ChangePasswordModal({
  open,
  onClose,
  initialEmail,
  title = 'Alterar senha',
  subjectLabel,
}: ChangePasswordModalProps) {
  const theme = useTheme()
  const codeInputPrefix = React.useId()
  const change = useChangePassword({
    initialEmail,
    isOpen: open,
    onSuccess: () => {
      setTimeout(() => {
        onClose()
      }, 1200)
    },
  })

  useEffect(() => {
    if (open && change.step === 2) {
      focusCodeInput(codeInputPrefix, 0)
    }
  }, [open, change.step, codeInputPrefix])

  function handleCodeChange(index: number, raw: string) {
    change.setCodeDigit(index, raw)
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (digit && index < 5) {
      focusCodeInput(codeInputPrefix, index + 1)
    }
  }

  function handleCodeKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === 'Backspace' && !change.code[index] && index > 0) {
      event.preventDefault()
      focusCodeInput(codeInputPrefix, index - 1)
    }
  }

  function handleCodePaste(
    index: number,
    event: React.ClipboardEvent<HTMLDivElement>
  ) {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!digits) return
    event.preventDefault()
    change.setCodeChunk(index, digits)
    const targetIndex = Math.min(5, index + digits.length - 1 + 1)
    focusCodeInput(codeInputPrefix, Math.min(5, targetIndex))
  }

  const step = change.step

  const confirmLabel = (() => {
    if (step === 1) return 'Enviar código'
    if (step === 2) return 'Validar código'
    return 'Salvar senha'
  })()

  function handleConfirm() {
    if (step === 1) return void change.requestCode()
    if (step === 2) return change.submitCode()
    return void change.confirmReset()
  }

  const description = (() => {
    if (step === 1) {
      return subjectLabel
        ? `Enviaremos um código de verificação para o e-mail de ${subjectLabel}.`
        : 'Enviaremos um código de verificação para o e-mail informado.'
    }
    if (step === 2) {
      return `Digite o código de 6 dígitos enviado para ${change.email}.`
    }
    return 'Defina a nova senha de acesso.'
  })()

  return (
    <AppActionModal
      cancelLabel="Cancelar"
      confirmLabel={confirmLabel}
      description={description}
      disableConfirm={change.isSubmitting || Boolean(change.successMessage)}
      loading={change.isSubmitting}
      mode="form"
      onClose={() => {
        if (change.isSubmitting) return
        onClose()
      }}
      onConfirm={handleConfirm}
      open={open}
      title={title}
      variant="form"
    >
      {change.successMessage ? (
        <Alert
          icon={false}
          severity="success"
          variant="outlined"
          sx={{ borderRadius: '10px', fontSize: 14 }}
        >
          {change.successMessage}
        </Alert>
      ) : step === 1 ? (
        <Box className="grid gap-3">
          <AppInput
            error={Boolean(change.emailError)}
            helperText={change.emailError || ' '}
            label="E-mail"
            onChange={event => change.setEmail(event.target.value)}
            placeholder="responsavel@exemplo.com"
            sx={inputSx}
            type="email"
            value={change.email}
          />
        </Box>
      ) : step === 2 ? (
        <Box className="grid gap-2">
          <Stack direction="row" spacing={1} justifyContent="space-between">
            {change.code.map((digit, index) => (
              <TextField
                key={index}
                id={`${codeInputPrefix}-${index}`}
                value={digit}
                onChange={e => handleCodeChange(index, e.target.value)}
                onKeyDown={e => handleCodeKeyDown(index, e)}
                onPaste={e => handleCodePaste(index, e)}
                error={Boolean(change.codeError)}
                autoComplete="off"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 1,
                  autoComplete: 'one-time-code',
                  name: `change-password-code-${index}`,
                  'aria-label': `Dígito ${index + 1} do código`,
                  'data-1p-ignore': 'true',
                  'data-lpignore': 'true',
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    padding: '12px 0',
                    color: theme.palette.text.primary,
                  },
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    height: 56,
                  },
                }}
              />
            ))}
          </Stack>
          {change.codeError ? (
            <Typography sx={{ color: 'error.main', fontSize: '0.85rem' }}>
              {change.codeError}
            </Typography>
          ) : null}
          {change.generatedCode ? (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Código para teste: {change.generatedCode}
            </Typography>
          ) : null}
          <Typography
            component="button"
            type="button"
            onClick={() => void change.resendCode()}
            disabled={change.isSubmitting}
            sx={{
              alignSelf: 'flex-start',
              background: 'none',
              border: 'none',
              color: change.isSubmitting ? 'text.disabled' : 'primary.main',
              cursor: change.isSubmitting ? 'default' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              padding: 0,
              '&:hover': {
                textDecoration: change.isSubmitting ? 'none' : 'underline',
              },
            }}
          >
            {change.isSubmitting ? 'Reenviando…' : 'Reenviar código'}
          </Typography>
        </Box>
      ) : (
        <Box className="grid gap-3">
          <AppInput
            error={Boolean(change.passwordError)}
            label="Nova senha"
            onChange={event => change.setPassword(event.target.value)}
            placeholder="••••••••"
            sx={inputSx}
            type="password"
            value={change.password}
          />
          <AppInput
            error={Boolean(change.passwordError)}
            helperText={change.passwordError || ' '}
            label="Confirmar nova senha"
            onChange={event => change.setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            sx={inputSx}
            type="password"
            value={change.confirmPassword}
          />
        </Box>
      )}
    </AppActionModal>
  )
}

export default ChangePasswordModal
