import type { RouteObject } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import AuthLayout from '@/app/layout/AuthLayout'
import LoginPage from '@/modules/auth/login/page/Page'
import ForgotPasswordPage from '@/modules/auth/forgot-password/page/Page'

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: APP_ROUTES.auth.login,
        element: <LoginPage />,
      },
      {
        path: APP_ROUTES.auth.forgotPassword,
        element: <ForgotPasswordPage />,
      },
    ],
  },
]
