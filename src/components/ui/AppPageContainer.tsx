import { Box, type BoxProps } from '@mui/material'

function AppPageContainer({ children, sx, ...boxProps }: BoxProps) {
  return (
    <Box
      {...boxProps}
      sx={[
        { display: 'grid', gap: 3, width: '100%' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  )
}

export default AppPageContainer
