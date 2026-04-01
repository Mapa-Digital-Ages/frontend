import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import DashboardLayout from '@/layouts/DashboardLayout'
import StudentComponentsPage from '@/pages/student/StudentComponentsPage'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage'
import StudentOnboardingFlowPage from '@/pages/student/StudentOnboardingFlowPage'

// Future backend integration points should stay outside this route definition.
// Suggested organization:
// - route.tsx -> registers path / element / loader / action
// - student.service.ts -> performs HTTP requests to the backend
//
// Example future hooks:
// import {
//   studentComponentsLoader,
//   studentOnboardingFlowAction,
//   studentOnboardingFlowLoader,
// } from '@/pages/student/student.routes.api'

export const studentRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.student.dashboard,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.components,
                // loader: studentComponentsLoader,
                element: <StudentComponentsPage />,
              },
              {
                path: APP_ROUTES.student.onboardingFlow,
                // loader: studentOnboardingFlowLoader,
                // action: studentOnboardingFlowAction,
                element: <StudentOnboardingFlowPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
