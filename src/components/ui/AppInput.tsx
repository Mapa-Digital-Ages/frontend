import React from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SearchIcon from '@mui/icons-material/Search'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

type InputSize = 'small' | 'medium' | 'large'

type InputType = 'text' | 'password' | 'email' | 'search'

type AppInputProps = Omit<TextFieldProps, 'type' | 'label'> & {
  inputSize?: InputSize
  customSize?: {
    height?: number
    fontSize?: string
    padding?: string
  }
  icon?: React.ReactNode
  type?: InputType
}

export default function AppInput({
  inputSize = 'medium',
  customSize,
  icon,
  className,
  InputProps,
  type = 'text',
  sx,
  ...props
}: AppInputProps) {

  const [showPassword, setShowPassword] = React.useState(false)

  const isPasswordField = type === 'password'

  const inputType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : type

  const muiSize = inputSize === 'small' ? 'small' : 'medium'

  const sizeStyles = {
    '& .MuiOutlinedInput-root': {
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
      default:
        return null
    }
  }

  const startIcon = getDefaultIcon()

  return (
    <TextField
      {...props}
      type={inputType}
      size={muiSize}
      fullWidth
      variant="outlined"
      className={['w-full', className].filter(Boolean).join(' ')}
      InputProps={{
        ...InputProps,
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,

        endAdornment: isPasswordField ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 5,
          backgroundColor: '#F9FAFB',
        },
        ...(sizeStyles as object),
        ...sx,
      }}
    />
  )
}
