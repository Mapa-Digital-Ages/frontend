import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { adminService } from '../services/service'
import type { IconVariantName } from '@/app/theme/core/palette'
import type { AdminStat } from '@/shared/types/common'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'

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

const QUICK_ACTIONS = [
  'Revisar alertas críticos',
  'Publicar conteúdos em fila',
  'Ajustar permissões de acesso',
  'Atualizar parâmetros da IA',
]

export default function Page() {
  const theme = useTheme()
  const [stats, setStats] = useState<AdminStat[]>([])
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

  const getStatById = (id: AdminStat['id']) =>
    stats.find(stat => stat.id === id)

  const usersActiveStat = getStatById('users-active')
  const criticalAlertsStat = getStatById('critical-alerts')
  const pendingActionsStat = getStatById('pending-actions')
  const uptimeStat = getStatById('uptime')

  const cards = [
    {
      helper: usersActiveStat?.description ?? 'últimas 24h',
      helperColor: theme.palette.text.secondary,
      icon: <GroupsRoundedIcon />,
      iconVariant: 'blue' as IconVariantName,
      id: 'users-active',
      title: 'Usuários Ativos',
      value: usersActiveStat?.value ?? '1.248',
    },
    {
      helper: criticalAlertsStat?.description ?? 'monitoramento em tempo real',
      helperColor: theme.palette.error.main,
      icon: <NotificationsActiveRoundedIcon />,
      iconVariant: 'red' as IconVariantName,
      id: 'critical-alerts',
      title: 'Alertas Críticos',
      value: criticalAlertsStat?.value ?? '12',
    },
    {
      helper: pendingActionsStat?.description ?? 'fila de revisão',
      helperColor: theme.palette.text.secondary,
      icon: <PlaylistAddCheckRoundedIcon />,
      iconVariant: 'orange' as IconVariantName,
      id: 'pending-actions',
      title: 'Ações Pendentes',
      value: pendingActionsStat?.value ?? '34',
    },
    {
      helper: uptimeStat?.description ?? 'últimos 30 dias',
      helperColor: theme.palette.success.main,
      icon: <InsightsRoundedIcon />,
      iconVariant: 'green' as IconVariantName,
      id: 'uptime',
      title: 'Disponibilidade',
      value: uptimeStat?.value ?? '99,9%',
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

        <AppCard
          contentClassName="gap-3 p-5"
          title="Ações rápidas"
          titleClassName="text-2xl font-bold md:text-3xl"
        >
          {QUICK_ACTIONS.map(action => (
            <Box
              className="flex items-center justify-between rounded-2xl px-3 py-3"
              key={action}
              sx={{
                backgroundColor: alpha(theme.palette.background.hover, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              }}
            >
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { md: 18, xs: 16 },
                  fontWeight: 600,
                }}
              >
                {action}
              </Typography>
              <ChevronRightRoundedIcon sx={{ color: 'text.secondary' }} />
            </Box>
          ))}
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}
