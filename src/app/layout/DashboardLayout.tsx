import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from '@/shared/ui/AppSidebar'
import AppTopbar from '@/shared/ui/AppTopbar'
import ThemeModeToggle from '@/shared/ui/ThemeMode'
import { APP_CONFIG } from '@/shared/constants/app'
import { NAVIGATION_BY_ROLE } from '@/app/navigation'
import { useAuth } from '@/app/auth/hook'
import { useBreakpoint } from '@/shared/hooks/useBreakpoint'
import { useUserRole } from '@/app/access/hook'
import {
  getRoleAccentColor,
  getRoleHoverStyle,
  getRolePalette,
  getRoleSelectedStyle,
  getRoleSolidHoverColor,
} from '@/app/theme/core/roles'

function DashboardLayout() {
  const theme = useTheme()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const { logout, user } = useAuth()
  const { role } = useUserRole()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [tabletCollapsed, setTabletCollapsed] = useState(true)
  const collapsed = isMobile
    ? false
    : isTablet
      ? tabletCollapsed
      : desktopCollapsed
  const currentRole = role ?? APP_CONFIG.defaultRole
  const sidebarItems = NAVIGATION_BY_ROLE[currentRole]
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'M'
  const rolePalette = getRolePalette(theme, currentRole)
  const avatarBackgroundColor = getRoleAccentColor(theme, currentRole)
  const roleHover = getRoleHoverStyle(theme, currentRole)
  const roleSelected = getRoleSelectedStyle(theme, currentRole)
  const roleSolidHoverColor = getRoleSolidHoverColor(theme, currentRole)
  const useOverlay = isMobile || (isTablet && !collapsed)
  const roleStyleProperties = useMemo(
    () => ({
      '--app-role-current-primary': rolePalette.primary,
      '--app-role-current-secondary': rolePalette.secondary,
      '--app-role-current-soft': rolePalette.soft,
      '--app-role-current-contrast': rolePalette.contrast,
      '--app-role-current-hover-solid': roleSolidHoverColor,
      '--app-role-action-hover-bg': roleHover.backgroundColor,
      '--app-role-action-hover-border': roleHover.borderColor,
      '--app-role-action-selected-bg': roleSelected.backgroundColor,
      '--app-role-action-selected-border': roleSelected.borderColor,
    }),
    [
      roleHover.backgroundColor,
      roleHover.borderColor,
      rolePalette.contrast,
      rolePalette.primary,
      rolePalette.secondary,
      rolePalette.soft,
      roleSelected.backgroundColor,
      roleSelected.borderColor,
      roleSolidHoverColor,
    ]
  )
  const layoutStyle = roleStyleProperties as CSSProperties

  useEffect(() => {
    const root = document.documentElement
    const previousValues = new Map(
      Object.keys(roleStyleProperties).map(property => [
        property,
        root.style.getPropertyValue(property),
      ])
    )

    Object.entries(roleStyleProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    return () => {
      previousValues.forEach((value, property) => {
        if (value) {
          root.style.setProperty(property, value)
          return
        }

        root.style.removeProperty(property)
      })
    }
  }, [roleStyleProperties])

  const contentMarginLeft = (() => {
    if (isMobile) return 0
    if (isTablet && collapsed) return 80
    if (isTablet && !collapsed) return 0
    if (isDesktop && collapsed) return 80
    return APP_CONFIG.drawerWidth
  })()

  return (
    <Box
      className="fixed inset-0 z-50 flex h-screen w-screen overflow-hidden"
      style={layoutStyle}
      sx={{ backgroundColor: 'background.default' }}
    >
      <AppSidebar
        isMobile={isMobile}
        useOverlay={useOverlay}
        items={sidebarItems}
        mobileOpen={mobileOpen}
        onClose={() => {
          setMobileOpen(false)
          if (isTablet) setTabletCollapsed(true)
        }}
        onLogout={logout}
        role={currentRole}
        collapsed={collapsed}
        onToggleCollapse={() => {
          if (isTablet) {
            if (tabletCollapsed) {
              setTabletCollapsed(false)
              setMobileOpen(true)
            } else {
              setTabletCollapsed(true)
              setMobileOpen(false)
            }
          } else {
            setDesktopCollapsed(prev => !prev)
          }
        }}
      />

      <Box
        className="flex min-w-0 flex-1 flex-col"
        style={{
          marginLeft: contentMarginLeft,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <AppTopbar
          actions={
            <Box className="flex items-center gap-2 sm:gap-3">
              <ThemeModeToggle />
              <Box
                className="grid size-9 place-items-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: avatarBackgroundColor }}
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
          onMenuClick={() => setMobileOpen(true)}
          showMenuButton={isMobile}
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
