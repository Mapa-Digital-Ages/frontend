import TextField, { type TextFieldProps } from '@mui/material/TextField'

function AppInput(props: TextFieldProps) {
  return <TextField fullWidth size="medium" variant="outlined" {...props} />
}

export default AppInput
