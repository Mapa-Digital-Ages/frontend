import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import DashboardLayout from '@/layouts/DashboardLayout'
import SchoolDashboardPage from '@/pages/school/SchoolDashboardPage'

export const schoolRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['school']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.school.dashboard,
                element: <SchoolDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
