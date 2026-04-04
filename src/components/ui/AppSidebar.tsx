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
import { alpha, useTheme } from '@mui/material/styles'
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
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const currentRole = role ?? APP_CONFIG.defaultRole

  const paperSx = {
    backgroundColor: 'var(--app-surface)',
    borderRight: '1px solid var(--app-border)',
    color: 'var(--app-foreground)',
    width: APP_CONFIG.drawerWidth,
  }

  const drawerContent = (
    <Box
      className="flex h-full flex-col p-3"
      sx={{ backgroundColor: 'var(--app-surface-soft)' }}
    >
      <Box
        className="-mx-3 -mt-3 mb-4 px-4 py-5 text-white"
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

      <List className="grid gap-2 p-0">
        {items.map(item => {
          const canNavigate = !item.path.startsWith('#')
          const selected =
            canNavigate &&
            (location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`))

          return (
            <ListItemButton
              key={`${item.label}-${item.path}`}
              className="rounded-4xl px-2 py-1.5 transition-all duration-200 ease-out"
              onClick={() => {
                if (canNavigate) {
                  navigate(item.path)
                }
                onClose()
              }}
              selected={selected}
              sx={{
                borderRadius: '18px',
                border: '1px solid transparent',
                '& .MuiListItemText-primary': {
                  color: 'var(--app-muted-foreground)',
                  fontWeight: 600,
                  transition: 'transform 180ms ease',
                },
                '& .MuiListItemIcon-root': {
                  color: 'var(--app-muted-foreground)',
                },
                '&.Mui-selected': {
                  backdropFilter: 'blur(6px)',
                  background: `linear-gradient(120deg, ${alpha(
                    AppColors.role[currentRole].primary,
                    0.22
                  )} 0%, ${alpha(theme.palette.background.paper, 0.78)} 100%)`,
                  borderColor: alpha(AppColors.role[currentRole].primary, 0.24),
                  boxShadow: `0 10px 22px ${alpha(AppColors.role[currentRole].primary, 0.12)}, inset 0 1px 0 ${alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.06 : 0.7)}`,
                },
                '&.Mui-selected:hover': {
                  background: `linear-gradient(120deg, ${alpha(
                    AppColors.role[currentRole].primary,
                    0.26
                  )} 0%, ${alpha(theme.palette.background.paper, 0.84)} 100%)`,
                  borderColor: alpha(AppColors.role[currentRole].primary, 0.3),
                },
                '&:hover': {
                  backgroundColor: alpha(
                    AppColors.role[currentRole].primary,
                    0.12
                  ),
                  borderColor: alpha(AppColors.role[currentRole].primary, 0.2),
                },
                '&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary':
                  {
                    color: AppColors.role[currentRole].primary,
                    fontWeight: 700,
                  },
                '&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary':
                  {
                    color: AppColors.role[currentRole].primary,
                  },
                '&:hover .MuiListItemText-primary': {
                  transform: 'translateX(1px)',
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
            className="rounded-2xl px-2 py-1.5 transition-all duration-200 ease-out"
            onClick={onLogout}
            sx={{
              '& .MuiListItemText-primary': {
                color: 'var(--app-muted-foreground)',
                fontWeight: 600,
              },
              '& .MuiListItemIcon-root': {
                color: 'var(--app-muted-foreground)',
              },
              '&:hover': {
                bgcolor: alpha(AppColors.role[currentRole].primary, 0.12),
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
