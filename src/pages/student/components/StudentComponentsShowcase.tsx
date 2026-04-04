import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppCard from '@/components/ui/AppCard'
import { APP_ROUTES } from '@/constants/routes'
import { SUBJECTS } from '@/utils/subjectThemes'
import AppButton from '@/components/ui/AppButton'

function StudentComponentsShowcase() {
  return (
    <Stack spacing={1}>
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: { md: 24, xs: 20 },
          fontWeight: 700,
        }}
      >
        Showcase de Componentes
      </Typography>
      <AppCard contentClassName="p-5 md:p-6">
        <Stack spacing={1}>
          <Typography
            sx={{ color: 'text.primary', fontSize: 18, fontWeight: 600 }}
          >
            Fluxo de onboarding
          </Typography>
        </Stack>

        <Box>
          <AppButton
            component={RouterLink}
            endIcon={<ArrowForwardRoundedIcon />}
            state={{
              initialSubject: SUBJECTS.matematica,
            }}
            to={APP_ROUTES.student.onboardingFlow}
            variant="contained"
            iconPosition="right"
          >
            Abrir fluxo de onboarding
          </AppButton>
        </Box>
      </AppCard>
    </Stack>
  )
}

export default StudentComponentsShowcase
