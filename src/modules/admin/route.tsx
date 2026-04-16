import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import AdminContentPage from '@/modules/admin/content/page/Page'
import AdminContentCorrectionPage from '@/modules/admin/content-correction/page/Page'
import AdminDashboardPage from '@/modules/admin/dashboard/page/Page'
import AdminParentPage from '@/modules/admin/parent/page/Page'
import AdminStudentPage from '@/modules/admin/student/page/Page'
import AdminSchoolCompanyPage from '@/modules/admin/school-company/page/Page'

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
                path: APP_ROUTES.admin.schoolsAndCompanies,
                element: <AdminSchoolCompanyPage />,
              },
              {
                path: APP_ROUTES.admin.students,
                element: <AdminStudentPage />,
              },
              {
                path: APP_ROUTES.admin.parents,
                element: <AdminParentPage />,
              },
              {
                path: APP_ROUTES.admin.contents,
                element: <AdminContentPage />,
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
