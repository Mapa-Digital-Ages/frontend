import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import DashboardLayout from '@/layouts/DashboardLayout'
import ParentDashboardPage from '@/pages/parent/ParentDashboardPage'

export const parentRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['parent']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.parent.dashboard,
                element: <ParentDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
