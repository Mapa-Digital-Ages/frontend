import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

interface ContentBannerProps {
  description?: string
  eyebrow?: string
  title?: string
}

export default function ContentBanner({
  description = 'Cada trilha segue com progresso separado, então o aluno pode ampliar o estudo por matéria conforme avança.',
  eyebrow = 'Explore novas trilhas',
  title = 'Abra outras jornadas sem pausar as atuais',
}: ContentBannerProps) {
  const theme = useTheme()
  const successColor = theme.palette.success.main

  return (
    <Box
      data-testid="contents-banner"
      sx={{
        backgroundColor: alpha(successColor, 0.08),
        border: '1px solid',
        borderColor: alpha(successColor, 0.24),
        borderRadius: '16px',
        display: 'grid',
        gap: 0.5,
        p: { sm: 2.5, xs: 2 },
      }}
    >
      <Typography sx={{ color: successColor, fontSize: 13, fontWeight: 700 }}>
        {eyebrow}
      </Typography>
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: { sm: 18, xs: 16 },
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
        {description}
      </Typography>
    </Box>
  )
}
