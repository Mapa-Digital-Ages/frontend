import type { RouteObject } from 'react-router-dom'
import { APP_ROUTES } from '@/constants/routes'
import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/pages/auth/LoginPage'

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: APP_ROUTES.auth.login,
        element: <LoginPage />,
      },
    ],
  },
]
