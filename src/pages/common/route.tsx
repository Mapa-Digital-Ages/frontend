import type { RouteObject } from 'react-router-dom'
import { APP_ROUTES } from '@/constants/routes'
import PublicLayout from '@/layouts/PublicLayout'
import NotFoundPage from '@/pages/common/NotFoundPage'
import UnauthorizedPage from '@/pages/common/UnauthorizedPage'
import RootRedirect from '@/pages/common/RootRedirect'

export const commonRoutes: RouteObject[] = [
  {
    path: APP_ROUTES.root,
    element: <RootRedirect />,
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: APP_ROUTES.common.unauthorized,
        element: <UnauthorizedPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
