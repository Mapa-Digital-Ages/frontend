import type { PaletteMode } from '@mui/material'
import { alpha, lighten } from '@mui/material/styles'
import { AppColors } from '../styles/AppColors'
import type { SubjectContext } from '../types/common'

const SUBJECT_CATALOG = {
  default: {
    color: 'rgba(100, 116, 139, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'default',
    label: 'Geral',
  },
  biology: {
    color: 'rgba(20, 184, 166, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'biology',
    label: 'Biologia',
  },
  english: {
    color: 'rgba(254, 51, 163, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'english',
    label: 'Inglês',
  },
  geography: {
    color: 'rgba(0, 212, 106, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'geography',
    label: 'Geografia',
  },
  history: {
    color: 'rgba(255, 186, 0, 1)',
    contrast: 'rgba(16, 42, 67, 1)',
    id: 'history',
    label: 'História',
  },
  mathematics: {
    color: 'rgba(173, 68, 248, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'mathematics',
    label: 'Matemática',
  },
  portuguese: {
    color: 'rgba(5, 113, 247, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'portuguese',
    label: 'Português',
  },
  science: {
    color: 'rgba(0, 210, 237, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'science',
    label: 'Ciências',
  },
} as const

export type SubjectId = keyof typeof SUBJECT_CATALOG
export type SubjectChipSize = 'sm' | 'md' | 'lg'

type SubjectStyleSlot = {
  backgroundColor?: string
  borderColor?: string
  color?: string
}

export type SubjectTheme = {
  badge: SubjectStyleSlot
  border: SubjectStyleSlot
  color: string
  icon: SubjectStyleSlot
  id: SubjectId
  label: string
  mutedText: SubjectStyleSlot
  option: SubjectStyleSlot
  optionSelected: SubjectStyleSlot
  progressFill: string
  progressTrack: string
  softSurface: SubjectStyleSlot
  solidSurface: SubjectStyleSlot
  text: SubjectStyleSlot
}

export type SubjectBadgeProps = {
  color: string
  label: string
}

export type SubjectChipTone = {
  backgroundColor: string
  borderColor: string
  color: string
}

export const SUBJECTS: Record<string, SubjectContext> = {
  ciencias: SUBJECT_CATALOG.science,
  geografia: SUBJECT_CATALOG.geography,
  historia: SUBJECT_CATALOG.history,
  ingles: SUBJECT_CATALOG.english,
  matematica: SUBJECT_CATALOG.mathematics,
  portugues: SUBJECT_CATALOG.portuguese,
}

type GetSubjectThemeOptions = {
  mode?: PaletteMode
}

export function getSubjectContext(
  subject: Partial<SubjectContext> | undefined,
  fallback: SubjectContext
): SubjectContext {
  return {
    color: subject?.color ?? fallback.color,
    id: subject?.id ?? fallback.id,
    label: subject?.label ?? fallback.label,
  }
}

function getResolvedSubjectId(subject?: Partial<SubjectContext>): SubjectId {
  const subjectId = subject?.id

  if (subjectId && subjectId in SUBJECT_CATALOG) {
    return subjectId as SubjectId
  }

  return 'default'
}

export function getSubjectTheme(
  subject?: Partial<SubjectContext>,
  { mode = 'light' }: GetSubjectThemeOptions = {}
): SubjectTheme {
  const id = getResolvedSubjectId(subject)
  const fallbackColor = SUBJECT_CATALOG[id].color
  const baseColor = subject?.color ?? fallbackColor
  const label = subject?.label ?? SUBJECT_CATALOG[id].label
  const isDark = mode === 'dark'
  const foregroundText = isDark
    ? AppColors.dark.textPrimary
    : AppColors.light.textPrimary
  const secondaryText = isDark
    ? AppColors.dark.textSecondary
    : AppColors.light.textSecondary
  const neutralBorder = isDark
    ? alpha(AppColors.dark.textSecondary, 0.2)
    : alpha(AppColors.neutral.border, 0.95)

  return {
    badge: {
      backgroundColor: isDark ? alpha(baseColor, 0.18) : alpha(baseColor, 0.1),
      borderColor: alpha(baseColor, isDark ? 0.34 : 0.28),
      color: baseColor,
    },
    border: {
      borderColor: neutralBorder,
      color: neutralBorder,
    },
    color: baseColor,
    icon: {
      backgroundColor: alpha(baseColor, isDark ? 0.2 : 0.12),
      color: baseColor,
    },
    id,
    label,
    mutedText: {
      color: secondaryText,
    },
    option: {
      backgroundColor: isDark
        ? alpha(AppColors.dark.backgroundPaper, 0.9)
        : AppColors.light.backgroundPaper,
      borderColor: neutralBorder,
      color: foregroundText,
    },
    optionSelected: {
      backgroundColor: alpha(baseColor, isDark ? 0.2 : 0.08),
      borderColor: alpha(baseColor, isDark ? 0.42 : 0.24),
      color: baseColor,
    },
    progressFill: baseColor,
    progressTrack: isDark
      ? alpha(AppColors.dark.textSecondary, 0.22)
      : 'rgba(233, 237, 243, 1)',
    softSurface: {
      backgroundColor: isDark ? alpha(baseColor, 0.16) : alpha(baseColor, 0.06),
      borderColor: alpha(baseColor, isDark ? 0.34 : 0.24),
    },
    solidSurface: {
      backgroundColor: isDark ? baseColor : lighten(baseColor, 0.28),
      color: SUBJECT_CATALOG[id].contrast,
    },
    text: {
      color: foregroundText,
    },
  }
}

export function getSubjectBadgeProps(
  subject?: Partial<SubjectContext>,
  options?: GetSubjectThemeOptions
): SubjectBadgeProps {
  const theme = getSubjectTheme(subject, options)

  return {
    color: theme.color,
    label: subject?.label ?? theme.label,
  }
}

export function getSubjectChipTone(
  subjectOrColor: Partial<SubjectContext> | string | undefined,
  { mode = 'light' }: GetSubjectThemeOptions = {}
): SubjectChipTone {
  const fallbackTheme = getSubjectTheme(
    typeof subjectOrColor === 'string'
      ? { color: subjectOrColor }
      : subjectOrColor,
    { mode }
  )
  const color =
    typeof subjectOrColor === 'string'
      ? subjectOrColor
      : (subjectOrColor?.color ?? fallbackTheme.color)
  const isDark = mode === 'dark'

  return {
    backgroundColor: alpha(color, isDark ? 0.16 : 0.1),
    borderColor: alpha(color, isDark ? 0.46 : 0.3),
    color,
  }
}
