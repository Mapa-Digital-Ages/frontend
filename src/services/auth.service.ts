import { APP_CONFIG } from '@/constants/app'
import { STORAGE_KEYS } from '@/constants/storage'
import type { AuthCredentials, AuthSession } from '@/types/auth'
import type { UserRole } from '@/types/user'
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/utils/storage'

const MOCK_PROFILES: Record<UserRole, { name: string; organization: string }> =
  {
    student: {
      name: 'Ana Ferreira',
      organization: 'Escola Horizonte',
    },
    parent: {
      name: 'Carlos Souza',
      organization: 'Comunidade Escolar',
    },
    admin: {
      name: 'Admin',
      organization: 'Gestão Mapa Digital',
    },
  }

function wait(ms = 300) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthSession> {
    await wait()

    const role = credentials.role ?? APP_CONFIG.defaultRole
    const profile = MOCK_PROFILES[role]

    const session: AuthSession = {
      token: `mock-token-${role}`,
      user: {
        id: `${role}-001`,
        name: profile.name,
        email: credentials.email.toLowerCase(),
        role,
        organization: profile.organization,
      },
    }

    setStorageItem(STORAGE_KEYS.authSession, session)

    return session
  },
  getSession() {
    return getStorageItem<AuthSession>(STORAGE_KEYS.authSession)
  },
  getToken() {
    return this.getSession()?.token ?? null
  },
  logout() {
    removeStorageItem(STORAGE_KEYS.authSession)
  },
}
