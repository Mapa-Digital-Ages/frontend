import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingScreen() {
  return (
    <Box className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
      <CircularProgress />
      <Typography color="text.secondary">Carregando ambiente...</Typography>
    </Box>
  )
}

export default LoadingScreen
