import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { Button } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useContext } from 'react'
import { ThemeContext } from '@/context/theme-context'

function ThemeModeToggle() {
  const theme = useTheme()
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    return null
  }

  const { mode, setThemePreference } = themeContext
  const isDarkMode = mode === 'dark'
  const Icon = isDarkMode ? DarkModeRoundedIcon : LightModeRoundedIcon

  function handleToggleTheme() {
    setThemePreference(isDarkMode ? 'light' : 'dark')
  }

  return (
    <Button
      aria-label={`Alternar para tema ${isDarkMode ? 'claro' : 'escuro'}`}
      className="min-w-0"
      onClick={handleToggleTheme}
      startIcon={<Icon fontSize="small" />}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.72),
        border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        borderRadius: 9999,
        color: theme.palette.text.primary,
        minHeight: 32,
        px: 1.5,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
        },
      }}
    >
      {isDarkMode ? 'Escuro' : 'Claro'}
    </Button>
  )
}

export default ThemeModeToggle
