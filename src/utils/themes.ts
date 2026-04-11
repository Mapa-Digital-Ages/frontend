import type { PaletteMode } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { alpha, lighten } from '@mui/material/styles'
import { AppColors } from '../styles/AppColors'
import type {
  ApprovalBadge,
  ApprovalBadgeTone,
  ApprovalCardStatus,
  ContentApprovalStatus,
  GuardianApprovalStatus,
} from '../types/admin'
import type { TagContext } from '../types/common'

export type TagSize = 'sm' | 'md' | 'lg'
export type SubjectChipSize = TagSize

export type TagChipTone = {
  backgroundColor: string
  borderColor: string
  color: string
}

function normalizeHex(color: string) {
  const value = color.trim()

  if (!value.startsWith('#')) {
    return null
  }

  const hex = value.slice(1)

  if (hex.length === 3) {
    return hex
      .split('')
      .map(char => `${char}${char}`)
      .join('')
  }

  if (hex.length === 6) {
    return hex
  }

  return null
}

function parseRgbColor(color: string) {
  const normalizedHex = normalizeHex(color)

  if (normalizedHex) {
    return {
      b: Number.parseInt(normalizedHex.slice(4, 6), 16),
      g: Number.parseInt(normalizedHex.slice(2, 4), 16),
      r: Number.parseInt(normalizedHex.slice(0, 2), 16),
    }
  }

  const rgbaMatch = color
    .trim()
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i)

  if (!rgbaMatch) {
    return null
  }

  return {
    b: Number.parseInt(rgbaMatch[3] ?? '0', 10),
    g: Number.parseInt(rgbaMatch[2] ?? '0', 10),
    r: Number.parseInt(rgbaMatch[1] ?? '0', 10),
  }
}

export function getReadableTextColor(color: string | undefined) {
  if (!color) {
    return 'rgba(255, 255, 255, 1)'
  }

  const rgb = parseRgbColor(color)

  if (!rgb) {
    return 'rgba(255, 255, 255, 1)'
  }

  const channel = (value: number) => {
    const normalized = value / 255

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  const luminance =
    0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)

  return luminance > 0.6 ? 'rgba(16, 42, 67, 1)' : 'rgba(255, 255, 255, 1)'
}

export function getTagChipTone(
  color: string | undefined,
  { mode = 'light' }: { mode?: PaletteMode } = {}
): TagChipTone {
  const resolvedColor = color ?? 'rgba(32, 109, 197, 1)'
  const isDark = mode === 'dark'

  return {
    backgroundColor: alpha(resolvedColor, isDark ? 0.16 : 0.1),
    borderColor: alpha(resolvedColor, isDark ? 0.46 : 0.3),
    color: resolvedColor,
  }
}

