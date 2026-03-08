import { Navigate, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '@/constants/routes'
import { useUserRole } from '@/hooks/useUserRole'
import type { UserRole } from '@/types/user'
import { hasRequiredRole } from '@/utils/permissions'
import type { ReactNode } from 'react'

interface RoleRouteProps {
  allowedRoles: UserRole[]
  children?: ReactNode
}

function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role } = useUserRole()

  if (!hasRequiredRole(role, allowedRoles)) {
    return <Navigate replace to={APP_ROUTES.common.unauthorized} />
  }

  return children ? <>{children}</> : <Outlet />
}

export default RoleRoute
