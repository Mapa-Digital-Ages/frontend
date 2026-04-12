import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useContext } from 'react'
import AppDropdown, { type DropdownOption } from '@/components/ui/AppDropdown'
import { ThemeContext, type ThemePreference } from '@/context/theme-context'

const THEME_OPTIONS: DropdownOption[] = [
  { label: 'Sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]

function ThemeModeToggle() {
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    return null
  }

  const { mode, preference, setThemePreference } = themeContext
  const leadingIcon =
    preference === 'system' ? (
      <AutoModeRoundedIcon fontSize="small" />
    ) : mode === 'dark' ? (
      <DarkModeRoundedIcon fontSize="small" />
    ) : (
      <LightModeRoundedIcon fontSize="small" />
    )

  return (
    <AppDropdown
      aria-label="Selecionar tema"
      leadingIcon={leadingIcon}
      onChange={event =>
        setThemePreference(event.target.value as ThemePreference)
      }
      options={THEME_OPTIONS}
      triggerVariant="ghost"
      value={preference}
      width="auto"
      menuWidth={200}
      sx={{
        width: 'fit-content',
        height: '30px',
        '& .MuiButton-root': {
          height: '30px',
        },
        '& .MuiButton-root:hover': {
          backgroundColor: 'transparent',
        },
        '& .MuiButton-root:active': {
          backgroundColor: 'transparent',
        },
        '& .MuiButton-root:focus': {
          backgroundColor: 'transparent',
        },
        '& .MuiButton-root:focus-visible': {
          backgroundColor: 'transparent',
        },
        '& .MuiButton-root:focus-within': {
          backgroundColor: 'transparent',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            marginTop: '10px',
            width: 'fit',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          },
        },
      }}
    />
  )
}

export default ThemeModeToggle
