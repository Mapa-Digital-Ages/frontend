import { useUserRole } from '@/app/access/hook'
import type { UserRole } from '@/shared/types/user'

export function useParentRole(): UserRole {
  const { role } = useUserRole()
  return role ?? 'responsavel'
}
