import type { PaletteMode, ThemeOptions } from '@mui/material'

const lightPalette: ThemeOptions['palette'] = {
  primary: {
    main: '#1F4B99',
    light: '#4C74BD',
    dark: '#14356D',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#117C74',
    light: '#43A79F',
    dark: '#0C5953',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2E7D4F',
  },
  warning: {
    main: '#C7831C',
  },
  error: {
    main: '#C14953',
  },
  info: {
    main: '#3E7CB1',
  },
  background: {
    default: '#F4F7FB',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#102A43',
    secondary: '#52606D',
  },
}

const darkPalette: ThemeOptions['palette'] = {
  primary: {
    main: '#8CB4FF',
    light: '#B1CCFF',
    dark: '#5D90E8',
    contrastText: '#08111F',
  },
  secondary: {
    main: '#78D3C8',
    light: '#A2E5DD',
    dark: '#4DA89E',
    contrastText: '#041816',
  },
  success: {
    main: '#6BD38B',
  },
  warning: {
    main: '#F0B35A',
  },
  error: {
    main: '#F08B94',
  },
  info: {
    main: '#80B7F0',
  },
  background: {
    default: '#0D1626',
    paper: '#132238',
  },
  text: {
    primary: '#F4F7FB',
    secondary: '#B6C2CF',
  },
}

export function getPalette(mode: PaletteMode): ThemeOptions['palette'] {
  return {
    mode,
    ...(mode === 'dark' ? darkPalette : lightPalette),
  }
}
