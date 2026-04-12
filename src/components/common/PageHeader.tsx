import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import ProgressBar from '../ui/ProgressBar'
import StarOutlineIcon from '@mui/icons-material/StarOutline'

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
}

const variantStyles: Record<HeaderVariant, string> = {
  aluno: 'bg-[#359CDF] text-white',
  responsavel: 'bg-gradient-to-r from-[#F06F19] to-[#DE4512] text-white',
  school: 'bg-gradient-to-r from-[#249E75] to-[#1F8470] text-white',
  company: 'bg-gradient-to-r from-[#8C43CB] to-[#6132BD] text-white',
  admin: 'bg-gradient-to-r from-[#D32248] to-[#BF2260] text-white',
  enterpriseSchool: 'bg-gradient-to-r from-[#506F34] to-[#5A642B] text-white',
}

function PageHeader({
  title,
  subtitle,
  eyebrow,
  tag,
  progress,
  variant = 'aluno',
}: PageHeaderProps) {
  return (
    <Stack
      data-testid="header"
      className={`w-full max-w-none rounded-2xl px-6 py-5 flex-col gap-3 md:flex-row items-start md:justify-between ${variantStyles[variant]}`}
    >
      <Box className="space-y-1 min-w-0 w-full">
        {eyebrow && (
          <Typography variant="body2" className="opacity-80">
            {eyebrow}
          </Typography>
        )}

        <Box className="mt-2 mb-2 flex items-start justify-between w-full">
          <Typography
            variant="h3"
            sx={{ fontSize: '24px' }}
            className="mt-2 text-left"
          >
            {title}
          </Typography>

          {tag && (
            <Box className="mr-4 flex items-center gap-2 rounded-xl bg-white/20 px-8 py-2 font-semibold whitespace-nowrapt text-sm">
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
