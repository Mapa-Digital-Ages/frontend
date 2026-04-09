import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AppSidebar from '@/components/ui/AppSidebar'
import AppTopbar from '@/components/ui/AppTopbar'
import ThemeModeToggle from '@/components/ui/ThemeMode'
import { APP_CONFIG } from '@/constants/app'
import { NAVIGATION_BY_ROLE } from '@/constants/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useUserRole } from '@/hooks/useUserRole'
import { AppColors } from '@/styles/AppColors'
import type { UserRole } from '@/types/user'

const AVATAR_BG_BY_ROLE: Record<UserRole, string> = {
  student: AppColors.role.student.primary,
  parent: AppColors.role.parent.primary,
  admin: AppColors.role.admin.primary,
}
function DashboardLayout() {
  const theme = useTheme()
  const { isMobile } = useBreakpoint()
  const { logout, user } = useAuth()
  const { role } = useUserRole()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentRole = role ?? APP_CONFIG.defaultRole
  const sidebarItems = NAVIGATION_BY_ROLE[currentRole]
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'M'

  return (
    <Box
      className="fixed inset-0 z-50 flex h-screen w-screen overflow-hidden"
      sx={{ backgroundColor: 'background.default' }}
    >
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
              <ThemeModeToggle />
              <Box
                className="grid size-9 place-items-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: AVATAR_BG_BY_ROLE[currentRole] }}
              >
                {userInitial}
              </Box>
              <Typography
                className="hidden max-w-48 text-sm font-semibold sm:block md:max-w-[16rem] md:text-base"
                noWrap
                sx={{ color: theme.palette.text.primary }}
              >
                {user?.name}
              </Typography>
            </Box>
          }
          leading={
            <IconButton
              aria-label="Voltar"
              onClick={() => navigate(-1)}
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          }
          onMenuClick={() => setMobileOpen(true)}
          showMenuButton
        />

        <Box
          className="flex-1 px-3 py-4 md:px-5 lg:px-6 overflow-auto"
          component="main"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
