import type { UserRole } from '@/shared/types/user'
import { hasRequiredRole } from './permissions'

export const accessService = {
  userHasRole(userRole: UserRole | undefined, allowedRoles: UserRole[]) {
    return hasRequiredRole(userRole, allowedRoles)
  },
}
