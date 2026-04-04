import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getSubjectTheme } from '../../utils/subjectThemes'
import type { SubjectContext } from '../../types/common'

interface ProgressBarProps {
  label?: string
  showValueLabel?: boolean
  subject?: SubjectContext
  thickness?: number
  valueLabel?: string
  valueLabelVariant?: 'plain' | 'soft'
  value: number
}

function ProgressBar({
  label,
  showValueLabel = true,
  subject = { label: 'Geral' },
  thickness = 8,
  value,
  valueLabel,
  valueLabelVariant = 'plain',
}: ProgressBarProps) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(subject, { mode: theme.palette.mode })
  const normalizedValue = Math.max(0, Math.min(100, value))
  const resolvedValueLabel = valueLabel ?? `${Math.round(normalizedValue)}%`

  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box sx={{ flex: 1 }}>
        {label ? (
          <Typography
            sx={{
              color: subjectTheme.mutedText.color,
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              mb: 0.75,
            }}
          >
            {label}
          </Typography>
        ) : null}
        <LinearProgress
          sx={{
            backgroundColor: subjectTheme.progressTrack,
            borderRadius: 999,
            height: thickness,
            '& .MuiLinearProgress-bar': {
              backgroundColor: subjectTheme.progressFill,
              borderRadius: 999,
            },
          }}
          value={normalizedValue}
          variant="determinate"
        />
      </Box>
      {showValueLabel ? (
        <Typography
          sx={{
            backgroundColor:
              valueLabelVariant === 'soft'
                ? subjectTheme.softSurface.backgroundColor
                : 'transparent',
            border: valueLabelVariant === 'soft' ? 'none' : 'none',
            borderRadius: valueLabelVariant === 'soft' ? 999 : 0,
            color:
              valueLabelVariant === 'soft'
                ? theme.palette.primary.contrastText
                : subjectTheme.text.color,
            fontSize: valueLabelVariant === 'soft' ? 12 : 14,
            fontWeight: 700,
            minWidth: valueLabelVariant === 'soft' ? 'fit-content' : 32,
            px: valueLabelVariant === 'soft' ? 1.25 : 0,
            py: valueLabelVariant === 'soft' ? 0.375 : 0,
            textAlign: 'right',
          }}
        >
          {resolvedValueLabel}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default ProgressBar
