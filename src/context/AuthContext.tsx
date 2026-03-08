import { useState, type PropsWithChildren } from 'react'
import { authService } from '@/services/auth.service'
import type { AuthContextValue, AuthState, AuthCredentials } from '@/types/auth'
import { AuthContext } from './auth-context'

function getInitialState(): AuthState {
  const session = authService.getSession()

  if (session) {
    return {
      user: session.user,
      token: session.token,
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
    const session = await authService.login(credentials)

    setAuthState({
      user: session.user,
      token: session.token,
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
