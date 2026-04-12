import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import DashboardLayout from '@/layouts/DashboardLayout'
import AdminApprovalsPage from '@/pages/admin/AdminApprovalsPage'
import AdminContentCorrectionPage from '@/pages/admin/AdminContentCorrectionPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'

export const adminRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.admin.dashboard,
                element: <AdminDashboardPage />,
              },
              {
                path: APP_ROUTES.admin.approvals,
                element: <AdminApprovalsPage />,
              },
              {
                path: APP_ROUTES.admin.correction,
                element: <AdminContentCorrectionPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
