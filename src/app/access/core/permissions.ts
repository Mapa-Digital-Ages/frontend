import type { UserRole } from '@/shared/types/user'

export function hasRequiredRole(
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
) {
  if (!userRole) {
    return false
  }

  return allowedRoles.includes(userRole)
}
