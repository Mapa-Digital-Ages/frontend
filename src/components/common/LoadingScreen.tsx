import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingScreen() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">Carregando ambiente...</Typography>
    </Box>
  )
}

export default LoadingScreen
