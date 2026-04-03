import type { UserRole } from '@/types/user'

interface RoleColorPalette {
  contrast: string
  primary: string
  secondary: string
  soft: string
}

export class AppColors {
  static readonly neutral = {
    background: 'rgba(243, 245, 249, 1)',
    border: 'rgba(217, 222, 231, 1)',
    card: 'rgba(255, 255, 255, 1)',
    mutedText: 'rgba(102, 112, 133, 1)',
    text: 'rgba(17, 24, 39, 1)',
  } as const

  static readonly light = {
    primary: 'rgba(31, 75, 153, 1)',
    primaryDark: 'rgba(20, 53, 109, 1)',
    primaryLight: 'rgb(214 235 248)',
    secondary: 'rgba(17, 124, 116, 1)',
    secondaryDark: 'rgba(12, 89, 83, 1)',
    secondaryLight: 'rgba(67, 167, 159, 1)',
    success: 'rgba(46, 125, 79, 1)',
    warning: 'rgba(199, 131, 28, 1)',
    error: 'rgba(193, 73, 83, 1)',
    info: 'rgba(62, 124, 177, 1)',
    backgroundDefault: 'rgba(244, 247, 251, 1)',
    backgroundPaper: 'rgba(255, 255, 255, 1)',
    backgroundHover: 'rgba(233, 238, 244, 1)',
    textPrimary: 'rgba(16, 42, 67, 1)',
    textSecondary: 'rgba(82, 96, 109, 1)',
  } as const

  static readonly dark = {
    primary: 'rgba(140, 180, 255, 1)',
    primaryDark: 'rgba(93, 144, 232, 1)',
    primaryLight: 'rgba(177, 204, 255, 1)',
    secondary: 'rgba(120, 211, 200, 1)',
    secondaryDark: 'rgba(77, 168, 158, 1)',
    secondaryLight: 'rgba(162, 229, 221, 1)',
    success: 'rgba(107, 211, 139, 1)',
    warning: 'rgba(240, 179, 90, 1)',
    error: 'rgba(240, 139, 148, 1)',
    info: 'rgba(128, 183, 240, 1)',
    backgroundDefault: 'rgba(13, 22, 38, 1)',
    backgroundPaper: 'rgba(19, 34, 56, 1)',
    backgroundHover: 'rgba(25, 50, 72, 1)',
    textPrimary: 'rgba(244, 247, 251, 1)',
    textSecondary: 'rgba(182, 194, 207, 1)',
  } as const

  static readonly role: Record<UserRole, RoleColorPalette> = {
    student: {
      contrast: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(29, 78, 216, 1)',
      secondary: 'rgba(2, 132, 199, 1)',
      soft: 'rgba(219, 234, 254, 1)',
    },
    parent: {
      contrast: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(249, 115, 22, 1)',
      secondary: 'rgba(234, 88, 12, 1)',
      soft: 'rgba(255, 237, 213, 1)',
    },
    admin: {
      contrast: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(225, 29, 72, 1)',
      secondary: 'rgba(190, 24, 93, 1)',
      soft: 'rgba(255, 228, 230, 1)',
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
