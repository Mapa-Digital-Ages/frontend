import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const companyNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.company.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Escolas Apadrinhadas',
    path: APP_ROUTES.company.adoptedSchools,
    icon: <SchoolRoundedIcon fontSize="medium" />,
  },
]
