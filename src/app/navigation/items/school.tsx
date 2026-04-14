import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import ClassRoundedIcon from '@mui/icons-material/ClassRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const schoolNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.school.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Turmas',
    path: APP_ROUTES.school.classes,
    icon: <ClassRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Parceiras',
    path: APP_ROUTES.school.partners,
    icon: <HandshakeRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Solicitar Parceiro',
    path: APP_ROUTES.school.requestPartner,
    icon: <PersonAddRoundedIcon fontSize="medium" />,
  },
]
