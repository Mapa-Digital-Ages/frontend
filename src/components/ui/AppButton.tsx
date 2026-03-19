import Button, { type ButtonProps } from '@mui/material/Button'
import type { ElementType } from 'react'

type AppButtonProps<C extends ElementType = 'button'> = ButtonProps<
  C,
  {
    component?: C
  }
>

function AppButton<C extends ElementType = 'button'>({
  className,
  ...props
}: AppButtonProps<C>) {
  return (
    <Button
      {...props}
      className={['whitespace-nowrap', className].filter(Boolean).join(' ')}
      variant={props.variant ?? 'contained'}
    />
  )
}

export default AppButton
