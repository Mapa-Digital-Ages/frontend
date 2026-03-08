import { createContext } from 'react'
import type { PaletteMode } from '@mui/material'

interface ThemeContextValue {
  mode: PaletteMode
  toggleMode: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
)
