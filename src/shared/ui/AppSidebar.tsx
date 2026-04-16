import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { APP_CONFIG, ROLE_DASHBOARD_TITLE } from '@/shared/constants/app'
import {
  getRoleAccentColor,
  getRoleGradient,
  getRoleHoverStyle,
} from '@/app/theme/core/roles'
import type { SidebarItem } from '@/shared/types/common'
import type { UserRole } from '@/shared/types/user'
import { useTheme } from '@mui/material/styles'

interface AppSidebarProps {
  isMobile: boolean
  items: SidebarItem[]
  mobileOpen: boolean
  onClose: () => void
  onLogout?: () => void
  role: UserRole
}

function AppSidebar({
  isMobile,
  items,
  mobileOpen,
  onClose,
  onLogout,
  role,
}: AppSidebarProps) {
  const theme = useTheme()
  const accentColor = getRoleAccentColor(theme, role)
  const roleHover = getRoleHoverStyle(theme, role)
  const location = useLocation()
  const navigate = useNavigate()

  const paperSx = {
    backgroundColor: 'var(--app-surface)',
    borderRight: '2px solid var(--app-border)',
    color: 'var(--app-foreground)',
    width: APP_CONFIG.drawerWidth,
  }

  const drawerContent = (
    <Box
      data-testid="side-menu"
      className="flex h-full flex-col p-3"
      sx={{ backgroundColor: 'transparent' }}
    >
      <Box
        className="-mx-3 -mt-3 mb-4 px-6 py-5 text-white"
        style={{
          background: getRoleGradient(theme, role, '150deg'),
        }}
      >
        <Box className="flex items-center gap-3">
          <Box className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/20 text-sm font-bold">
            M
          </Box>
          <Box className="min-w-0">
            <Typography className="truncate text-2xl font-bold uppercase leading-none">
              {APP_CONFIG.name}
            </Typography>
            <Typography className="truncate text-sm text-white/85">
              {ROLE_DASHBOARD_TITLE[role]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--app-border)', mb: 1.5 }} />

      <List className="grid gap-1">
        {items.map(item => {
          const canNavigate = !item.path.startsWith('#')
          const selected =
            canNavigate &&
            (location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`))

          return (
            <ListItemButton
              key={`${item.label}-${item.path}`}
              data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="rounded-xl px-3 py-2 transition-all duration-200 ease-out"
              onClick={() => {
                if (canNavigate) {
                  navigate(item.path)
                }
                onClose()
              }}
              selected={selected}
              sx={{
                borderRadius: '18px',
                '& .MuiListItemText-primary': {
                  backgroundColor: 'transparent',
                  color: theme.palette.text.secondary,
                  transition: 'transform 180ms ease',
                },
                '& .MuiListItemIcon-root': {
                  color: theme.palette.text.secondary,
                },
                '&.Mui-selected': {
                  backgroundColor: roleHover.backgroundColor,
                },
                '&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary':
                  {
                    color: accentColor,
                    fontWeight: 600,
                  },
                '&:hover': {
                  backgroundColor: roleHover.backgroundColor,
                },
                '&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary':
                  {
                    color: accentColor,
                  },
                '&:hover .MuiListItemText-primary': {
                  fontWeight: 600,
                },
              }}
            >
              <ListItemIcon className="min-w-9">{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>

      {onLogout && (
        <Box className="mt-auto pt-3">
          <Divider sx={{ borderColor: 'var(--app-border)', mb: 1.5 }} />
          <ListItemButton
            className="rounded-full px-2 py-1.5 transition-all duration-200 ease-out"
            data-testid="logout-button"
            onClick={onLogout}
            sx={{
              borderRadius: '18px',
              transition: 'all 0.2s ease',
              '& .MuiListItemText-primary': {
                color: theme.palette.text.secondary,
                fontWeight: 600,
              },
              '& .MuiListItemIcon-root': {
                color: theme.palette.text.secondary,
              },
              '&:hover': {
                borderRadius: 'var(--app-radius-control)',
                bgcolor: roleHover.backgroundColor,
                color: accentColor,
              },
              '&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary':
                {
                  color: accentColor,
                },
            }}
          >
            <ListItemIcon className="min-w-9">
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </Box>
      )}
    </Box>
  )

  return (
    <Drawer
      ModalProps={{ keepMounted: true }}
      onClose={onClose}
      open={isMobile ? mobileOpen : true}
      slotProps={{ paper: { sx: paperSx } }}
      variant={isMobile ? 'temporary' : 'permanent'}
    >
      {drawerContent}
    </Drawer>
  )
}

export default AppSidebar
