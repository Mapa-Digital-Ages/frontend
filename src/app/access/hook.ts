import { ROLE_LABELS } from './core/roles'
import type { UserRole } from '@/shared/types/user'
import { useAuth } from '@/app/auth/hook'

export function useUserRole() {
  const { user } = useAuth()
  const role = user?.role

  function matchesRole(expectedRole: UserRole) {
    return role === expectedRole
  }

  return {
    role,
    roleLabel: role ? ROLE_LABELS[role] : 'Visitante',
    isAdmin: role === 'admin',
    matchesRole,
  }
}
