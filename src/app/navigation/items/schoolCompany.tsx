import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import ClassRoundedIcon from '@mui/icons-material/ClassRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const schoolCompanyNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.schoolCompany.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Turmas',
    path: APP_ROUTES.schoolCompany.classes,
    icon: <ClassRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Parceiras',
    path: APP_ROUTES.schoolCompany.partners,
    icon: <HandshakeRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Solicitar Parceiro',
    path: APP_ROUTES.schoolCompany.requestPartner,
    icon: <PersonAddRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Escolas Adotadas',
    path: APP_ROUTES.schoolCompany.adoptedSchools,
    icon: <SchoolRoundedIcon fontSize="medium" />,
  },
]
