import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { UserRole } from '@/shared/types/user'
import type { RoleColorPalette } from './colors'

const INTERACTION_TOKENS = {
  hover: { bgDark: 0.14, bgLight: 0.08, borderDark: 0.28, borderLight: 0.18 },
  solidHover: { bgDark: 0.86, bgLight: 0.9 },
  selected: {
    bgDark: 0.18,
    bgLight: 0.1,
    borderDark: 0.34,
    borderLight: 0.24,
  },
  selectionOutline: {
    glowDark: 0.14,
    glowLight: 0.1,
    outlineDark: 0.8,
    outlineLight: 0.9,
  },
} as const

export interface InteractionStyle {
  backgroundColor: string
  borderColor: string
}

export interface SelectionOutlineStyle {
  boxShadow: string
  outline: string
  outlineOffset: string
}

export function getRolePalette(theme: Theme, role: UserRole): RoleColorPalette {
  return theme.palette.role[role]
}

export function getRoleGradient(
  theme: Theme,
  role: UserRole,
  angle = '135deg'
) {
  const palette = getRolePalette(theme, role)

  return `linear-gradient(${angle}, ${palette.primary} 0%, ${palette.secondary} 100%)`
}

export function getRoleAccentColor(theme: Theme, role: UserRole) {
  return getRolePalette(theme, role).primary
}

export function getRoleActionTone(theme: Theme, role: UserRole) {
  const palette = getRolePalette(theme, role)

  return {
    accentSoftColor: palette.soft,
    confirmColor: palette.primary,
    confirmHoverColor: getSolidHoverColor(theme, palette.primary),
    confirmTextColor: palette.contrast,
  }
}

function isDark(theme: Theme) {
  return theme.palette.mode === 'dark'
}

export function getHoverStyle(theme: Theme, color: string): InteractionStyle {
  const t = INTERACTION_TOKENS.hover
  const dark = isDark(theme)

  return {
    backgroundColor: alpha(color, dark ? t.bgDark : t.bgLight),
    borderColor: alpha(color, dark ? t.borderDark : t.borderLight),
  }
}

export function getSolidHoverColor(theme: Theme, color: string) {
  const t = INTERACTION_TOKENS.solidHover
  const dark = isDark(theme)

  return alpha(color, dark ? t.bgDark : t.bgLight)
}

export function getSelectedStyle(
  theme: Theme,
  color: string
): InteractionStyle {
  const t = INTERACTION_TOKENS.selected
  const dark = isDark(theme)

  return {
    backgroundColor: alpha(color, dark ? t.bgDark : t.bgLight),
    borderColor: alpha(color, dark ? t.borderDark : t.borderLight),
  }
}

export function getSelectionOutlineStyle(
  theme: Theme,
  color: string
): SelectionOutlineStyle {
  const t = INTERACTION_TOKENS.selectionOutline
  const dark = isDark(theme)

  return {
    boxShadow: `0 0 0 3px ${alpha(color, dark ? t.glowDark : t.glowLight)}`,
    outline: `1px solid ${alpha(color, dark ? t.outlineDark : t.outlineLight)}`,
    outlineOffset: '0px',
  }
}

export function getRoleHoverStyle(
  theme: Theme,
  role: UserRole
): InteractionStyle {
  return getHoverStyle(theme, getRoleAccentColor(theme, role))
}

export function getRoleSolidHoverColor(theme: Theme, role: UserRole) {
  return getSolidHoverColor(theme, getRoleAccentColor(theme, role))
}

export function getRoleSelectedStyle(
  theme: Theme,
  role: UserRole
): InteractionStyle {
  return getSelectedStyle(theme, getRoleAccentColor(theme, role))
}
