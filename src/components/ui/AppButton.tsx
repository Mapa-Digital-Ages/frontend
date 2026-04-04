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
    color?:
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'info'
      | 'warning'
  }
>

function AppButton<C extends ElementType = 'button'>({
  className,
  label,
  size = 'medium',
  color = 'primary',
  borderRadius = '12px',
  iconPosition,
  hasBorder = false,
  ...props
}: AppButtonProps<C>) {
  return (
    <Button
      {...props}
      size={size}
      color={color}
      variant={hasBorder ? 'outlined' : (props.variant ?? 'contained')}
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
        borderRadius: borderRadius,
        textTransform: 'none',
        transition: '0.2s',
        fontWeight: 500,

        padding:
          size === 'small'
            ? '4px 12px'
            : size === 'medium'
              ? '10px 24px'
              : '16px 40px',

        ...(hasBorder && {
          borderColor: 'divider',
          color: 'text.secondary',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'transparent',
            filter: 'brightness(0.95)',
          },
        }),

        ...props.sx,
      }}
    >
      {label || props.children}
    </Button>
  )
}

export default AppButton
