import { createBrowserRouter } from 'react-router-dom'
import { adminRoutes } from '@/modules/admin/route'
import { authRoutes } from '@/modules/auth/route'
import { commonRoutes } from '@/modules/common/route'
import { companyRoutes } from '@/modules/company/route'
import { parentRoutes } from '@/modules/parent/route'
import { schoolRoutes } from '@/modules/school/route'
import { schoolCompanyRoutes } from '@/modules/school-company/route'
import { studentRoutes } from '@/modules/student/route'

export const router = createBrowserRouter([
  ...authRoutes,
  ...studentRoutes,
  ...parentRoutes,
  ...adminRoutes,
  ...schoolRoutes,
  ...companyRoutes,
  ...schoolCompanyRoutes,
  ...commonRoutes,
])
