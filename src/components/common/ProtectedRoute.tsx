import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import LoadingScreen from './LoadingScreen'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children?: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
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

export default ProtectedRoute
