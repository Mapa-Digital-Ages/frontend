import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import SchoolCompanyDashboardPage from '@/modules/school-company/dashboard/page/Page'
import SchoolCompanyAdoptedSchoolsPage from '@/modules/school-company/adopted-schools/page/Page'
import PartnersPage from '@/modules/school-company/partners/page/Page'
import SchoolCompanySupportPage from '@/modules/school-company/support/page/Page'
import UnderDevelopmentPage from '@/modules/school-company/shared/UnderDevelopmentPage'

export const schoolCompanyRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['escola_empresa']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.schoolCompany.dashboard,
                element: <SchoolCompanyDashboardPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.classes,
                element: <UnderDevelopmentPage title="Turmas" />,
              },
              {
                path: APP_ROUTES.schoolCompany.students,
                element: <UnderDevelopmentPage title="Alunos" />,
              },
              {
                path: APP_ROUTES.schoolCompany.support,
                element: <SchoolCompanySupportPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.partners,
                element: <PartnersPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.requestPartner,
                element: <UnderDevelopmentPage title="Solicitar Parceiro" />,
              },
              {
                path: APP_ROUTES.schoolCompany.adoptedSchools,
                element: <SchoolCompanyAdoptedSchoolsPage />,
              },
              {
                path: APP_ROUTES.schoolCompany.partnerOverview,
                element: <UnderDevelopmentPage title="Visão Parceiras" />,
              },
              {
                path: APP_ROUTES.schoolCompany.evolution,
                element: <UnderDevelopmentPage title="Evolução" />,
              },
              {
                path: APP_ROUTES.schoolCompany.reports,
                element: <UnderDevelopmentPage title="Relatórios" />,
              },
            ],
          },
        ],
      },
    ],
  },
]
