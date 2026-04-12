import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import type { SidebarItem } from '@/types/common'
import type { UserRole } from '@/types/user'
import { APP_ROUTES } from './routes'

export const NAVIGATION_BY_ROLE: Record<UserRole, SidebarItem[]> = {
  aluno: [
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
      path: APP_ROUTES.student.components,
      icon: <PlayCircleFilledWhiteOutlinedIcon fontSize="medium" />,
    },
    {
      label: 'Upload de Avaliações',
      path: APP_ROUTES.student.uploads,
      icon: <UploadFileOutlinedIcon fontSize="medium" />,
    },
    {
      label: 'Rotina & Bem-estar',
      path: APP_ROUTES.student.routine,
      icon: <FavoriteBorderRoundedIcon fontSize="medium" />,
    },
    {
      label: 'Chat IA',
      path: APP_ROUTES.student.chat,
      icon: <ChatBubbleOutlineRoundedIcon fontSize="medium" />,
    },
  ],
  responsavel: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.parent.dashboard,
      icon: <AutoStoriesIcon fontSize="medium" />,
    },
  ],
  admin: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.admin.dashboard,
      icon: <AutoStoriesIcon fontSize="medium" />,
    },
    {
      label: 'Aprovações',
      path: APP_ROUTES.admin.approvals,
      icon: <FactCheckRoundedIcon fontSize="medium" />,
    },
  ],
}
