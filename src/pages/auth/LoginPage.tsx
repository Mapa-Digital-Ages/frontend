import { Alert, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_ROUTE_BY_ROLE } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import type { AuthCredentials } from '@/types/auth'
import LoginForm from './components/LoginForm'

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, login, user } = useAuth()
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

    <Box className="flex items-center justify-center">
      <Box className="w-full max-w-md bg-white rounded-3xl p-6">
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <LoginForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </Box>
    </Box>


)
}

export default LoginPage
