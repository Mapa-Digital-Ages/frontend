import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import StudentComponentsPage from '@/modules/student/components/page/Page'
import StudentDashboardPage from '@/modules/student/dashboard/page/Page'
import StudentAdaptiveTrailPage from '@/modules/student/adaptivetrail/page/Page'
import StudentContentsPage from '@/modules/student/contents/page/Page'
import StudentUploadPage from '@/modules/student/upload/page/Page'
import StudentRoutinePage from '@/modules/student/routine/page/Page'
import StudentChatPage from '@/modules/student/chat/page/Page'

export const studentRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['aluno']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.student.dashboard,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.adaptiveTrail,
                element: <StudentAdaptiveTrailPage />,
              },
              {
                path: APP_ROUTES.student.contents,
                element: <StudentContentsPage />,
              },
              {
                path: APP_ROUTES.student.uploads,
                element: <StudentUploadPage />,
              },
              {
                path: APP_ROUTES.student.routine,
                element: <StudentRoutinePage />,
              },
              {
                path: APP_ROUTES.student.chat,
                element: <StudentChatPage />,
              },
              {
                path: APP_ROUTES.student.components,
                element: <StudentComponentsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
