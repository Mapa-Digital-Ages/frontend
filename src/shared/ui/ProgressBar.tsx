import React from 'react'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getSubjectTheme } from '@/shared/utils/themes'
import type { SubjectContext } from '@/shared/types/common'
import type { ReactNode } from 'react'

interface ProgressBarProps {
  headerSlot?: ReactNode
  label?: string
  showValueLabel?: boolean
  subject?: SubjectContext
  thickness?: number
  valueLabel?: string
  valueLabelVariant?: 'plain' | 'soft' | 'header' | 'alternative' | 'subject'
  value: number
}

function ProgressBar({
  headerSlot,
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
  const isSoftValueLabel = valueLabelVariant === 'soft'
  const isHeaderValueLabel = valueLabelVariant === 'header'
  const isSubjectVariant = valueLabelVariant === 'subject'

  if (isSubjectVariant) {
    return (
      <Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          {headerSlot ?? null}
          {showValueLabel && (
            <Typography
              sx={{
                color: subjectTheme.color,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {resolvedValueLabel}
            </Typography>
          )}
        </Box>
        <LinearProgress
          sx={{
            backgroundColor: subjectTheme.progressTrack,
            borderRadius: 999,
            height: thickness,
            '& .MuiLinearProgress-bar': {
              borderColor: subjectTheme.progressTrack,
              backgroundColor: subjectTheme.progressFill,
              borderRadius: 999,
            },
          }}
          value={normalizedValue}
          variant="determinate"
        />
      </Box>
    )
  }

  return (
    <Stack
      direction={{ sm: 'row', xs: isSoftValueLabel ? 'column' : 'row' }}
      spacing={1.25}
      sx={{
        alignItems: {
          sm: 'center',
          xs: isSoftValueLabel ? 'stretch' : 'center',
        },
      }}
    >
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
            backgroundColor: isHeaderValueLabel
              ? 'rgba(255,255,255,0.25)'
              : subjectTheme.progressTrack,
            borderRadius: 999,
            height: thickness,
            '& .MuiLinearProgress-bar': {
              backgroundColor: isHeaderValueLabel
                ? 'rgba(255,255,255,0.85)'
                : subjectTheme.progressFill,
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
            alignSelf: {
              sm: 'auto',
              xs:
                isSoftValueLabel || isHeaderValueLabel ? 'flex-start' : 'auto',
            },
            backgroundColor: isSoftValueLabel
              ? subjectTheme.softSurface.backgroundColor
              : 'transparent',
            borderRadius: isSoftValueLabel ? 'var(--app-radius-pill)' : 0,
            color:
              valueLabelVariant === 'soft'
                ? subjectTheme.color
                : isHeaderValueLabel
                  ? theme.palette.common.white
                  : subjectTheme.text.color,
            fontSize: valueLabelVariant === 'soft' ? 12 : 14,
            fontWeight: 700,
            maxWidth: '100%',
            minWidth: isSoftValueLabel ? 'fit-content' : 32,
            px: isSoftValueLabel ? 1.25 : 0,
            py: isSoftValueLabel ? 0.375 : 0,
            textAlign: { sm: 'right', xs: isSoftValueLabel ? 'left' : 'right' },
          }}
        >
          {resolvedValueLabel}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default ProgressBar
