import Button, { type ButtonProps } from '@mui/material/Button'
import type { ElementType } from 'react'

type AppButtonProps<C extends ElementType = 'button'> = ButtonProps<
  C,
  {
    component?: C
  }
>

function AppButton<C extends ElementType = 'button'>(props: AppButtonProps<C>) {
  return <Button variant={props.variant ?? 'contained'} {...props} />
}

export default AppButton
