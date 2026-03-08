import { ROLE_LABELS } from '@/constants/roles'
import type { UserRole } from '@/types/user'
import { useAuth } from './useAuth'

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
