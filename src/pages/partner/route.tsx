import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import DashboardLayout from '@/layouts/DashboardLayout'
import PartnerDashboardPage from '@/pages/partner/PartnerDashboardPage'

export const partnerRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['partner']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.partner.dashboard,
                element: <PartnerDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
