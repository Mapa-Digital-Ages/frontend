import { useState, type PropsWithChildren } from 'react'
import { CssBaseline, type PaletteMode } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { STORAGE_KEYS } from '@/constants/storage'
import { createAppTheme } from '@/styles/theme'
import { getStorageItem, setStorageItem } from '@/utils/storage'
import { ThemeContext } from './theme-context'

function getInitialMode(): PaletteMode {
  return getStorageItem<PaletteMode>(STORAGE_KEYS.themeMode) ?? 'light'
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode)
  const theme = createAppTheme(mode)

  function toggleMode() {
    setMode(currentMode => {
      const nextMode = currentMode === 'light' ? 'dark' : 'light'
      setStorageItem(STORAGE_KEYS.themeMode, nextMode)
      return nextMode
    })
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
