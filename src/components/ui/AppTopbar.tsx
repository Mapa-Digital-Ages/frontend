import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  type AppBarProps,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'

interface AppTopbarProps extends AppBarProps {
  actions?: ReactNode
  onMenuClick?: () => void
  showMenuButton?: boolean
  subtitle?: string
  title?: string
}

function AppTopbar({
  actions,
  onMenuClick,
  showMenuButton = false,
  subtitle,
  title,
  ...appBarProps
}: AppTopbarProps) {
  const theme = useTheme()

  return (
    <AppBar
      color="transparent"
      position="sticky"
      {...appBarProps}
      sx={[
        {
          backdropFilter: 'blur(14px)',
          backgroundColor: alpha(theme.palette.background.default, 0.82),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        },
        ...(Array.isArray(appBarProps.sx) ? appBarProps.sx : [appBarProps.sx]),
      ]}
    >
      <Toolbar
        sx={{
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          minHeight: 80,
        }}
      >
        {showMenuButton && (
          <IconButton
            aria-label="Abrir navegação"
            color="inherit"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {title && (
            <Typography noWrap variant="h6">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography color="text.secondary" noWrap variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              ml: 'auto',
            }}
          >
            {actions}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default AppTopbar
