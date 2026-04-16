import { useContext } from 'react'
import { ThemeContext } from './context'

export function useThemePreference() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemePreference must be used within AppThemeProvider')
  }

  return context
}
