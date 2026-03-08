import { Navigate } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import { APP_ROUTES, DEFAULT_ROUTE_BY_ROLE } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

function RootRedirect() {
  const { isAuthenticated, status, user } = useAuth()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (isAuthenticated && user) {
    return <Navigate replace to={DEFAULT_ROUTE_BY_ROLE[user.role]} />
  }

  return <Navigate replace to={APP_ROUTES.auth.login} />
}

export default RootRedirect
