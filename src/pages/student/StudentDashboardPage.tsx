import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import AppButton from '@/components/ui/AppButton'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { studentService } from '@/services/student.service'
import { AppColors } from '@/styles/AppColors'
import type { StudentTask, SummaryMetric } from '@/types/common'

const DISCIPLINE_PROGRESS = [
  { id: 'math', label: 'Matemática', progress: 72, tone: 'bg-blue-500' },
  { id: 'portuguese', label: 'Português', progress: 85, tone: 'bg-violet-500' },
  { id: 'science', label: 'Ciências', progress: 58, tone: 'bg-emerald-500' },
  { id: 'history', label: 'História', progress: 64, tone: 'bg-amber-500' },
] as const

const TASK_SUBJECT_STYLES: Record<
  string,
  { badge: string; iconContainer: string }
> = {
  Matemática: {
    badge: 'bg-blue-100 text-blue-700',
    iconContainer: 'bg-blue-100 text-blue-600',
  },
  Português: {
    badge: 'bg-violet-100 text-violet-700',
    iconContainer: 'bg-violet-100 text-violet-600',
  },
  Ciências: {
    badge: 'bg-emerald-100 text-emerald-700',
    iconContainer: 'bg-emerald-100 text-emerald-600',
  },
}

function StudentDashboardPage() {
  const [summary, setSummary] = useState<SummaryMetric[]>([])
  const [tasks, setTasks] = useState<StudentTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextSummary, nextTasks] = await Promise.all([
        studentService.getSummary(),
        studentService.getTasks(),
      ])

      if (!isActive) {
        return
      }

      setSummary(nextSummary)
      setTasks(nextTasks.slice(0, 3))
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

  const keyMetric = summary[0]
  const engagementMetric = summary[1]
  const cards = [
    {
      id: 'level',
      title: 'Nível Atual',
      value: '7º Ano',
      helper: '',
      icon: <WorkspacePremiumRoundedIcon />,
      iconTone: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'study',
      title: 'Estudo da Semana',
      value: keyMetric ? `${keyMetric.value}` : '340 min',
      helper: keyMetric?.helperText ?? '+12% vs semana anterior',
      icon: <BoltRoundedIcon />,
      iconTone: 'bg-sky-100 text-sky-600',
    },
    {
      id: 'trail',
      title: 'Trilha Completa',
      value: engagementMetric ? `${engagementMetric.value}` : '62%',
      helper: '',
      icon: <TrackChangesRoundedIcon />,
      iconTone: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'streak',
      title: 'Sequência',
      value: '5 dias',
      helper: '',
      icon: <TrendingUpRoundedIcon />,
      iconTone: 'bg-emerald-100 text-emerald-600',
    },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Box
        className="flex flex-col gap-4 rounded-3xl px-4 py-5 text-white shadow-[0_16px_34px_rgba(29,78,216,0.26)] md:flex-row md:items-center md:justify-between md:px-6 md:py-6"
        style={{ background: AppColors.roleGradient('student') }}
      >
        <Box>
          <Box className="flex items-center gap-2 text-white/90">
            <PersonRoundedIcon fontSize="small" />
            <Typography className="text-base md:text-lg">Olá, Lucas</Typography>
          </Box>
          <Typography className="mt-1 text-2xl font-bold leading-tight md:text-4xl">
            Continue sua jornada
          </Typography>
          <Typography className="mt-2 text-sm text-white/90 md:text-lg">
            Você tem {tasks.length} atividades pendentes na sua trilha
          </Typography>
        </Box>
        <AppButton
          className="rounded-2xl border-none bg-white/20 px-4 text-white hover:bg-white/30 md:px-5"
          startIcon={<NearMeRoundedIcon />}
          variant="contained"
        >
          Ir para Trilha
        </AppButton>
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
            {card.helper && (
              <Typography className="text-base text-emerald-600">
                {card.helper}
              </Typography>
            )}
          </AppCard>
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentClassName="gap-4 p-5"
          title="Progresso por Disciplina"
          titleTypographyProps={{
            className: 'text-2xl font-bold text-slate-900 md:text-3xl',
          }}
        >
          {DISCIPLINE_PROGRESS.map(item => (
            <Box
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
              key={item.id}
            >
              <Box className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-semibold text-slate-700 shadow-sm">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {item.progress}%
                </span>
              </Box>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className={['h-full rounded-full', item.tone].join(' ')}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </Box>
          ))}
        </AppCard>

        <AppCard
          contentClassName="gap-4 p-5"
          title="Próximas Atividades"
          titleTypographyProps={{
            className: 'text-2xl font-bold text-slate-900 md:text-3xl',
          }}
        >
          {tasks.map(task => {
            const taskStyles =
              TASK_SUBJECT_STYLES[task.subject] ??
              TASK_SUBJECT_STYLES.Matemática

            return (
              <Box
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
                key={task.id}
              >
                <Box className="flex items-center gap-3">
                  <Box
                    className={[
                      'grid size-11 place-items-center rounded-2xl',
                      taskStyles.iconContainer,
                    ].join(' ')}
                  >
                    <AutoAwesomeRoundedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography className="text-base font-semibold text-slate-900 md:text-lg">
                      {task.title}
                    </Typography>
                    <Box className="mt-1 flex items-center gap-2">
                      <span
                        className={[
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          taskStyles.badge,
                        ].join(' ')}
                      >
                        {task.subject}
                      </span>
                      <Typography className="text-sm text-slate-500">
                        {task.status === 'pending'
                          ? 'Vídeo'
                          : task.status === 'inProgress'
                            ? 'Exercício'
                            : 'Leitura'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <ChevronRightRoundedIcon className="text-slate-400" />
              </Box>
            )
          })}
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}

export default StudentDashboardPage
