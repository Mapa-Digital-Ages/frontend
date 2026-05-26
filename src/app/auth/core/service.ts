import { COOKIE_KEYS } from '@/shared/constants/storage'
import { HttpRequestError, httpClient } from '@/shared/lib/http/client'
import type {
  AuthCredentials,
  LoginApiResponse,
  ParentStatus,
  RegisterCredentials,
} from './types'
import { ParentStatusError } from './types'
import type { User, UserRole } from '@/shared/types/user'
import {
  getCookie,
  removeCookie,
  setCookie,
} from '@/shared/lib/storage/cookies'

const env = (
  import.meta as ImportMeta & {
    env?: Record<string, string | boolean | undefined>
  }
).env

const allowLocalAuth = env?.VITE_MODE === 'development'

const LOCAL_AUTH_PASSWORD = '12345678'

const LOCAL_AUTH_USERS: Array<{
  email: string
  name: string
  role: UserRole
}> = [
  { email: 'admin@mapa.local', name: 'Administrador Local', role: 'admin' },
  { email: 'aluno@mapa.local', name: 'Aluno Local', role: 'aluno' },
  {
    email: 'responsavel@mapa.local',
    name: 'Responsavel Local',
    role: 'responsavel',
  },
  { email: 'empresa@mapa.local', name: 'Empresa Local', role: 'empresa' },
  { email: 'escola@mapa.local', name: 'Escola Local', role: 'escola' },
  {
    email: 'escola.empresa@mapa.local',
    name: 'Escola Empresa Local',
    role: 'escola_empresa',
  },
]

function persistAuthSession(
  result: Pick<LoginApiResponse, 'token' | 'role' | 'name' | 'email'>
) {
  setCookie(COOKIE_KEYS.authToken, result.token)
  setCookie(COOKIE_KEYS.authRole, result.role)
  setCookie(COOKIE_KEYS.authName, result.name)
  setCookie(COOKIE_KEYS.authEmail, result.email)
}

const BACKEND_ROLE_MAP: Record<string, UserRole> = {
  guardian: 'responsavel',
  student: 'aluno',
  admin: 'admin',
  school: 'escola',
  company: 'empresa',
  school_company: 'escola_empresa',
}

function mapBackendRole(rawRole: string): UserRole {
  return BACKEND_ROLE_MAP[rawRole.toLowerCase()] ?? (rawRole as UserRole)
}

function normalizeParentStatus(status?: string): ParentStatus | undefined {
  if (!status) {
    return undefined
  }

  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'WAITING' || normalizedStatus === 'AGUARDANDO') {
    return 'AGUARDANDO'
  }

  if (normalizedStatus === 'REJECTED' || normalizedStatus === 'NEGADO') {
    return 'NEGADO'
  }

  if (normalizedStatus === 'APPROVED' || normalizedStatus === 'APROVADO') {
    return 'APROVADO'
  }

  return undefined
}

function assertParentCanLogin(result: LoginApiResponse) {
  if (result.role !== 'responsavel') {
    return
  }

  if (result.status === 'AGUARDANDO' || result.status === 'NEGADO') {
    throw new ParentStatusError(result.status)
  }
}

function resolveLocalLogin(
  credentials: AuthCredentials
): LoginApiResponse | null {
  const normalizedEmail = credentials.email.trim().toLowerCase()
  const matchedUser = LOCAL_AUTH_USERS.find(
    user => user.email.toLowerCase() === normalizedEmail
  )

  if (!matchedUser || credentials.password !== LOCAL_AUTH_PASSWORD) {
    return null
  }

  return {
    token: `local-token-${matchedUser.role}`,
    role: matchedUser.role,
    name: matchedUser.name,
    email: matchedUser.email,
  }
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<LoginApiResponse> {
    if (allowLocalAuth) {
      const localLoginResult = resolveLocalLogin(credentials)

      if (localLoginResult) {
        persistAuthSession(localLoginResult)
        return localLoginResult
      }
    }

    try {
      const response = await httpClient.post<LoginApiResponse>('login', {
        email: credentials.email,
        password: credentials.password,
      })

      const result: LoginApiResponse = {
        token: response.data.token,
        role: mapBackendRole(response.data.role),
        name: response.data.name,
        email: response.data.email,
        status: normalizeParentStatus(response.data.status),
      }

      assertParentCanLogin(result)
      persistAuthSession(result)

      return result
    } catch (error) {
      if (error instanceof HttpRequestError && error.status === 403) {
        const body = (await error.response?.json().catch(() => null)) as {
          detail?: string
          details?: string
        } | null
        const detail = (body?.detail ?? body?.details ?? '').toUpperCase()

        if (detail.includes('WAITING') || detail.includes('AGUARDANDO'))
          throw new ParentStatusError('AGUARDANDO')
        if (detail.includes('REJECTED') || detail.includes('NEGADO'))
          throw new ParentStatusError('NEGADO')
      }

      throw error
    }
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    await httpClient.post(
      'register/guardian',
      {
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        email: credentials.email,
        password: credentials.password,
      },
      { skipAuth: true }
    )
  },

  getToken(): string | null {
    return getCookie(COOKIE_KEYS.authToken)
  },

  getRole(): UserRole | null {
    return getCookie(COOKIE_KEYS.authRole) as UserRole | null
  },

  getUserId(): string | null {
    const token = getCookie(COOKIE_KEYS.authToken)
    if (!token || token.startsWith('local-token-')) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
      const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const json = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
      const payload = JSON.parse(json) as { user_id?: unknown }
      return typeof payload.user_id === 'string' ? payload.user_id : null
    } catch {
      return null
    }
  },

  getUser(): User | null {
    const token = getCookie(COOKIE_KEYS.authToken)
    const role = getCookie(COOKIE_KEYS.authRole) as UserRole | null
    const name = getCookie(COOKIE_KEYS.authName)
    const email = getCookie(COOKIE_KEYS.authEmail)

    if (!token || !role || !name || !email) {
      return null
    }

    return {
      name,
      email,
      role,
      organization: getCookie(COOKIE_KEYS.authOrganization) ?? undefined,
    }
  },

  logout() {
    removeCookie(COOKIE_KEYS.authToken)
    removeCookie(COOKIE_KEYS.authRole)
    removeCookie(COOKIE_KEYS.authName)
    removeCookie(COOKIE_KEYS.authEmail)
    removeCookie(COOKIE_KEYS.authStatus)
  },
}
