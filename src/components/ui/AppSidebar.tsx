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
import { APP_CONFIG, ROLE_DASHBOARD_TITLE } from '@/constants/app'
import { AppColors } from '@/styles/AppColors'
import type { SidebarItem } from '@/types/common'
import type { UserRole } from '@/types/user'

interface AppSidebarProps {
  isMobile: boolean
  items: SidebarItem[]
  mobileOpen: boolean
  onClose: () => void
  onLogout?: () => void
  role?: UserRole
}

function AppSidebar({
  isMobile,
  items,
  mobileOpen,
  onClose,
  onLogout,
  role,
}: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentRole = role ?? APP_CONFIG.defaultRole

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
        style={{ background: AppColors.roleGradient(currentRole, '150deg') }}
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
              {ROLE_DASHBOARD_TITLE[currentRole]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--app-border)', mb: 1.5 }} />

      <List className="grid gap-0.5">
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
              className="rounded-xl px-3 py-2 transition-all duration-200 ease-out  "
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
                  color: AppColors.neutral.mutedText,
                  transition: 'transform 180ms ease',
                },
                '& .MuiListItemIcon-root': {
                  color: AppColors.neutral.mutedText,
                },
                '&.Mui-selected': {
                  color: 'rgba(31, 75, 153, 0.08)',
                },
                '&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary':
                  {
                    color: AppColors.role[currentRole].primary,
                    fontWeight: 600,
                  },
                '&:hover': {
                  backgroundColor: 'rgba(31, 75, 153, 0.08)',
                },
                '&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary':
                  {
                    color: AppColors.role[currentRole].primary,
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
                color: AppColors.neutral.mutedText,
                fontWeight: 600,
              },
              '& .MuiListItemIcon-root': {
                color: AppColors.neutral.mutedText,
              },
              '&:hover': {
                backgroundColor: 'rgba(31, 75, 153, 0.08)',
                borderRadius: '18px',
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
