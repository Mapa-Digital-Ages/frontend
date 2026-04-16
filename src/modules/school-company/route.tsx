import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import SchoolCompanyDashboardPage from '@/modules/school-company/dashboard/page/Page'

export const schoolCompanyRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['escola_empresa']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.schoolCompany.dashboard,
                element: <SchoolCompanyDashboardPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.classes,
                element: <SchoolCompanyDashboardPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.partners,
                element: <SchoolCompanyDashboardPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.requestPartner,
                element: <SchoolCompanyDashboardPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.adoptedSchools,
                element: <SchoolCompanyDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
