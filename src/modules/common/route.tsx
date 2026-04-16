import type { RouteObject } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import PublicLayout from '@/app/layout/PublicLayout'
import NotFoundPage from '@/modules/common/NotFoundPage'
import UnauthorizedPage from '@/modules/common/UnauthorizedPage'
import RootRedirect from '@/modules/common/RootRedirect'

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
