import { Box, type BoxProps } from '@mui/material'

function AppPageContainer({ children, className, sx, ...boxProps }: BoxProps) {
  return (
    <Box
      {...boxProps}
      className={['mx-auto grid w-full max-w-315 gap-5', className]
        .filter(Boolean)
        .join(' ')}
      sx={Array.isArray(sx) ? sx : [sx]}
    >
      {children}
    </Box>
  )
}

export default AppPageContainer