const SUBJECT_CATALOG = {
  default: {
    color: 'rgba(32, 109, 197, 1)',
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
export const ALL_SUBJECT_TAG_CONTEXTS: TagContext[] = (
  Object.keys(SUBJECT_CATALOG) as SubjectId[]
).map(id => ({
  id: SUBJECT_CATALOG[id].id,
  label: SUBJECT_CATALOG[id].label,
  color: SUBJECT_CATALOG[id].color,
}))
export const SUBJECT_TAG_SIZES: SubjectChipSize[] = ['sm', 'md', 'lg']

type SubjectStyleSlot = {
  backgroundColor?: string
  borderColor?: string
  color?: string
}

export type ResolvedSubjectId = SubjectId | 'custom'

export type SubjectTheme = {
  badge: SubjectStyleSlot
  border: SubjectStyleSlot
  color: string
  icon: SubjectStyleSlot
  id: ResolvedSubjectId
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

export type SubjectChipTone = TagChipTone

export const SUBJECTS: Record<string, TagContext> = {
  ciencias: SUBJECT_CATALOG.science,
  geografia: SUBJECT_CATALOG.geography,
  historia: SUBJECT_CATALOG.history,
  ingles: SUBJECT_CATALOG.english,
  matematica: SUBJECT_CATALOG.mathematics,
  portugues: SUBJECT_CATALOG.portuguese,
}

function normalizeSubjectLookupValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const SUBJECTS_BY_LABEL = Object.values(SUBJECTS).reduce<
  Record<string, TagContext>
>((lookup, subject) => {
  lookup[normalizeSubjectLookupValue(subject.label)] = subject
  return lookup
}, {})

type GetSubjectThemeOptions = {
  mode?: PaletteMode
}

export function getSubjectContext(
  subject: Partial<TagContext> | undefined,
  fallback: TagContext
): TagContext {
  return {
    color: subject?.color ?? fallback.color,
    contrastColor: subject?.contrastColor ?? fallback.contrastColor,
    id: subject?.id ?? fallback.id,
    label: subject?.label ?? fallback.label,
  }
}

export function getSubjectTagContextByLabel(
  label: string | undefined
): TagContext | undefined {
  if (!label) {
    return undefined
  }

  return SUBJECTS_BY_LABEL[normalizeSubjectLookupValue(label)]
}

function getResolvedSubjectId(
  subject?: Partial<TagContext>
): ResolvedSubjectId {
  const subjectId = subject?.id

  if (subjectId && subjectId in SUBJECT_CATALOG) {
    return subjectId as SubjectId
  }

  if (subject?.color || subject?.id || subject?.label) {
    return 'custom'
  }

  return 'default'
}

export function getSubjectTheme(
  subject?: Partial<TagContext>,
  { mode = 'light' }: GetSubjectThemeOptions = {}
): SubjectTheme {
  const id = getResolvedSubjectId(subject)
  const fallbackColor =
    id === 'custom' ? SUBJECT_CATALOG.default.color : SUBJECT_CATALOG[id].color
  const baseColor = subject?.color ?? fallbackColor
  const label =
    subject?.label ??
    (id === 'custom'
      ? SUBJECT_CATALOG.default.label
      : SUBJECT_CATALOG[id].label)
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
  const contrastColor =
    subject?.contrastColor ??
    (subject?.color || id === 'custom'
      ? getReadableTextColor(baseColor)
      : SUBJECT_CATALOG[id].contrast)

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
      color: contrastColor,
    },
    text: {
      color: foregroundText,
    },
  }
}

export function getSubjectBadgeProps(
  subject?: Partial<TagContext>,
  options?: GetSubjectThemeOptions
): SubjectBadgeProps {
  const theme = getSubjectTheme(subject, options)

  return {
    color: theme.color,
    label: subject?.label ?? theme.label,
  }
}

export function getSubjectChipTone(
  subjectOrColor: Partial<TagContext> | string | undefined,
  { mode = 'light' }: GetSubjectThemeOptions = {}
): SubjectChipTone {
  const fallbackTheme = getSubjectTheme(
    typeof subjectOrColor === 'string'
      ? { color: subjectOrColor }
      : subjectOrColor,
    { mode }
  )

  const resolvedColor =
    typeof subjectOrColor === 'string'
      ? subjectOrColor
      : (subjectOrColor?.color ?? fallbackTheme.color)

  return getTagChipTone(resolvedColor, { mode })
}

export function getApprovalToneColorFromPalette(
  tone: ApprovalBadgeTone,
  palette: Theme['palette']
): string {
  switch (tone) {
    case 'danger':
      return palette.error.main
    case 'warning':
      return palette.warning.main
    case 'success':
      return palette.success.main
    case 'info':
      return palette.info.main
    default:
      return palette.text.secondary
  }
}

export function approvalBadgeToTagContext(
  badge: ApprovalBadge,
  palette: Theme['palette']
): TagContext {
  return {
    id: badge.id,
    label: badge.label,
    color: getApprovalToneColorFromPalette(badge.tone, palette),
  }
}

export function approvalBadgesToTagContexts(
  badges: ApprovalBadge[],
  palette: Theme['palette']
): TagContext[] {
  return badges.map(badge => approvalBadgeToTagContext(badge, palette))
}

export function approvalCardStatusToTagContext(
  status: ApprovalCardStatus,
  palette: Theme['palette'],
  options?: { id?: string }
): TagContext {
  return {
    id: options?.id ?? 'approval-card-status',
    label: status.label,
    color: getApprovalToneColorFromPalette(status.tone, palette),
  }
}

export const CONTENT_APPROVAL_CARD_STATUS: Record<
  ContentApprovalStatus,
  ApprovalCardStatus
> = {
  approved: {
    label: 'Aprovado',
    tone: 'success',
  },
  correctionInProgress: {
    label: 'Correção em progresso',
    tone: 'info',
  },
  inReview: {
    label: 'Em revisão',
    tone: 'warning',
  },
  rejected: {
    label: 'Recusado',
    tone: 'danger',
  },
  sent: {
    label: 'Enviado',
    tone: 'success',
  },
}

export const GUARDIAN_APPROVAL_CARD_STATUS: Record<
  GuardianApprovalStatus,
  ApprovalCardStatus
> = {
  approved: {
    label: 'Liberado',
    tone: 'success',
  },
  pendingValidation: {
    label: 'Aguardando validação',
    tone: 'warning',
  },
  rejected: {
    label: 'Recusado',
    tone: 'danger',
  },
}

const GUARDIAN_STATUS_SHOWCASE_CATALOG = {
  default: {
    color: 'rgba(32, 109, 197, 1)',
    id: 'default',
    label: 'Geral',
  },
  success: {
    color: 'rgba(20, 184, 166, 1)',
    id: 'success',
    label: 'Liberado',
  },
  warning: {
    color: 'rgba(254, 51, 163, 1)',
    id: 'warning',
    label: 'Aguardando validação',
  },
  error: {
    color: 'rgba(0, 212, 106, 1)',
    id: 'error',
    label: 'Recusado',
  },
} as const

export type GuardianStatusShowcaseId =
  keyof typeof GUARDIAN_STATUS_SHOWCASE_CATALOG

export const ALL_GUARDIAN_STATUS_TAG_CONTEXTS: TagContext[] = (
  Object.keys(GUARDIAN_STATUS_SHOWCASE_CATALOG) as GuardianStatusShowcaseId[]
).map(key => ({
  id: GUARDIAN_STATUS_SHOWCASE_CATALOG[key].id,
  label: GUARDIAN_STATUS_SHOWCASE_CATALOG[key].label,
  color: GUARDIAN_STATUS_SHOWCASE_CATALOG[key].color,
}))
