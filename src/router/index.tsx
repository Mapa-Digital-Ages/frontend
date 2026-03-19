import { createBrowserRouter } from 'react-router-dom'
import { adminRoutes } from '@/pages/admin/route'
import { authRoutes } from '@/pages/auth/route'
import { commonRoutes } from '@/pages/common/route'
import { parentRoutes } from '@/pages/parent/route'
import { studentRoutes } from '@/pages/student/route'

export const router = createBrowserRouter([
  ...authRoutes,
  ...studentRoutes,
  ...parentRoutes,
  ...adminRoutes,
  ...commonRoutes,
])
