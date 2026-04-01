import type { UserRole } from '@/types/user'

interface RoleColorPalette {
  contrast: string
  primary: string
  secondary: string
  soft: string
}

export class AppColors {
  static readonly neutral = {
    background: '#F3F5F9',
    border: '#D9DEE7',
    card: '#FFFFFF',
    mutedText: '#667085',
    text: '#111827',
  } as const

  static readonly light = {
    primary: '#319bdd',
    primaryDark: '#14356D',
    primaryLight: '#4C74BD',
    secondary: '#117C74',
    secondaryDark: '#0C5953',
    secondaryLight: '#43A79F',
    success: '#2E7D4F',
    warning: '#C7831C',
    error: '#C14953',
    info: '#d6ebf8',
    backgroundDefault: '#F4F7FB',
    backgroundHover: '#E9EEF4',
    backgroundPaper: '#FFFFFF',
    textPrimary: '#102A43',
    textSecondary: '#52606D',
  } as const

  static readonly dark = {
    primary: '#8CB4FF',
    primaryDark: '#5D90E8',
    primaryLight: '#B1CCFF',
    secondary: '#78D3C8',
    secondaryDark: '#4DA89E',
    secondaryLight: '#A2E5DD',
    success: '#6BD38B',
    warning: '#F0B35A',
    error: '#F08B94',
    info: '#80B7F0',
    backgroundDefault: '#0D1626',
    backgroundHover: '#132238',
    backgroundPaper: '#132238',
    textPrimary: '#F4F7FB',
    textSecondary: '#B6C2CF',
  } as const

  static readonly role: Record<UserRole, RoleColorPalette> = {
    student: {
      contrast: '#FFFFFF',
      primary: '#1D4ED8',
      secondary: '#0284C7',
      soft: '#DBEAFE',
    },
    parent: {
      contrast: '#FFFFFF',
      primary: '#F97316',
      secondary: '#EA580C',
      soft: '#FFEDD5',
    },
    admin: {
      contrast: '#FFFFFF',
      primary: '#E11D48',
      secondary: '#BE185D',
      soft: '#FFE4E6',
    },
  }

  static gradient(from: string, to: string, angle = '135deg') {
    return `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`
  }

  static roleGradient(role: UserRole, angle = '135deg') {
    const palette = this.role[role]
    return this.gradient(palette.primary, palette.secondary, angle)
  }
}
