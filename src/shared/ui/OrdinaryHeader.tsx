import { Box, Stack, Typography } from '@mui/material'
import ProgressBar from '../ui/ProgressBar'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import type { ReactNode } from 'react'

type HeaderVariant =
  | 'aluno'
  | 'responsavel'
  | 'school'
  | 'company'
  | 'admin'
  | 'enterpriseSchool'

interface OrdinaryHeaderProps {
  title: string
  subtitle: string
  eyebrow?: string
  tag?: string
  progress?: number
  variant?: HeaderVariant
  actions?: ReactNode
}

function OrdinaryHeader({
  title,
  subtitle,
  tag,
  progress,
  actions,
}: OrdinaryHeaderProps) {
  return (
    <Stack
      data-testid="header"
      className="w-full max-w-none py-2 flex-col items-start"
    >
      <Box className="space-y-1 min-w-0 w-full">
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

export default OrdinaryHeader
