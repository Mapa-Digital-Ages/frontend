import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AppSidebar from '@/components/ui/AppSidebar'
import AppTopbar from '@/components/ui/AppTopbar'
import { APP_CONFIG } from '@/constants/app'
import { APP_ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useUserRole } from '@/hooks/useUserRole'
import { AppColors } from '@/styles/AppColors'
import type { SidebarItem } from '@/types/common'
import type { UserRole } from '@/types/user'

const AVATAR_BG_BY_ROLE: Record<UserRole, string> = {
  student: AppColors.role.student.primary,
  parent: AppColors.role.parent.primary,
  admin: AppColors.role.admin.primary,
}

const NAVIGATION_BY_ROLE: Record<UserRole, SidebarItem[]> = {
  student: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.student.dashboard,
      icon: <DashboardRoundedIcon />,
    },
  ],
  parent: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.parent.dashboard,
      icon: <DashboardRoundedIcon />,
    },
  ],
  admin: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.admin.dashboard,
      icon: <DashboardRoundedIcon />,
    },
  ],
}

function DashboardLayout() {
  const { isMobile } = useBreakpoint()
  const { logout, user } = useAuth()
  const { role } = useUserRole()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentRole = role ?? APP_CONFIG.defaultRole
  const sidebarItems = NAVIGATION_BY_ROLE[currentRole]
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'M'

  return (
    <Box className="flex min-h-screen bg-slate-100">
      <AppSidebar
        isMobile={isMobile}
        items={sidebarItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={logout}
        role={currentRole}
      />

      <Box
        className="ml-0 flex min-w-0 flex-1 flex-col"
        style={{ marginLeft: isMobile ? 0 : APP_CONFIG.drawerWidth }}
      >
        <AppTopbar
          actions={
            <Box className="flex items-center gap-2 sm:gap-3">
              <Box
                className="grid size-9 place-items-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: AVATAR_BG_BY_ROLE[currentRole] }}
              >
                {userInitial}
              </Box>
              <Typography
                className="hidden max-w-[12rem] text-sm font-semibold text-slate-900 sm:block md:max-w-[16rem] md:text-base"
                noWrap
              >
                {user?.name}
              </Typography>
            </Box>
          }
          leading={
            <IconButton
              aria-label="Voltar"
              className="text-slate-500"
              onClick={() => navigate(-1)}
              size="small"
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          }
          onMenuClick={() => setMobileOpen(true)}
          showMenuButton
        />

        <Box className="flex-1 px-3 py-4 md:px-5 lg:px-6" component="main">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
