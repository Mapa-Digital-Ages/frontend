import { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import ProgressBar from '@/shared/ui/ProgressBar'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import { dashboardService } from '../services/service'
import type { DashboardIndicator, ClassCard } from '../types/types'

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [indicators, setIndicators] = useState<DashboardIndicator[]>([])
  const [classes, setClasses] = useState<ClassCard[]>([])

  useEffect(() => {
    let isActive = true

    async function load() {
      const [indicatorData, classData] = await Promise.all([
        Promise.resolve(dashboardService.getIndicators()),
        Promise.resolve(dashboardService.getClasses()),
      ])

      if (isActive) {
        setIndicators(indicatorData)
        setClasses(classData)
        setIsLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer
      data-testid="sc-dashboard-page"
      className="gap-4 md:gap-5"
    >
      <PageHeader
        variant="enterpriseSchool"
        title={dashboardService.getTitle()}
        subtitle={dashboardService.getSubtitle()}
      />

      {/* Indicator Cards */}
      <Grid container spacing={2} data-testid="sc-dashboard-indicators">
        {indicators.map((indicator, index) => (
          <Grid key={indicator.id} size={{ xs: 6, md: 3 }}>
            <MetricsCard
              data-testid={`sc-indicator-card-${index}`}
              title={indicator.title}
              value={String(indicator.value)}
              icon={indicator.icon}
              iconVariant={indicator.iconVariant}
              warningText={indicator.helperText}
              warningColor="success.main"
              sx={{
                height: '100%',
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Class Cards */}
      <Grid container spacing={2} data-testid="sc-dashboard-classes">
        {classes.map(classItem => (
          <Grid key={classItem.id} size={{ xs: 12, md: 6 }}>
            <Box
              data-testid={`sc-class-card-${classItem.id}`}
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '18px',
                cursor: 'pointer',
                p: { xs: 2, md: 2.5 },
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'background.hoverBorder',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Box
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontSize: { xs: 20, md: 22 },
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {classItem.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 13,
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  >
                    {classItem.students} alunos · Tutor: {classItem.tutor}
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: 24,
                    mt: 0.5,
                  }}
                />
              </Box>

              <Box data-testid={`sc-class-progress-${classItem.id}`}>
                <ProgressBar
                  label="Progresso da trilha"
                  value={classItem.progress}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </AppPageContainer>
  )
}
