import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import { companyDashboardService } from '../services/service'
import type { CompanyStat } from '@/shared/types/common'
import type { IconVariantName } from '@/app/theme/core/palette'
import type { SupportedSchool, SupportRequest } from '../types/types'

const STATUS_MAP: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  aguardando: {
    label: 'Aguardando Retorno',
    color: '#e65100',
    bgColor: '#fff3e0',
  },
  apoiada: {
    label: 'Apoiada',
    color: '#1b5e20',
    bgColor: '#e8f5e9',
  },
  recusada: {
    label: 'Recusada',
    color: '#b71c1c',
    bgColor: '#ffebee',
  },
}

export default function Page() {
  const theme = useTheme()
  const [stats, setStats] = useState<CompanyStat[]>([])
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([])
  const [supportedSchools, setSupportedSchools] = useState<SupportedSchool[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextStats, nextRequests, nextSchools] = await Promise.all([
        companyDashboardService.getStats(),
        companyDashboardService.getSupportRequests(),
        companyDashboardService.getSupportedSchools(),
      ])

      if (!isActive) {
        return
      }

      setStats(nextStats)
      setSupportRequests(nextRequests)
      setSupportedSchools(nextSchools)
      setIsLoading(false)
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  const getStatById = (id: CompanyStat['id']) =>
    stats.find(stat => stat.id === id)

  const schoolsStat = getStatById('supported-schools')
  const studentsStat = getStatById('impacted-students')

  const cards = [
    {
      icon: <AccountBalanceRoundedIcon />,
      iconVariant: 'purple' as IconVariantName,
      id: 'supported-schools',
      title: 'Escolas Apoiadas',
      value: schoolsStat?.value ?? '0',
    },
    {
      icon: <LinkRoundedIcon />,
      iconVariant: 'blue' as IconVariantName,
      id: 'impacted-students',
      title: 'Alunos Impactados',
      value: studentsStat?.value ?? '0',
    },
  ]

  return (
    <AppPageContainer
      className="gap-4 md:gap-5"
      data-testid="company-dashboard"
    >
      <PageHeader
        title={companyDashboardService.getTitle()}
        subtitle="Acompanhe indicadores de resultado e investimento social"
        variant="company"
      />

      <Box
        className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
        data-testid="metrics-section"
      >
        {cards.map(card => (
          <MetricsCard
            contentClassName="p-5"
            data-testid={`metric-card-${card.id}`}
            key={card.id}
            {...card}
          />
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentClassName="gap-3 p-5"
          data-testid="support-requests-section"
          title="Solicitações de Apoio"
          titleClassName="text-2xl font-bold md:text-3xl"
          action={
            <Chip
              label={supportRequests.length}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: 14,
                height: 28,
                minWidth: 28,
              }}
            />
          }
        >
          {supportRequests.map(request => (
            <Box
              className="flex items-center justify-between rounded-2xl px-4 py-3"
              data-testid={`support-request-${request.id}`}
              key={request.id}
              sx={{
                backgroundColor: alpha(theme.palette.background.hover, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              }}
            >
              <Box className="min-w-0 flex-1">
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: 18, xs: 16 },
                    fontWeight: 600,
                  }}
                >
                  {request.schoolName}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                  }}
                >
                  {request.description}
                </Typography>
                <Chip
                  label={STATUS_MAP[request.status]?.label ?? request.status}
                  size="small"
                  sx={{
                    backgroundColor:
                      STATUS_MAP[request.status]?.bgColor ?? '#f5f5f5',
                    color: STATUS_MAP[request.status]?.color ?? '#616161',
                    fontSize: 12,
                    fontWeight: 600,
                    height: 24,
                    mt: 0.5,
                  }}
                />
              </Box>
              <Box className="flex items-center gap-1 shrink-0 ml-2">
                <IconButton
                  aria-label="Aprovar solicitação"
                  data-testid={`approve-request-${request.id}`}
                  size="small"
                  sx={{ color: theme.palette.success.main }}
                >
                  <CheckCircleOutlineRoundedIcon />
                </IconButton>
                <IconButton
                  aria-label="Recusar solicitação"
                  data-testid={`reject-request-${request.id}`}
                  size="small"
                  sx={{ color: theme.palette.error.main }}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </AppCard>

        <AppCard
          contentClassName="gap-3 p-5"
          data-testid="supported-schools-section"
          title="Escolas Apoiadas"
          titleClassName="text-2xl font-bold md:text-3xl"
          action={
            <Chip
              label={supportedSchools.length}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 700,
                fontSize: 14,
                height: 28,
                minWidth: 28,
              }}
            />
          }
        >
          {supportedSchools.map(school => (
            <Box
              className="flex items-center justify-between rounded-2xl px-4 py-3"
              data-testid={`supported-school-${school.id}`}
              key={school.id}
              sx={{
                backgroundColor: alpha(theme.palette.background.hover, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              }}
            >
              <Box className="min-w-0 flex-1">
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: 18, xs: 16 },
                    fontWeight: 600,
                  }}
                >
                  {school.schoolName}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                  }}
                >
                  {school.description}
                </Typography>
                <Chip
                  label={STATUS_MAP[school.status]?.label ?? school.status}
                  size="small"
                  sx={{
                    backgroundColor:
                      STATUS_MAP[school.status]?.bgColor ?? '#f5f5f5',
                    color: STATUS_MAP[school.status]?.color ?? '#616161',
                    fontSize: 12,
                    fontWeight: 600,
                    height: 24,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>
          ))}
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}
