import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

interface UnderDevelopmentPageProps {
  title: string
  subtitle?: string
}

export default function UnderDevelopmentPage({
  title,
  subtitle = 'Esta funcionalidade está sendo desenvolvida e estará disponível em breve.',
}: UnderDevelopmentPageProps) {
  return (
    <AppPageContainer
      data-testid="under-development-page"
      className="gap-4 md:gap-5"
    >
      <PageHeader
        variant="enterpriseSchool"
        title={title}
        subtitle={subtitle}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          minHeight: 280,
          py: 6,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'background.hover',
            borderRadius: '50%',
            display: 'flex',
            height: 72,
            justifyContent: 'center',
            width: 72,
          }}
        >
          <ConstructionRoundedIcon
            sx={{ color: 'text.secondary', fontSize: 36 }}
          />
        </Box>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: 20,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Em desenvolvimento
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: 15,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          Esta página ainda está sendo construída. Volte em breve para conferir
          as novidades!
        </Typography>
      </Box>
    </AppPageContainer>
  )
}
