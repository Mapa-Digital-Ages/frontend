import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { adminService } from '@/services/admin.service'
import { AppColors } from '@/styles/AppColors'
import type { AdminStat } from '@/types/common'

const RECENT_ACTIVITY = [
  {
    id: 'activity-1',
    tone: 'bg-blue-100 text-blue-600',
    title: '120 novos acessos de alunos registrados',
    time: 'há 2h',
  },
  {
    id: 'activity-2',
    tone: 'bg-violet-100 text-violet-600',
    title: 'Política de acesso atualizada por administrador',
    time: 'há 4h',
  },
  {
    id: 'activity-3',
    tone: 'bg-amber-100 text-amber-600',
    title: '12 alertas críticos aguardando revisão',
    time: 'há 5h',
  },
  {
    id: 'activity-4',
    tone: 'bg-emerald-100 text-emerald-600',
    title: 'Publicação de conteúdo aprovada',
    time: 'há 6h',
  },
]

const QUICK_ACTIONS = [
  'Revisar alertas críticos',
  'Publicar conteúdos em fila',
  'Ajustar permissões de acesso',
  'Atualizar parâmetros da IA',
]

function AdminDashboardPage() {
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
      id: 'users-active',
      title: 'Usuários Ativos',
      value: usersActiveStat?.value ?? '1.248',
      helper: usersActiveStat?.description ?? 'últimas 24h',
      icon: <GroupsRoundedIcon />,
      iconTone: 'bg-blue-100 text-blue-600',
      helperTone: 'text-slate-500',
    },
    {
      id: 'critical-alerts',
      title: 'Alertas Críticos',
      value: criticalAlertsStat?.value ?? '12',
      helper: criticalAlertsStat?.description ?? 'monitoramento em tempo real',
      icon: <NotificationsActiveRoundedIcon />,
      iconTone: 'bg-rose-100 text-rose-600',
      helperTone: 'text-rose-600',
    },
    {
      id: 'pending-actions',
      title: 'Ações Pendentes',
      value: pendingActionsStat?.value ?? '34',
      helper: pendingActionsStat?.description ?? 'fila de revisão',
      icon: <PlaylistAddCheckRoundedIcon />,
      iconTone: 'bg-amber-100 text-amber-600',
      helperTone: 'text-slate-500',
    },
    {
      id: 'uptime',
      title: 'Disponibilidade',
      value: uptimeStat?.value ?? '99,9%',
      helper: uptimeStat?.description ?? 'últimos 30 dias',
      icon: <InsightsRoundedIcon />,
      iconTone: 'bg-emerald-100 text-emerald-600',
      helperTone: 'text-emerald-600',
    },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Box
        className="rounded-3xl px-4 py-5 text-white shadow-[0_16px_34px_rgba(190,24,93,0.26)] md:px-6 md:py-6"
        style={{ background: AppColors.roleGradient('admin') }}
      >
        <Typography className="text-3xl font-bold leading-tight md:text-5xl">
          Painel Administrativo
        </Typography>
        <Typography className="mt-2 text-lg text-white/90">
          Visão consolidada da operação MAPA DIGITAL
        </Typography>
      </Box>

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {cards.map(card => (
          <AppCard contentClassName="gap-1.5 p-5" key={card.id}>
            <Box className="flex items-start justify-between gap-3">
              <Typography className="text-lg text-slate-500">
                {card.title}
              </Typography>
              <Box
                className={[
                  'grid size-11 place-items-center rounded-2xl',
                  card.iconTone,
                ].join(' ')}
              >
                {card.icon}
              </Box>
            </Box>
            <Typography className="text-3xl font-bold text-slate-900 md:text-5xl">
              {card.value}
            </Typography>
            <Typography className={['text-base', card.helperTone].join(' ')}>
              {card.helper}
            </Typography>
          </AppCard>
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentClassName="gap-4 p-5"
          title="Atividade Recente"
          titleTypographyProps={{
            className: 'text-2xl font-bold text-slate-900 md:text-3xl',
          }}
        >
          {RECENT_ACTIVITY.map(activity => (
            <Box className="flex items-start gap-3" key={activity.id}>
              <Box
                className={[
                  'mt-1 grid size-7 place-items-center rounded-full',
                  activity.tone,
                ].join(' ')}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box className="min-w-0">
                <Typography className="text-base text-slate-900 md:text-lg">
                  {activity.title}
                </Typography>
                <Typography className="text-sm text-slate-500">
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </AppCard>

        <AppCard
          contentClassName="gap-3 p-5"
          title="Ações rápidas"
          titleTypographyProps={{
            className: 'text-2xl font-bold text-slate-900 md:text-3xl',
          }}
        >
          {QUICK_ACTIONS.map(action => (
            <Box
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
              key={action}
            >
              <Typography className="text-base font-medium text-slate-900 md:text-lg">
                {action}
              </Typography>
              <ChevronRightRoundedIcon className="text-slate-400" />
            </Box>
          ))}
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}

export default AdminDashboardPage
