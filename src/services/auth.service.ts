import { COOKIE_KEYS } from '@/constants/storage'
import { HttpRequestError, httpClient } from '@/services/http/client'
import type { AuthCredentials, LoginApiResponse } from '@/types/auth'
import { ParentStatusError } from '@/types/auth'
import type { User, UserRole } from '@/types/user'
import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

export const authService = {
  async login(credentials: AuthCredentials): Promise<LoginApiResponse> {
    try {
      const response = await httpClient.post<LoginApiResponse>('login', {
        email: credentials.email,
        password: credentials.password,
      })

      console.log('Login response:', response)

      const result = {
        token: response.data.token,
        role: response.data.role as UserRole,
        name: response.data.name,
        email: response.data.email,
        status:
          response.data.status?.toUpperCase() as LoginApiResponse['status'],
      }

      console.log('Parsed login result:', result)

      console.log('Login successful:', result)

      // const result = {
      //   token: 'fake-jwt-token',
      //   role: 'parent' as UserRole,
      //   name: 'Fulano de Tal',
      //   email: credentials.email,
      //   status: 'APROVADO' as const,
      // }

      if (result.status === 'AGUARDANDO' || result.status === 'NEGADO') {
        throw new ParentStatusError(result.status)
      }

      setCookie(COOKIE_KEYS.authToken, result.token)
      setCookie(COOKIE_KEYS.authRole, result.role)
      setCookie(COOKIE_KEYS.authName, result.name)
      setCookie(COOKIE_KEYS.authEmail, result.email)

      return result
    } catch (error) {
      if (error instanceof HttpRequestError && error.status === 403) {
        const body = (await error.response?.json().catch(() => null)) as {
          detail?: string
          details?: string
        } | null
        const detail = (body?.detail ?? body?.details ?? '').toLowerCase()

        if (detail.includes('aguardando'))
          throw new ParentStatusError('AGUARDANDO')
        if (detail.includes('negado')) throw new ParentStatusError('NEGADO')

        throw new ParentStatusError('NEGADO')
      }

      throw error
    }
  },

  getToken(): string | null {
    return getCookie(COOKIE_KEYS.authToken)
  },

  getRole(): UserRole | null {
    return getCookie(COOKIE_KEYS.authRole) as UserRole | null
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
