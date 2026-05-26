import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ProgressBar from '../ui/ProgressBar'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { getRoleGradient, getRolePalette } from '@/app/theme/core/roles'
import { useAuth } from '@/app/auth/hook'
import type { ReactNode } from 'react'
import type { UserRole } from '@/shared/types/user'

type HeaderVariant =
  | 'aluno'
  | 'responsavel'
  | 'school'
  | 'company'
  | 'admin'
  | 'enterpriseSchool'

interface PageHeaderProps {
  title: string
  subtitle: string
  eyebrow?: string
  tag?: string
  progress?: number
  variant?: HeaderVariant
  actions?: ReactNode
}

const headerRoleByVariant = {
  admin: 'admin',
  aluno: 'aluno',
  company: 'empresa',
  enterpriseSchool: 'escola_empresa',
  responsavel: 'responsavel',
  school: 'escola',
} satisfies Record<HeaderVariant, UserRole>

function getHeaderRole(variant: HeaderVariant) {
  return headerRoleByVariant[variant]
}

function PageHeader({
  title,
  subtitle,
  eyebrow,
  tag,
  progress,
  variant = 'aluno',
  actions,
}: PageHeaderProps) {
  const theme = useTheme()
  const { user } = useAuth()
  const headerRole = getHeaderRole(variant)
  const headerPalette = getRolePalette(theme, headerRole)
  const headerBackground = getRoleGradient(theme, headerRole)
  const resolvedEyebrow =
    eyebrow ?? (user?.name ? `Olá, ${user.name}` : undefined)

  return (
    <Stack
      data-testid="header"
      className="w-full max-w-none rounded-2xl px-6 py-5 flex-col gap-3 md:flex-row items-start md:justify-between"
      sx={{
        background: headerBackground,
        color: headerPalette.contrast,
      }}
    >
      <Box className="space-y-1 min-w-0 w-full">
        {resolvedEyebrow && (
          <Typography variant="body2" className="opacity-80">
            {resolvedEyebrow}
          </Typography>
        )}

        <Box className="mt-2 mb-2 flex items-center justify-between w-full gap-3">
          <Box className="min-w-0 flex-1">
            <Typography
              variant="h3"
              sx={{ fontSize: '24px' }}
              className="mt-2 text-left"
            >
              {title}
            </Typography>
          </Box>

          {actions && <Box className="shrink-0">{actions}</Box>}

          {tag && !actions && (
            <Box className="mr-4 flex items-center gap-2 rounded-xl px-8 py-2 font-semibold whitespace-nowrap text-sm shrink-0">
              <StarOutlineIcon fontSize="medium" className="opacity-90" />
              {tag}
            </Box>
          )}
        </Box>

        <Typography variant="body2" className="opacity-90 text-left">
          {subtitle}
        </Typography>

        {progress !== undefined && (
          <Box className="w-full">
            <ProgressBar value={progress} valueLabelVariant="header" />
          </Box>
        )}
      </Box>
    </Stack>
  )
}

export default PageHeader
