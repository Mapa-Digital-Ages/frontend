import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import AdminLayout from '@/layouts/AdminLayout'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'

export const adminRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: APP_ROUTES.admin.dashboard,
                element: <AdminDashboardPage />,
              },
              {
                path: APP_ROUTES.admin.users,
                element: <AdminUsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
