import type { User, UserRole } from './user'

export type ParentStatus = 'AGUARDANDO' | 'NEGADO' | 'APROVADO'

export interface AuthCredentials {
  email: string
  password: string
}

export interface LoginApiResponse {
  token: string
  role: UserRole
}

export class ParentStatusError extends Error {
  constructor(public readonly parentStatus: Exclude<ParentStatus, 'APROVADO'>) {
    super(`Acesso bloqueado: ${parentStatus}`)
    this.name = 'ParentStatusError'
  }
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
