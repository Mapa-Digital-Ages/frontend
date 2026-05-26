import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const schoolNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.school.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Alunos',
    path: APP_ROUTES.school.students,
    icon: <PeopleAltRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Solicitar Parceiro',
    path: APP_ROUTES.school.requestPartner,
    icon: <HandshakeRoundedIcon fontSize="medium" />,
  },
]
