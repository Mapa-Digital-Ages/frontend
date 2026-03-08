import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AppButton from '@/components/ui/AppButton'
import AppSidebar from '@/components/ui/AppSidebar'
import AppTopbar from '@/components/ui/AppTopbar'
import { ThemeContext } from '@/context/theme-context'
import { APP_ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useUserRole } from '@/hooks/useUserRole'
import type { SidebarItem } from '@/types/common'

interface DashboardLayoutProps {
  variant?: 'default' | 'admin'
}

const navigationItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.student.dashboard,
    icon: <DashboardRoundedIcon />,
    roles: ['student'],
    description: 'Visão geral',
  },
  {
    label: 'Tarefas',
    path: APP_ROUTES.student.tasks,
    icon: <AssignmentRoundedIcon />,
    roles: ['student'],
    description: 'Entregas pendentes',
  },
  {
    label: 'Dashboard',
    path: APP_ROUTES.parent.dashboard,
    icon: <Diversity3RoundedIcon />,
    roles: ['parent'],
    description: 'Filhos e alertas',
  },
  {
    label: 'Dashboard',
    path: APP_ROUTES.school.dashboard,
    icon: <SchoolRoundedIcon />,
    roles: ['school'],
    description: 'Turmas e engajamento',
  },
  {
    label: 'Dashboard',
    path: APP_ROUTES.partner.dashboard,
    icon: <HubRoundedIcon />,
    roles: ['partner'],
    description: 'Projetos da rede',
  },
  {
    label: 'Dashboard',
    path: APP_ROUTES.admin.dashboard,
    icon: <ManageAccountsRoundedIcon />,
    roles: ['admin'],
    description: 'Visão executiva',
  },
  {
    label: 'Usuários',
    path: APP_ROUTES.admin.users,
    icon: <GroupRoundedIcon />,
    roles: ['admin'],
    description: 'Gestão de perfis',
  },
]

function DashboardLayout({ variant = 'default' }: DashboardLayoutProps) {
  const { isMobile } = useBreakpoint()
  const { logout, user } = useAuth()
  const { role, roleLabel } = useUserRole()
  const themeContext = useContext(ThemeContext)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarItems = navigationItems.filter(item =>
    role ? item.roles?.includes(role) : false
  )

  function handleLogout() {
    logout()
    navigate(APP_ROUTES.root)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppSidebar
        isMobile={isMobile}
        items={sidebarItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        roleLabel={roleLabel}
        variant={variant}
      />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          ml: { md: `${288}px` },
          minWidth: 0,
        }}
      >
        <AppTopbar
          title="Mapa Digital"
          actions={
            <Stack alignItems="center" direction="row" spacing={1.5}>
              <IconButton color="inherit" onClick={themeContext?.toggleMode}>
                {themeContext?.mode === 'dark' ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
              <Chip color="primary" label={roleLabel} variant="outlined" />
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
                sx={{ display: { md: 'flex', xs: 'none' } }}
              >
                <AccountCircleOutlinedIcon color="action" />
                <Box>
                  <Typography sx={{ fontWeight: 600 }} variant="body2">
                    {user?.name}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {user?.organization}
                  </Typography>
                </Box>
              </Stack>
              <AppButton onClick={handleLogout} variant="outlined">
                Sair
              </AppButton>
            </Stack>
          }
          onMenuClick={() => setMobileOpen(true)}
          showMenuButton
        />

        <Box component="main" sx={{ flex: 1, px: { md: 4, xs: 2 }, py: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
