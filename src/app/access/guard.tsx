import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import { APP_ROUTES } from '@/app/router/paths'
import { useAuth } from '@/app/auth/hook'
import { useUserRole } from './hook'
import { accessService } from './core/service'
import type { UserRole } from '@/shared/types/user'

interface ProtectedRouteProps {
  children?: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <Navigate replace state={{ from: location }} to={APP_ROUTES.auth.login} />
    )
  }

  return children ? <>{children}</> : <Outlet />
}

interface RoleRouteProps {
  allowedRoles: UserRole[]
  children?: ReactNode
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role } = useUserRole()

  if (!accessService.userHasRole(role, allowedRoles)) {
    return <Navigate replace to={APP_ROUTES.common.unauthorized} />
  }

  return children ? <>{children}</> : <Outlet />
}
