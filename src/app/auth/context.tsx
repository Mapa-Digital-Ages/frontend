/* eslint-disable react-refresh/only-export-components -- AuthContext e AuthProvider no mesmo módulo */
import { createContext, useState, type PropsWithChildren } from 'react'
import { authService } from './core/service'
import type { AuthContextValue, AuthCredentials, AuthState } from './core/types'

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
)

function getInitialState(): AuthState {
  const token = authService.getToken()
  const user = authService.getUser()

  if (token && user) {
    return { user, token, status: 'authenticated' }
  }

  return { user: null, token: null, status: 'unauthenticated' }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>(getInitialState)

  async function login(credentials: AuthCredentials) {
    const result = await authService.login(credentials)

    setAuthState({
      user: {
        name: result.name,
        email: result.email,
        role: result.role,
      },
      token: result.token,
      status: 'authenticated',
    })
  }

  function logout() {
    authService.logout()
    setAuthState({ user: null, token: null, status: 'unauthenticated' })
  }

  const value: AuthContextValue = {
    ...authState,
    isAuthenticated: authState.status === 'authenticated',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
