import { Navigate, Outlet } from 'react-router-dom'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import { APP_ROUTES } from '@/app/router/paths'
import { useSchoolIsPrivate } from '../hooks/useSchoolIsPrivate'

/**
 * Restricts a route to public schools.
 *
 * Private schools are redirected to their dashboard; the request-support
 * flow is only available to public schools.
 */
export function PublicSchoolRoute() {
  const { isPrivate, loading } = useSchoolIsPrivate()

  if (loading) {
    return <LoadingScreen />
  }

  if (isPrivate) {
    return <Navigate replace to={APP_ROUTES.school.dashboard} />
  }

  return <Outlet />
}
