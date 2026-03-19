import type { PaletteMode, ThemeOptions } from '@mui/material'
import { AppColors } from './AppColors'

const lightPalette: ThemeOptions['palette'] = {
  primary: {
    main: AppColors.light.primary,
    light: AppColors.light.primaryLight,
    dark: AppColors.light.primaryDark,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: AppColors.light.secondary,
    light: AppColors.light.secondaryLight,
    dark: AppColors.light.secondaryDark,
    contrastText: '#FFFFFF',
  },
  success: {
    main: AppColors.light.success,
  },
  warning: {
    main: AppColors.light.warning,
  },
  error: {
    main: AppColors.light.error,
  },
  info: {
    main: AppColors.light.info,
  },
  background: {
    default: AppColors.light.backgroundDefault,
    paper: AppColors.light.backgroundPaper,
  },
  text: {
    primary: AppColors.light.textPrimary,
    secondary: AppColors.light.textSecondary,
  },
}

const darkPalette: ThemeOptions['palette'] = {
  primary: {
    main: AppColors.dark.primary,
    light: AppColors.dark.primaryLight,
    dark: AppColors.dark.primaryDark,
    contrastText: '#08111F',
  },
  secondary: {
    main: AppColors.dark.secondary,
    light: AppColors.dark.secondaryLight,
    dark: AppColors.dark.secondaryDark,
    contrastText: '#041816',
  },
  success: {
    main: AppColors.dark.success,
  },
  warning: {
    main: AppColors.dark.warning,
  },
  error: {
    main: AppColors.dark.error,
  },
  info: {
    main: AppColors.dark.info,
  },
  background: {
    default: AppColors.dark.backgroundDefault,
    paper: AppColors.dark.backgroundPaper,
  },
  text: {
    primary: AppColors.dark.textPrimary,
    secondary: AppColors.dark.textSecondary,
  },
}

export function getPalette(mode: PaletteMode): ThemeOptions['palette'] {
  return {
    mode,
    ...(mode === 'dark' ? darkPalette : lightPalette),
  }
}
