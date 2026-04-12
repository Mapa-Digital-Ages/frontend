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
    approvals: '/admin/approvals',
    correction: '/admin/approvals/corrections/:contentId',
    dashboard: '/admin/dashboard',
  },
  common: {
    unauthorized: '/unauthorized',
  },
} as const

export function buildAdminCorrectionRoute(contentId: string) {
  return `/admin/approvals/corrections/${contentId}`
}

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  aluno: APP_ROUTES.student.dashboard,
  responsavel: APP_ROUTES.parent.dashboard,
  admin: APP_ROUTES.admin.dashboard,
  empresa: APP_ROUTES.root,
  escola: APP_ROUTES.root,
}
