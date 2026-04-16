import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import SchoolDashboardPage from '@/modules/school/dashboard/page/Page'
import SchoolClassesPage from '@/modules/school/classes/page/Page'

export const schoolRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['escola']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.school.dashboard,
                element: <SchoolDashboardPage />,
              },
              {
                path: APP_ROUTES.school.classes,
                element: <SchoolClassesPage />,
              },
              {
                path: APP_ROUTES.school.partners,
                element: <SchoolDashboardPage />,
              },
              {
                path: APP_ROUTES.school.requestPartner,
                element: <SchoolDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
