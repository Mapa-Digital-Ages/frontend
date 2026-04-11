import Button, {
  type ButtonProps as MuiButtonProps,
} from '@mui/material/Button'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import type { ElementType } from 'react'

type AppButtonProps<C extends ElementType = 'button'> = MuiButtonProps<
  C,
  {
    component?: C
    label?: string
    borderRadius?: string | number
    iconPosition?: 'left' | 'right'
    hasBorder?: boolean
    textColor?: string
    hoverBackgroundColor?: string
    backgroundColor?:
      | 'primary.main'
      | 'secondary.main'
      | 'error.main'
      | 'warning.main'
      | 'info.main'
      | 'success.main'
      | 'background.default'
      | 'background.paper'
  }
>

const hoverBackgroundMap: Record<
  NonNullable<AppButtonProps['backgroundColor']>,
  string
> = {
  'primary.main': 'primary.hover',
  'secondary.main': 'secondary.hover',
  'error.main': 'error.hover',
  'warning.main': 'warning.hover',
  'info.main': 'info.hover',
  'success.main': 'success.hover',
  'background.default': 'background.hover',
  'background.paper': 'background.hover',
}

function AppButton<C extends ElementType = 'button'>({
  className,
  label,
  size = 'medium',
  backgroundColor = 'primary.main',
  borderRadius = 'var(--app-radius-control)',
  iconPosition,
  hasBorder = false,
  textColor = 'primary.contrastText',
  ...props
}: AppButtonProps<C>) {
  const hoverBackground = hoverBackgroundMap[backgroundColor] || backgroundColor

  return (
    <Button
      {...props}
      size={size}
      variant={props.variant ?? 'contained'}
      startIcon={
        iconPosition === 'left' ? (
          <ArrowBackIosIcon sx={{ fontSize: '12px' }} />
        ) : null
      }
      endIcon={
        iconPosition === 'right' ? (
          <ArrowForwardIosIcon sx={{ fontSize: '12px' }} />
        ) : null
      }
      className={['whitespace-nowrap', className].filter(Boolean).join(' ')}
      sx={{
        borderRadius,
        textTransform: 'none',
        transition: '0.2s',
        fontWeight: 500,
        color: textColor,
        backgroundColor: backgroundColor,
        '&:hover': {
          backgroundColor: hoverBackground,
          filter: 'brightness(0.9)',
          borderColor: 'background.hoverBorder',
        },

        padding:
          size === 'small'
            ? '4px 12px'
            : size === 'medium'
              ? '10px 24px'
              : '16px 40px',

        ...(hasBorder && {
          border: '1px solid',
          borderColor: 'background.border',
        }),

        ...props.sx,
      }}
    >
      {label || props.children}
    </Button>
  )
}

export default AppButton
