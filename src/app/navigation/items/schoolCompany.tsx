import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const schoolCompanyNavigation: SidebarItem[] = [
  {
    label: 'Visão Geral',
    path: APP_ROUTES.schoolCompany.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
    section: 'ESCOLA',
  },
  {
    label: 'Alunos',
    path: APP_ROUTES.schoolCompany.students,
    icon: <PeopleAltRoundedIcon fontSize="medium" />,
    section: 'ESCOLA',
  },
  {
    label: 'Apoio',
    path: APP_ROUTES.schoolCompany.support,
    icon: <SupportAgentRoundedIcon fontSize="medium" />,
    section: 'ESCOLA',
  },
  {
    label: 'Visão Parceiras',
    path: APP_ROUTES.schoolCompany.partnerOverview,
    icon: <VisibilityRoundedIcon fontSize="medium" />,
    section: 'PARCEIRAS',
  },
  {
    label: 'Escolas Adotadas',
    path: APP_ROUTES.schoolCompany.adoptedSchools,
    icon: <SchoolRoundedIcon fontSize="medium" />,
    section: 'PARCEIRAS',
  },
  {
    label: 'Evolução',
    path: APP_ROUTES.schoolCompany.evolution,
    icon: <TrendingUpRoundedIcon fontSize="medium" />,
    section: 'PARCEIRAS',
  },
  {
    label: 'Relatórios',
    path: APP_ROUTES.schoolCompany.reports,
    icon: <AssessmentRoundedIcon fontSize="medium" />,
    section: 'PARCEIRAS',
  },
]
