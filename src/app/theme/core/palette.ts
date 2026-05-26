import type { PaletteMode, Theme, ThemeOptions } from '@mui/material'
import type { UserRole } from '@/shared/types/user'
import { AppColors, type RoleColorPalette } from './colors'

export type IconVariantName =
  | 'blue'
  | 'cyan'
  | 'green'
  | 'grey'
  | 'orange'
  | 'purple'
  | 'red'

interface IconVariantToken {
  color: string
  background: string
}

declare module '@mui/material/styles' {
  interface TypeBackground {
    hover: string
    border: string
    hoverBorder: string
  }

  interface PaletteColor {
    hover?: string
  }

  interface SimplePaletteColorOptions {
    hover?: string
  }

  interface Palette {
    iconVariants: Record<IconVariantName, IconVariantToken>
    role: Record<UserRole, RoleColorPalette>
  }

  interface PaletteOptions {
    iconVariants?: Record<IconVariantName, IconVariantToken>
    role?: Record<UserRole, RoleColorPalette>
  }
}

const lightPalette: ThemeOptions['palette'] = {
  primary: {
    main: AppColors.light.primary,
    light: AppColors.light.primaryLight,
    dark: AppColors.light.primaryDark,
    hover: AppColors.light.primaryHover,
    contrastText: AppColors.light.contrastText,
  },
  secondary: {
    main: AppColors.light.secondary,
    light: AppColors.light.secondaryLight,
    dark: AppColors.light.secondaryDark,
    contrastText: AppColors.light.contrastText,
  },
  success: {
    main: AppColors.light.success,
    hover: AppColors.light.successHover,
  },
  warning: {
    main: AppColors.light.warning,
    hover: AppColors.light.warningHover,
  },
  error: {
    main: AppColors.light.error,
    hover: AppColors.light.errorHover,
  },
  info: {
    main: AppColors.light.info,
    hover: AppColors.light.infoHover,
  },
  background: {
    default: AppColors.light.backgroundDefault,
    paper: AppColors.light.backgroundPaper,
    hover: AppColors.light.backgroundHover,
    border: AppColors.light.border,
    hoverBorder: AppColors.light.hoverBorder,
  },
  text: {
    primary: AppColors.light.textPrimary,
    secondary: AppColors.light.textSecondary,
  },
  iconVariants: AppColors.iconVariants.light,
  role: AppColors.role,
}

const darkPalette: ThemeOptions['palette'] = {
  primary: {
    main: AppColors.dark.primary,
    light: AppColors.dark.primaryLight,
    dark: AppColors.dark.primaryDark,
    hover: AppColors.dark.primaryHover,
    contrastText: AppColors.dark.contrastTextPrimary,
  },
  secondary: {
    main: AppColors.dark.secondary,
    light: AppColors.dark.secondaryLight,
    dark: AppColors.dark.secondaryDark,
    contrastText: AppColors.dark.contrastTextSecondary,
  },
  success: {
    main: AppColors.dark.success,
    hover: AppColors.dark.successHover,
  },
  warning: {
    main: AppColors.dark.warning,
    hover: AppColors.dark.warningHover,
  },
  error: {
    main: AppColors.dark.error,
    hover: AppColors.dark.errorHover,
  },
  info: {
    main: AppColors.dark.info,
    hover: AppColors.dark.infoHover,
  },
  background: {
    default: AppColors.dark.backgroundDefault,
    paper: AppColors.dark.backgroundPaper,
    hover: AppColors.dark.backgroundHover,
    border: AppColors.dark.border,
    hoverBorder: AppColors.dark.hoverBorder,
  },
  text: {
    primary: AppColors.dark.textPrimary,
    secondary: AppColors.dark.textSecondary,
  },
  iconVariants: AppColors.iconVariants.dark,
  role: AppColors.role,
}

export function getPalette(mode: PaletteMode): ThemeOptions['palette'] {
  return {
    mode,
    ...(mode === 'dark' ? darkPalette : lightPalette),
  }
}
