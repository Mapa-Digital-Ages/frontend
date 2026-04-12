import type { ActionFunctionArgs, RouteObject } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import RoleRoute from '@/components/common/RoleRoute'
import { APP_ROUTES } from '@/constants/routes'
import DashboardLayout from '@/layouts/DashboardLayout'
import StudentComponentsPage from '@/pages/student/StudentComponentsPage'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage'
import StudentOnboardingFlowPage from '@/pages/student/StudentOnboardingFlowPage'
import type {
  StudentOnboardingFlowActionInput,
  StudentOnboardingFlowLoaderData,
} from '@/types/student'
import { STUDENT_ONBOARDING_FLOW_QUESTIONS } from './components/onboardingQuestionFlow'

export function studentOnboardingFlowLoader(): StudentOnboardingFlowLoaderData {
  return {
    assessmentId: 'local-assessment',
    initialAnswersByQuestionId: {},
    questions: STUDENT_ONBOARDING_FLOW_QUESTIONS,
  }
}

export async function studentOnboardingFlowAction({
  request,
}: ActionFunctionArgs): Promise<StudentOnboardingFlowActionInput | null> {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return null
  }

  return (await request.json()) as StudentOnboardingFlowActionInput
}

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
                path: APP_ROUTES.student.adaptiveTrail,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.components,
                element: <StudentComponentsPage />,
              },
              {
                path: APP_ROUTES.student.uploads,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.routine,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.chat,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.onboardingFlow,
                element: <StudentOnboardingFlowPage />,
                loader: studentOnboardingFlowLoader,
                action: studentOnboardingFlowAction,
              },
            ],
          },
        ],
      },
    ],
  },
]
