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
import type { IconVariantName } from '@/app/theme/core/palette'

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
        borderRadius: '18px',
        boxShadow: 'none',
        minHeight: 104,
        overflow: 'hidden',
        ...cardProps.sx,
      }}
    >
      <CardContent
        className={contentClassName}
        sx={[
          {
            height: '100%',
            p: { xs: 2, md: 2.25 },
            '&:last-child': {
              pb: { xs: 2, md: 2.25 },
            },
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            gap: 2,
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            {title ? (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: 11, md: 12 },
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                  mb: 1.25,
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Typography>
            ) : null}

            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { xs: 26, md: 28 },
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>

            {warningText ? (
              <Typography
                sx={{
                  color: warningColor ?? 'success.main',
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  mt: 1,
                }}
              >
                {warningText}
              </Typography>
            ) : null}
          </Box>

          {icon ? (
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: iconToken?.background,
                borderRadius: '12px',
                color: iconToken?.color,
                display: 'flex',
                flexShrink: 0,
                height: 40,
                justifyContent: 'center',
                width: 40,
              }}
            >
              {icon}
            </Box>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricsCard
