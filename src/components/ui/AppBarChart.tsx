import { Typography } from '@mui/material'
import React from 'react'

export interface AppBarChartData {
  label: string
  value: number
}

interface AppBarChartProps {
  data: AppBarChartData[]
  height?: number | string
  maxValue?: number
  className?: string
}

export default function AppBarChart({
  data,
  height = 200,
  maxValue,
  className = '',
}: AppBarChartProps) {
  const resolvedMaxValue = maxValue ?? Math.max(...data.map(d => d.value), 1)
  const computedMax = Math.max(resolvedMaxValue, 1)

  return (
    <div
      role="graphics-document"
      aria-label="Gráfico de barras"
      className={[
        'flex items-end justify-between w-full h-full gap-2 sm:gap-3 md:gap-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ height }}
    >
      {data.map((item, index) => {
        const percentage = Math.max(
          0,
          Math.min(100, (item.value / computedMax) * 100)
        )

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex flex-col items-center flex-1 h-full gap-2"
          >
            <div
              className="relative flex-1 w-full flex items-end overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/50"
              title={`${item.label}: ${item.value}`}
            >
              <div
                role="img"
                aria-label={`Barra representando ${item.value} para ${item.label}`}
                className="w-full bg-sky-500 rounded-t-lg transition-all duration-700 ease-out"
                style={{ height: `${percentage}%` }}
              />
            </div>

            <Typography
              color="text.secondary"
              variant="body2"
              noWrap
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                textAlign: 'center',
              }}
            >
              {item.label}
            </Typography>
          </div>
        )
      })}
    </div>
  )
}
