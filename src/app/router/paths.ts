import type { UserRole } from '@/shared/types/user'

export const APP_ROUTES = {
  root: '/',
  auth: {
    login: '/login',
    forgotPassword: '/forgot-password',
  },
  student: {
    dashboard: '/student/dashboard',
    adaptiveTrail: '/student/adaptive-trail',
    contents: '/student/contents',
    uploads: '/student/uploads',
    routine: '/student/routine',
    chat: '/student/chat',
    components: '/student/components',
  },
  parent: {
    dashboard: '/parent/dashboard',
    settings: '/parent/settings',
  },
  admin: {
    dashboard: '/admin/dashboard',
    schoolsAndCompanies: '/admin/schools-companies',
    students: '/admin/students',
    parents: '/admin/parents',
    contents: '/admin/contents',
    correction: '/admin/corrections/:contentId',
  },
  school: {
    dashboard: '/school/dashboard',
    classes: '/school/classes',
    partners: '/school/partners',
    requestPartner: '/school/request-partner',
  },
  company: {
    dashboard: '/company/dashboard',
    adoptedSchools: '/company/adopted-schools',
  },
  schoolCompany: {
    dashboard: '/school-company/dashboard',
    classes: '/school-company/classes',
    partners: '/school-company/partners',
    requestPartner: '/school-company/request-partner',
    adoptedSchools: '/school-company/adopted-schools',
  },
  common: {
    unauthorized: '/unauthorized',
  },
} as const

export function buildAdminCorrectionRoute(contentId: string) {
  return `/admin/corrections/${encodeURIComponent(contentId)}`
}

export function buildParentStudentDetailsRoute(studentId: string) {
  return `/parent/students/${encodeURIComponent(studentId)}`
}

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  aluno: APP_ROUTES.student.dashboard,
  responsavel: APP_ROUTES.parent.dashboard,
  admin: APP_ROUTES.admin.dashboard,
  empresa: APP_ROUTES.company.dashboard,
  escola: APP_ROUTES.school.dashboard,
  escola_empresa: APP_ROUTES.schoolCompany.dashboard,
}
