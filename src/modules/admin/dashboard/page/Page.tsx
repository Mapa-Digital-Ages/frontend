import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { adminService } from '../services/service'
import type { IconVariantName } from '@/app/theme/core/palette'
import type { Stat } from '@/shared/types/common'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AppCard from '@/shared/ui/AppCard'

const RECENT_ACTIVITY = [
  {
    id: 'activity-1',
    title: '120 novos acessos de alunos registrados',
    tone: 'blue' as const,
    time: 'há 2h',
  },
  {
    id: 'activity-2',
    title: 'Política de acesso atualizada por administrador',
    tone: 'purple' as const,
    time: 'há 4h',
  },
  {
    id: 'activity-3',
    title: '12 alertas críticos aguardando revisão',
    tone: 'orange' as const,
    time: 'há 5h',
  },
  {
    id: 'activity-4',
    title: 'Publicação de conteúdo aprovada',
    tone: 'green' as const,
    time: 'há 6h',
  },
]

export default function Page() {
  const theme = useTheme()
  const [stats, setStats] = useState<Stat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const nextStats = await adminService.getStats()

      if (!isActive) {
        return
      }

      setStats(nextStats)
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

  const getStatById = (id: Stat['id']) => stats.find(stat => stat.id === id)

  const studentsCountStat = getStatById('students-count')
  const companiesCountStat = getStatById('companies-count')
  const schoolsCountStat = getStatById('schools-count')
  const pendingGuardiansStat = getStatById('pending-guardians')

  const cards = [
    {
      helper: studentsCountStat?.description ?? 'total de alunos cadastrados',
      helperColor: theme.palette.text.secondary,
      icon: <GroupsRoundedIcon />,
      iconVariant: 'blue' as IconVariantName,
      id: 'students-count',
      title: 'Alunos Cadastrados',
      value: studentsCountStat?.value ?? '—',
    },
    {
      helper: companiesCountStat?.description ?? 'empresas cadastradas',
      helperColor: theme.palette.text.secondary,
      icon: <BusinessRoundedIcon />,
      iconVariant: 'purple' as IconVariantName,
      id: 'companies-count',
      title: 'Empresas',
      value: companiesCountStat?.value ?? '—',
    },
    {
      helper: schoolsCountStat?.description ?? 'escolas cadastradas',
      helperColor: theme.palette.text.secondary,
      icon: <SchoolRoundedIcon />,
      iconVariant: 'green' as IconVariantName,
      id: 'schools-count',
      title: 'Escolas',
      value: schoolsCountStat?.value ?? '—',
    },
    {
      helper:
        pendingGuardiansStat?.description ??
        'responsáveis aguardando aprovação',
      helperColor: theme.palette.warning.main,
      icon: <NotificationsActiveRoundedIcon />,
      iconVariant: 'orange' as IconVariantName,
      id: 'pending-guardians',
      title: 'Responsáveis Pendentes',
      value: pendingGuardiansStat?.value ?? '—',
    },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Painel Administrativo"
        subtitle="Visão consolidada da operação MAPA DIGITAL"
        variant="admin"
      />

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentClassName="gap-4 p-5"
          title="Atividade Recente"
          titleClassName="text-2xl font-bold md:text-3xl"
        >
          {RECENT_ACTIVITY.map(activity => {
            const variant = theme.palette.iconVariants[activity.tone]

            return (
              <Box className="flex items-start gap-3" key={activity.id}>
                <Box
                  className="mt-1 grid size-7 place-items-center rounded-full"
                  sx={{
                    backgroundColor: variant.background,
                    color: variant.color,
                  }}
                >
                  <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
                </Box>
                <Box className="min-w-0">
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontSize: { md: 18, xs: 16 },
                    }}
                  >
                    {activity.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 14,
                    }}
                  >
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}
