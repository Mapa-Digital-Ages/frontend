import { Alert, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_ROUTE_BY_ROLE } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import type { AuthCredentials } from '@/types/auth'
import AuthModeSelect, { type AuthMode } from './components/AuthModeSelect'
import LoginForm from './components/LoginForm'

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, login, user } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(DEFAULT_ROUTE_BY_ROLE[user.role], { replace: true })
    }
  }, [isAuthenticated, navigate, user])

  async function handleSubmit(values: AuthCredentials) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await login(values)
      navigate(DEFAULT_ROUTE_BY_ROLE[values.role], { replace: true })
    } catch {
      setErrorMessage('Falha ao iniciar a sessão mock.')
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
      <AuthModeSelect
        value={mode}
        onChange={nextMode => {
          setMode(nextMode)
          setErrorMessage(null)
        }}
      />

      <Box className="min-h-4">
        {errorMessage && (
          <Alert className="h-12 items-center py-0" severity="error">
            {errorMessage}
          </Alert>
        )}
      </Box>

      <Box className="min-h-0 flex-1">
        <LoginForm
          isSubmitting={isSubmitting}
          key={mode}
          mode={mode}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  )
}

export default LoginPage
