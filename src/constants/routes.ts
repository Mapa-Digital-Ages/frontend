import type { UserRole } from '@/types/user'

export const APP_ROUTES = {
  root: '/',
  auth: {
    login: '/login',
  },
  student: {
    dashboard: '/student/dashboard',
    adaptiveTrail: '/student/adaptive-trail',
    contents: '/student/components',
    uploads: '/student/uploads',
    routine: '/student/routine',
    chat: '/student/chat',
    components: '/student/components',
    onboardingFlow: '/student/components/onboarding-flow',
  },
  parent: {
    dashboard: '/parent/dashboard',
  },
  admin: {
    dashboard: '/admin/dashboard',
  },
  common: {
    unauthorized: '/unauthorized',
  },
} as const

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  student: APP_ROUTES.student.dashboard,
  parent: APP_ROUTES.parent.dashboard,
  admin: APP_ROUTES.admin.dashboard,
}
