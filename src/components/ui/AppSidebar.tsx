import {
  Box,
  Chip,
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
import { APP_CONFIG } from '@/constants/app'
import type { SidebarItem } from '@/types/common'

interface AppSidebarProps {
  isMobile: boolean
  items: SidebarItem[]
  mobileOpen: boolean
  onClose: () => void
  roleLabel: string
  variant?: 'default' | 'admin'
}

function AppSidebar({
  isMobile,
  items,
  mobileOpen,
  onClose,
  roleLabel,
  variant = 'default',
}: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()

  const paperSx = {
    background:
      variant === 'admin'
        ? `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${alpha(theme.palette.primary.dark, 0.92)} 100%)`
        : `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.common.white,
    width: APP_CONFIG.drawerWidth,
  }

  const drawerContent = (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: alpha('#FFFFFF', 0.72), letterSpacing: 1.4 }}
        >
          Plataforma
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
          {APP_CONFIG.name}
        </Typography>
        <Chip
          label={roleLabel}
          size="small"
          sx={{
            mt: 1.5,
            bgcolor: alpha('#FFFFFF', 0.16),
            color: '#FFFFFF',
            fontWeight: 600,
          }}
        />
      </Box>

      <Divider sx={{ borderColor: alpha('#FFFFFF', 0.14), mb: 2 }} />

      <List sx={{ display: 'grid', gap: 0.5, p: 0 }}>
        {items.map(item => {
          const selected = location.pathname === item.path

          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path)
                onClose()
              }}
              selected={selected}
              sx={{
                borderRadius: 3,
                py: 1.1,
                '&.Mui-selected': {
                  bgcolor: alpha('#FFFFFF', 0.16),
                },
                '&.Mui-selected:hover, &:hover': {
                  bgcolor: alpha('#FFFFFF', 0.2),
                },
              }}
            >
              <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.description} />
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{ mt: 'auto', px: 1, pt: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: alpha('#FFFFFF', 0.72) }}
        ></Typography>
      </Box>
    </Box>
  )

  return (
    <Drawer
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: paperSx }}
      onClose={onClose}
      open={isMobile ? mobileOpen : true}
      variant={isMobile ? 'temporary' : 'permanent'}
    >
      {drawerContent}
    </Drawer>
  )
}

export default AppSidebar
