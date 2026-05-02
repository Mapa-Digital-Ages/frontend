import { Alert, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { DEFAULT_ROUTE_BY_ROLE } from '@/app/router/paths'
import { useAuth } from '@/app/auth/hook'
import { loginService } from '../services/service'
import type {
  AuthCredentials,
  ParentStatus,
  RegisterCredentials,
} from '@/app/auth/core/types'
import { ParentStatusError } from '@/app/auth/core/types'
import ParentStatusModal from '@/modules/parent/students/components/ParentStatusModal'
import AuthModeSelect, { type AuthMode } from '../components/AuthModeSelect'
import LoginForm from '../components/LoginForm'

export default function Page() {
  const navigate = useNavigate()
  const { isAuthenticated, login, user } = useAuth()
  const { mode, setMode } = useOutletContext<{
    mode: AuthMode
    setMode: (mode: AuthMode) => void
  }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [parentStatus, setParentStatus] = useState<Exclude<
    ParentStatus,
    'APROVADO'
  > | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  useEffect(() => {
    if (mode !== 'login' && mode !== 'register') {
      setMode('login')
    }
  }, [mode, setMode])

  const activeMode = mode === 'login' || mode === 'register' ? mode : 'login'

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(DEFAULT_ROUTE_BY_ROLE[user.role], { replace: true })
    }
  }, [isAuthenticated, navigate, user])

  async function handleSubmit(values: AuthCredentials | RegisterCredentials) {
    setIsSubmitting(true)
    setErrorMessage(null)
    setParentStatus(null)
    setIsStatusModalOpen(false)

    try {
      if (mode === 'register') {
        if (!('firstName' in values)) {
          throw new Error('Nome não informado para cadastro.')
        }

        await loginService.register(values)
        setParentStatus('AGUARDANDO')
        setIsStatusModalOpen(true)
        return
      }

      await login(values)
      const role = loginService.getRole()
      if (role) {
        navigate(DEFAULT_ROUTE_BY_ROLE[role], { replace: true })
      }
    } catch (error) {
      if (error instanceof ParentStatusError) {
        setParentStatus(error.parentStatus)
        setIsStatusModalOpen(true)
      } else {
        setErrorMessage(
          mode === 'register'
            ? 'Não foi possível criar sua conta.'
            : 'E-mail ou senha inválidos.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      className="flex flex-col bg-white p-7 md:p-8"
      sx={{
        width: '100%',
        height: mode === 'register' ? 720 : 600,
        border: '1px solid rgba(16, 42, 67, 0.1)',
        borderRadius: '16px',
      }}
    >
      <AuthModeSelect
        value={activeMode}
        onChange={nextMode => {
          setMode(nextMode)
          setErrorMessage(null)
        }}
      />

      <Box
        sx={{
          mt: 1,
          height: errorMessage ? 52 : 8,
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {errorMessage && (
          <Alert
            className="items-center py-0"
            severity="error"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              height: { xs: 40, md: 48 },
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              '& .MuiAlert-icon': { color: '#dc2626' },
            }}
          >
            {errorMessage}
          </Alert>
        )}
      </Box>

      <Box className="min-h-0 flex-1">
        <LoginForm
          isSubmitting={isSubmitting}
          key={activeMode}
          mode={activeMode}
          onSubmit={handleSubmit}
        />
      </Box>

      <ParentStatusModal
        open={isStatusModalOpen}
        status={parentStatus ?? ''}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </Box>
  )
}
