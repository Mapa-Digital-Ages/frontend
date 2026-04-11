import {
  Box,
  Card,
  CardContent,
  Typography,
  type CardProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import type { IconVariantName } from '@/styles/palette'

interface MetricsCardProps extends CardProps {
  contentClassName?: string
  contentSx?: SxProps<Theme>
  title?: string
  icon?: ReactNode
  iconVariant?: IconVariantName
  value?: string | number
  warningText?: string
  warningColor?: string
}

function MetricsCard({
  className,
  contentClassName,
  contentSx,
  title,
  icon,
  iconVariant,
  value,
  warningText,
  warningColor,
  ...cardProps
}: MetricsCardProps) {
  const theme = useTheme()
  const iconToken = iconVariant
    ? theme.palette.iconVariants[iconVariant]
    : undefined

  return (
    <Card
      {...cardProps}
      className={className}
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: '12px',
        boxShadow: 'none',
        ...cardProps.sx,
      }}
    >
      <CardContent
        className={['h-full p-8 md:p-8', contentClassName]
          .filter(Boolean)
          .join(' ')}
        sx={[{}, ...(Array.isArray(contentSx) ? contentSx : [contentSx])]}
      >
        <Box className="flex h-full items-start justify-between gap-6 min-h-[92px]">
          <Box className="flex min-h-full flex-1 flex-col justify-start">
            <Typography
              className="text-lg md:text-[22px]"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                lineHeight: 1.25,
                mb: 2,
              }}
            >
              {title}
            </Typography>
            <Typography
              className="text-3xl font-bold md:text-[2.5rem]"
              sx={{
                color: 'text.primary',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                mb: 1.5,
              }}
            >
              {value}
            </Typography>
            {warningText ? (
              <Typography
                className="text-sm md:text-base"
                sx={{
                  color: warningColor ?? 'success.main',
                  fontWeight: 500,
                  lineHeight: 1.25,
                  fontSize: 14,
                }}
              >
                {warningText}
              </Typography>
            ) : null}
          </Box>
          <Box
            className="grid size-11 place-items-center"
            style={{ borderRadius: '12px' }}
            sx={{
              backgroundColor: iconToken?.background,
              color: iconToken?.color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricsCard
