import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const adminNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.admin.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Escolas e Empresas',
    path: APP_ROUTES.admin.schoolsAndCompanies,
    icon: <BusinessRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Alunos',
    path: APP_ROUTES.admin.students,
    icon: <GroupsRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Responsáveis',
    path: APP_ROUTES.admin.parents,
    icon: <SupervisedUserCircleRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Conteúdos',
    path: APP_ROUTES.admin.contents,
    icon: <MenuBookRoundedIcon fontSize="medium" />,
  },
]
