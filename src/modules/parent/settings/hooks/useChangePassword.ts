import { useCallback, useEffect, useState } from 'react'
import { forgotPasswordService } from '@/modules/auth/forgot-password/services/service'
import { HttpRequestError } from '@/shared/lib/http/client'
import { isValidEmail } from '@/shared/utils/validators'

export type ChangePasswordStep = 1 | 2 | 3
const PASSWORD_MIN_LENGTH = 8
const EMPTY_CODE = ['', '', '', '', '', ''] as const

export interface UseChangePasswordOptions {
  initialEmail?: string
  isOpen: boolean
  onSuccess?: () => void
}

export interface UseChangePasswordResult {
  step: ChangePasswordStep
  email: string
  setEmail: (value: string) => void
  emailError: string
  code: string[]
  setCodeDigit: (index: number, digit: string) => void
  setCodeChunk: (index: number, digits: string) => void
  clearCode: () => void
  codeError: string
  generatedCode: string | null
  password: string
  setPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  passwordError: string
  isSubmitting: boolean
  successMessage: string | null
  requestCode: () => Promise<void>
  resendCode: () => Promise<void>
  submitCode: () => void
  confirmReset: () => Promise<void>
  reset: () => void
}

export function useChangePassword({
  initialEmail = '',
  isOpen,
  onSuccess,
}: UseChangePasswordOptions): UseChangePasswordResult {
  const [step, setStep] = useState<ChangePasswordStep>(1)
  const [email, setEmail] = useState(initialEmail)
  const [emailError, setEmailError] = useState('')
  const [code, setCode] = useState<string[]>([...EMPTY_CODE])
  const [codeError, setCodeError] = useState('')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStep(1)
    setEmail(initialEmail)
    setEmailError('')
    setCode([...EMPTY_CODE])
    setCodeError('')
    setGeneratedCode(null)
    setPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setIsSubmitting(false)
    setSuccessMessage(null)
  }, [initialEmail])

  useEffect(() => {
    if (isOpen) {
      reset()
    }
  }, [isOpen, reset])

  function updateEmail(value: string) {
    setEmail(value)
    setEmailError('')
  }

  function setCodeDigit(index: number, rawDigit: string) {
    const digit = rawDigit.replace(/\D/g, '').slice(-1)
    setCode(prev => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    setCodeError('')
  }

  function setCodeChunk(index: number, digits: string) {
    const clean = digits.replace(/\D/g, '')
    if (!clean) return
    setCode(prev => {
      const next = [...prev]
      for (let i = 0; i < clean.length && index + i < 6; i++) {
        next[index + i] = clean[i]
      }
      return next
    })
    setCodeError('')
  }

  function clearCode() {
    setCode([...EMPTY_CODE])
    setCodeError('')
  }

  async function requestCode() {
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

  async function resendCode() {
    if (isSubmitting) return
    setCodeError('')
    setCode([...EMPTY_CODE])
    setIsSubmitting(true)
    try {
      const result = await forgotPasswordService.requestReset(email)
      setGeneratedCode(result.resetCode)
    } catch {
      setCodeError('Não foi possível reenviar o código. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function submitCode() {
    if (code.some(d => !d)) {
      setCodeError('Informe o código completo de 6 dígitos.')
      return
    }
    setCodeError('')
    setStep(3)
  }

  async function confirmReset() {
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
      setSuccessMessage('Senha alterada com sucesso.')
      onSuccess?.()
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

  return {
    step,
    email,
    setEmail: updateEmail,
    emailError,
    code,
    setCodeDigit,
    setCodeChunk,
    clearCode,
    codeError,
    generatedCode,
    password,
    setPassword: value => {
      setPassword(value)
      setPasswordError('')
    },
    confirmPassword,
    setConfirmPassword: value => {
      setConfirmPassword(value)
      setPasswordError('')
    },
    passwordError,
    isSubmitting,
    successMessage,
    requestCode,
    resendCode,
    submitCode,
    confirmReset,
    reset,
  }
}
