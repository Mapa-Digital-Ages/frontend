import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import CompanyDashboardPage from '@/modules/company/dashboard/page/Page'

export const companyRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['empresa']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.company.dashboard,
                element: <CompanyDashboardPage />,
              },
              {
                path: APP_ROUTES.company.adoptedSchools,
                element: <CompanyDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
