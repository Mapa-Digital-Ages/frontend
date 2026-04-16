import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const studentNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.student.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Trilha Adaptativa',
    path: APP_ROUTES.student.adaptiveTrail,
    icon: <RouteRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Conteúdos',
    path: APP_ROUTES.student.contents,
    icon: <PlayCircleFilledWhiteOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Upload de Avaliações',
    path: APP_ROUTES.student.uploads,
    icon: <UploadFileOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Rotina & Bem-Estar',
    path: APP_ROUTES.student.routine,
    icon: <FavoriteBorderRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Chat AI',
    path: APP_ROUTES.student.chat,
    icon: <ChatBubbleOutlineRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Componentes',
    path: APP_ROUTES.student.components,
    icon: <WidgetsRoundedIcon fontSize="medium" />,
  },
]
