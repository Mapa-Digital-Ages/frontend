import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'
import { Settings } from '@mui/icons-material'

export const parentNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.parent.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Configurações',
    path: APP_ROUTES.parent.settings,
    icon: <Settings fontSize="medium" />,
  },
]
