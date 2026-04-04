import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { CssBaseline, type PaletteMode } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { STORAGE_KEYS } from '@/constants/storage'
import { createAppTheme } from '@/styles/theme'
import { getStorageItem, setStorageItem } from '@/utils/storage'
import { ThemeContext, type ThemePreference } from './theme-context'

function getSystemMode(): PaletteMode {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }

  return 'light'
}

function applyThemeToDocument(mode: PaletteMode) {
  const rootElement = document.documentElement
  rootElement.dataset.theme = mode
  rootElement.classList.toggle('dark', mode === 'dark')
}

function getInitialPreference(): ThemePreference {
  return getStorageItem<ThemePreference>(STORAGE_KEYS.themeMode) ?? 'system'
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [preference, setPreference] =
    useState<ThemePreference>(getInitialPreference)
  const [systemMode, setSystemMode] = useState<PaletteMode>(getSystemMode)
  const mode = preference === 'system' ? systemMode : preference
  const theme = useMemo(() => createAppTheme(mode), [mode])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleSystemModeChange() {
      setSystemMode(mediaQuery.matches ? 'dark' : 'light')
    }

    handleSystemModeChange()
    mediaQuery.addEventListener('change', handleSystemModeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemModeChange)
    }
  }, [])

  useEffect(() => {
    applyThemeToDocument(mode)
  }, [mode])

  function setThemePreference(nextPreference: ThemePreference) {
    setPreference(nextPreference)
    setStorageItem(STORAGE_KEYS.themeMode, nextPreference)
  }

  return (
    <ThemeContext.Provider value={{ mode, preference, setThemePreference }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
