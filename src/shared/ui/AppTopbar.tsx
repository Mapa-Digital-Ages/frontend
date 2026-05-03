import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  type AppBarProps,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'

interface AppTopbarProps extends AppBarProps {
  actions?: ReactNode
  leading?: ReactNode
  onMenuClick?: () => void
  showMenuButton?: boolean
}

function AppTopbar({
  actions,
  onMenuClick,
  showMenuButton = false,
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
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          borderBottom: 'none',
        },
        ...(Array.isArray(appBarProps.sx) ? appBarProps.sx : [appBarProps.sx]),
      ]}
    >
      <Toolbar className="min-h-18 items-center justify-between gap-2 md:gap-4">
        <Box className="flex items-center gap-2">
          {showMenuButton && (
            <IconButton onClick={onMenuClick}>
              <MenuRoundedIcon />
            </IconButton>
          )}
        </Box>
        {actions && (
          <Box className="ml-auto flex items-center justify-end">{actions}</Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default AppTopbar
