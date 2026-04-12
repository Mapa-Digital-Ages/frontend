import { useState, type PropsWithChildren } from 'react'
import { authService } from '@/services/auth.service'
import type { AuthContextValue, AuthState, AuthCredentials } from '@/types/auth'
import { AuthContext } from './auth-context'

function getInitialState(): AuthState {
  const token = authService.getToken()
  const role = authService.getRole()

  if (token && role) {
    return {
      user: { id: '', name: '', email: '', role },
      token,
      status: 'authenticated',
    }
  }

  return {
    user: null,
    token: null,
    status: 'unauthenticated',
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>(getInitialState)

  async function login(credentials: AuthCredentials) {
    const result = await authService.login(credentials)

    setAuthState({
      user: { id: '', name: '', email: '', role: result.role },
      token: result.token,
      status: 'authenticated',
    })
  }

  function logout() {
    authService.logout()

    setAuthState({
      user: null,
      token: null,
      status: 'unauthenticated',
    })
  }

  const value: AuthContextValue = {
    ...authState,
    isAuthenticated: authState.status === 'authenticated',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
