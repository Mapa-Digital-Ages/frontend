import { Alert, Box, Paper } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
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
  const theme = useTheme()
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
        if (!('name' in values)) {
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
    <Paper
      className="flex flex-col p-7 md:p-8"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor:
          theme.palette.mode === 'dark'
            ? 'background.border'
            : alpha(theme.palette.common.black, 0.1),
        borderRadius: '16px',
        height: { xs: 600, md: 600 },
        width: '100%',
      }}
    >
      <AuthModeSelect
        value={mode}
        onChange={nextMode => {
          setMode(nextMode)
          setErrorMessage(null)
        }}
      />

      <Box
        sx={{
          mt: 1,
          height: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {errorMessage && (
          <Alert
            className="items-center py-0"
            severity="error"
            sx={{
              height: { xs: 40, md: 48 },
              left: 0,
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          >
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

      <ParentStatusModal
        open={isStatusModalOpen}
        status={parentStatus ?? ''}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </Paper>
  )
}
