import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import React from 'react'

export interface BarChartData {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartData[]
  height?: number | string
  maxValue?: number
  className?: string
}

export default function BarChart({
  data,
  height = 200,
  maxValue,
  className = '',
}: BarChartProps) {
  const theme = useTheme()
  const dataMax = Math.max(...data.map(d => d.value), 0)
  const resolvedMaxValue = maxValue ?? dataMax
  const effectiveMax =
    maxValue !== undefined
      ? Math.max(maxValue, 0)
      : Math.max(resolvedMaxValue, 1)
  const barTrackBackground =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.08)
      : alpha(theme.palette.text.primary, 0.08)

  return (
    <Box className={className} sx={{ height }}>
      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: { sm: 1, xs: 0.75 },
          gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))`,
          height: '100%',
        }}
      >
        {data.map(item => {
          const barHeightPercent =
            effectiveMax <= 0
              ? 0
              : Math.max(0, Math.min(100, (item.value / effectiveMax) * 100))

          return (
            <Box
              key={item.label}
              sx={{
                alignItems: 'center',
                display: 'grid',
                gap: 0.75,
                gridTemplateRows: 'minmax(0, 1fr) auto',
                height: '100%',
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  alignItems: 'flex-end',
                  backgroundColor: barTrackBackground,
                  borderRadius: '8px',
                  display: 'flex',
                  height: '100%',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <Box
                  aria-label={`${item.label}: ${item.value}`}
                  role="img"
                  sx={{
                    backgroundColor: 'primary.main',
                    borderRadius: '8px 8px 0 0',
                    height: `${barHeightPercent}%`,
                    minHeight: item.value === 0 ? 2 : 4,
                    transition:
                      'height 180ms ease, background-color 180ms ease',
                    width: '100%',
                  }}
                />
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: 18,
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
