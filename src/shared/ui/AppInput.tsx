import React from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SearchIcon from '@mui/icons-material/Search'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PersonIcon from '@mui/icons-material/Person'
import { Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

type InputSize = 'small' | 'medium' | 'large'

type InputType = 'text' | 'password' | 'email' | 'search' | 'name' | 'date'

type BackgroundColor = 'background.paper' | 'background.default' | string

type AppInputProps = Omit<TextFieldProps, 'type'> & {
  label?: string
  labelSx?: SxProps<Theme>
  inputSize?: InputSize
  customSize?: {
    height?: number
    fontSize?: string
    padding?: string
  }
  icon?: React.ReactNode
  type?: InputType
  backgroundColor?: BackgroundColor
}

export default function AppInput({
  label,
  labelSx,
  inputSize = 'medium',
  customSize,
  icon,
  id,
  className,
  InputProps,
  type = 'text',
  backgroundColor = 'background.paper',
  error,
  sx,
  ...props
}: AppInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const generatedId = React.useId()
  const inputId = id ?? generatedId

  const isPasswordField = type === 'password'

  const inputType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : type

  const muiSize = inputSize === 'small' ? 'small' : 'medium'

  const sizeStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: backgroundColor,
      ...(inputSize === 'small' && {
        height: 36,
        fontSize: '0.85rem',
      }),

      ...(inputSize === 'medium' && {
        height: 48,
        fontSize: '0.95rem',
      }),

      ...(inputSize === 'large' && {
        height: 56,
        fontSize: '1rem',
      }),

      ...(customSize && {
        height: customSize.height,
        fontSize: customSize.fontSize,
      }),
    },

    ...(customSize?.padding && {
      '& .MuiInputBase-input': {
        padding: customSize.padding,
      },
    }),
  }

  const getDefaultIcon = () => {
    if (icon) return icon

    switch (type) {
      case 'email':
        return <EmailIcon />
      case 'password':
        return <LockIcon />
      case 'search':
        return <SearchIcon />
      case 'name':
        return <PersonIcon />
      default:
        return null
    }
  }

  const startIcon = getDefaultIcon()

  return (
    <Stack spacing={0.5} className={className}>
      {label ? (
        <Typography
          component="label"
          htmlFor={inputId}
          variant="body2"
          sx={[
            { color: error ? 'error.main' : undefined },
            ...(Array.isArray(labelSx) ? labelSx : labelSx ? [labelSx] : []),
          ]}
        >
          {label}
        </Typography>
      ) : null}

      <TextField
        {...props}
        id={inputId}
        error={error}
        type={inputType}
        size={muiSize}
        fullWidth
        variant="outlined"
        InputProps={{
          ...InputProps,
          startAdornment:
            InputProps?.startAdornment ??
            (startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null),
          endAdornment: isPasswordField ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword(prev => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : (
            (InputProps?.endAdornment ?? null)
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'error.main' : 'background.border',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'error.main' : 'background.hoverBorder',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'error.main' : 'primary.main',
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginRight: 0,
            marginTop: '2px',
            lineHeight: 1.2,
          },
          ...(sizeStyles as object),
          ...sx,
        }}
      />
    </Stack>
  )
}
