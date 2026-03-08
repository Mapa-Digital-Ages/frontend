import type { UserRole } from '@/types/user'

export const APP_ROUTES = {
  root: '/',
  auth: {
    login: '/login',
  },
  student: {
    dashboard: '/student/dashboard',
    tasks: '/student/tasks',
  },
  parent: {
    dashboard: '/parent/dashboard',
  },
  school: {
    dashboard: '/school/dashboard',
  },
  partner: {
    dashboard: '/partner/dashboard',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
  },
  common: {
    unauthorized: '/unauthorized',
  },
} as const

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  student: APP_ROUTES.student.dashboard,
  parent: APP_ROUTES.parent.dashboard,
  school: APP_ROUTES.school.dashboard,
  partner: APP_ROUTES.partner.dashboard,
  admin: APP_ROUTES.admin.dashboard,
}
