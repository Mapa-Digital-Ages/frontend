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
    primary: 'rgba(53, 156, 223, 1)',
    primaryDark: 'rgba(20, 53, 109, 1)',
    primaryLight: 'rgba(214, 235, 248, 1)',
    primaryHover: 'rgba(53, 144, 223, 1)',
    secondary: 'rgba(17, 124, 116, 1)',
    secondaryDark: 'rgba(12, 89, 83, 1)',
    secondaryLight: 'rgba(67, 167, 159, 1)',
    success: 'rgba(43, 171, 111, 1)',
    successHover: 'rgba(34, 139, 90, 1)',
    warning: 'rgba(199, 131, 28, 1)',
    warningHover: 'rgba(168, 109, 18, 1)',
    error: 'rgba(193, 73, 83, 1)',
    errorHover: 'rgba(163, 55, 64, 1)',
    info: 'rgba(62, 124, 177, 1)',
    infoHover: 'rgba(47, 101, 149, 1)',
    backgroundDefault: 'rgba(244, 247, 251, 1)',
    backgroundPaper: 'rgba(255, 255, 255, 1)',
    backgroundHover: 'rgba(233, 238, 244, 1)',
    border: 'rgba(223, 227, 231, 1)',
    hoverBorder: 'rgba(189, 197, 209, 1)',
    textPrimary: 'rgba(16, 42, 67, 1)',
    textSecondary: 'rgba(82, 96, 109, 1)',
  } as const

  static readonly dark = {
    primary: 'rgba(140, 180, 255, 1)',
    primaryDark: 'rgba(93, 144, 232, 1)',
    primaryLight: 'rgba(177, 204, 255, 1)',
    primaryHover: 'rgba(120, 170, 255, 1)',
    secondary: 'rgba(120, 211, 200, 1)',
    secondaryDark: 'rgba(77, 168, 158, 1)',
    secondaryLight: 'rgba(162, 229, 221, 1)',
    success: 'rgba(107, 211, 139, 1)',
    successHover: 'rgba(80, 185, 112, 1)',
    warning: 'rgba(240, 179, 90, 1)',
    warningHover: 'rgba(214, 153, 64, 1)',
    error: 'rgba(240, 139, 148, 1)',
    errorHover: 'rgba(214, 110, 120, 1)',
    info: 'rgba(128, 183, 240, 1)',
    infoHover: 'rgba(100, 158, 216, 1)',
    backgroundDefault: 'rgba(13, 22, 38, 1)',
    backgroundPaper: 'rgba(19, 34, 56, 1)',
    backgroundHover: 'rgba(25, 50, 72, 1)',
    border: 'rgba(55, 77, 112, 1)',
    hoverBorder: 'rgba(75, 97, 132, 1)',
    textPrimary: 'rgba(244, 247, 251, 1)',
    textSecondary: 'rgba(182, 194, 207, 1)',
  } as const

  static readonly role: Record<UserRole, RoleColorPalette> = {
    aluno: {
      contrast: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(29, 78, 216, 1)',
      secondary: 'rgba(2, 132, 199, 1)',
      soft: 'rgba(219, 234, 254, 1)',
    },
    responsavel: {
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
    empresa: {
      contrast: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(140, 67, 203, 1)',
      secondary: 'rgba(97, 50, 189, 1)',
      soft: 'rgba(243, 232, 255, 1)',
    },
    escola: {
      contrast: 'rgba(255, 255, 255, 1)',
      primary: 'rgba(36, 158, 117, 1)',
      secondary: 'rgba(31, 132, 112, 1)',
      soft: 'rgba(209, 250, 229, 1)',
    },
  }

  static readonly iconVariants = {
    light: {
      blue: {
        color: 'rgba(37, 99, 235, 1)',
        background: 'rgba(219, 234, 254, 1)',
      },
      cyan: {
        color: 'rgba(2, 132, 199, 1)',
        background: 'rgba(224, 242, 254, 1)',
      },
      green: {
        color: 'rgba(5, 150, 105, 1)',
        background: 'rgba(209, 250, 229, 1)',
      },
      grey: {
        color: 'rgba(75, 85, 99, 1)',
        background: 'rgba(229, 231, 235, 1)',
      },
      orange: {
        color: 'rgba(234, 88, 12, 1)',
        background: 'rgba(255, 237, 213, 1)',
      },
      purple: {
        color: 'rgba(124, 58, 237, 1)',
        background: 'rgba(237, 233, 254, 1)',
      },
      red: {
        color: 'rgba(220, 38, 38, 1)',
        background: 'rgba(254, 226, 226, 1)',
      },
    },
    dark: {
      blue: {
        color: 'rgba(147, 197, 253, 1)',
        background: 'rgba(23, 37, 84, 1)',
      },
      cyan: {
        color: 'rgba(125, 211, 252, 1)',
        background: 'rgba(8, 47, 73, 1)',
      },
      green: {
        color: 'rgba(110, 231, 183, 1)',
        background: 'rgba(6, 78, 59, 1)',
      },
      grey: {
        color: 'rgba(156, 163, 175, 1)',
        background: 'rgba(31, 41, 55, 1)',
      },
      orange: {
        color: 'rgba(253, 186, 116, 1)',
        background: 'rgba(67, 20, 7, 1)',
      },
      purple: {
        color: 'rgba(196, 181, 253, 1)',
        background: 'rgba(46, 16, 101, 1)',
      },
      red: {
        color: 'rgba(252, 165, 165, 1)',
        background: 'rgba(69, 10, 10, 1)',
      },
    },
  } as const

  static gradient(from: string, to: string, angle = '135deg') {
    return `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`
  }

  static roleGradient(role: UserRole, angle = '135deg') {
    const palette = this.role[role]
    return this.gradient(palette.primary, palette.secondary, angle)
  }
}
