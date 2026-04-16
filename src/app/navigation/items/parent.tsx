import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const parentNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.parent.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
]
