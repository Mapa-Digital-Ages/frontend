import { createContext } from 'react'
import type { PaletteMode } from '@mui/material'

export type ThemePreference = PaletteMode | 'system'

interface ThemeContextValue {
  mode: PaletteMode
  preference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
)
