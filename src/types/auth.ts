import type { User, UserRole } from './user'

export interface AuthCredentials {
  email: string
  password: string
  role: UserRole
}

export interface AuthSession {
  token: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => void
}
