import React from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from 'node_modules/@mui/material/esm/IconButton/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

type InputSize = 'small' | 'medium' | 'large'

type AppInputProps = TextFieldProps & {
  inputSize?: InputSize
  customHeight?: number
  icon?: React.ReactNode
}

export default function AppInput({
  inputSize = 'medium',
  customHeight,
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

      ...(customHeight && {
        height: customHeight,
      }),
    }, 
}

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
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
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
      }}
    />
  )
}
