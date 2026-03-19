import TextField, { type TextFieldProps } from '@mui/material/TextField'

function AppInput({ className, ...props }: TextFieldProps) {
  return (
    <TextField
      {...props}
      className={['w-full', className].filter(Boolean).join(' ')}
      fullWidth
      size="medium"
      variant="outlined"
    />
  )
}

export default AppInput
