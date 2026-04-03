import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import AppButton from '@/components/ui/AppButton'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { AppSubjectTag } from '@/components/ui/AppSubjectsTags'
import ProgressBar from '@/components/ui/ProgressBar'
import { studentService } from '@/services/student.service'
import { AppColors } from '@/styles/AppColors'
import { getSubjectTheme, SUBJECTS } from '@/utils/subjectThemes'
import type { StudentTask, SummaryMetric } from '@/types/common'
import MetricsCard from '@/components/ui/MetricsCard'

const DISCIPLINE_PROGRESS = [
  {
    id: 'math',
    progress: 72,
    subject: SUBJECTS.matematica,
  },
  {
    id: 'portuguese',
    progress: 85,
    subject: SUBJECTS.portugues,
  },
  {
    id: 'science',
    progress: 58,
    subject: SUBJECTS.ciencias,
  },
  {
    id: 'history',
    progress: 64,
    subject: SUBJECTS.historia,
  },
] as const

function StudentDashboardPage() {
  const theme = useTheme()
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
      iconBackground: 'rgba(219, 234, 254, 1)',
      iconColor: 'rgba(37, 99, 235, 1)',
    },
    {
      id: 'study',
      title: 'Estudo da Semana',
      value: keyMetric ? `${keyMetric.value}` : '340 min',
      helper: keyMetric?.helperText ?? '+12% vs semana anterior',
      icon: <BoltRoundedIcon />,
      iconBackground: 'rgba(224, 242, 254, 1)',
      iconColor: 'rgba(2, 132, 199, 1)',
    },
    {
      id: 'trail',
      title: 'Trilha Completa',
      value: engagementMetric ? `${engagementMetric.value}` : '62%',
      helper: '',
      icon: <TrackChangesRoundedIcon />,
      iconBackground: 'rgba(237, 233, 254, 1)',
      iconColor: 'rgba(124, 58, 237, 1)',
    },
    {
      id: 'streak',
      title: 'Sequência',
      value: '5 dias',
      helper: '',
      icon: <TrendingUpRoundedIcon />,
      iconBackground: 'rgba(220, 252, 231, 1)',
      iconColor: 'rgba(5, 150, 105, 1)',
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
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentClassName="gap-4 p-5"
          title="Progresso por Disciplina"
          titleClassName="text-2xl font-bold md:text-3xl"
        >
          {DISCIPLINE_PROGRESS.map(item => (
            <Box
              key={item.id}
              sx={{
                backgroundColor: 'var(--app-surface-muted)',
                border: '1px solid var(--app-border)',
                borderRadius: '16px',
                p: 1.5,
              }}
            >
              <Box className="mb-2 flex items-center justify-between gap-3">
                <AppSubjectTag size="sm" subject={item.subject} />
              </Box>
              <ProgressBar
                showValueLabel
                subject={item.subject}
                value={item.progress}
              />
            </Box>
          ))}
        </AppCard>

        <AppCard
          contentClassName="gap-4 p-5"
          title="Próximas Atividades"
          titleClassName="text-2xl font-bold md:text-3xl"
        >
          {tasks.map(task => {
            const subjectTheme = getSubjectTheme(task.subject, {
              mode: theme.palette.mode,
            })

            return (
              <Box
                key={task.id}
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'var(--app-surface-muted)',
                  border: '1px solid var(--app-border)',
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 1.5,
                }}
              >
                <Box className="flex items-center gap-3">
                  <Box
                    className="grid size-11 place-items-center rounded-2xl"
                    sx={{
                      backgroundColor: subjectTheme.icon.backgroundColor,
                      color: subjectTheme.icon.color,
                    }}
                  >
                    <AutoAwesomeRoundedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography
                      className="text-base font-semibold md:text-lg"
                      sx={{ color: 'text.primary' }}
                    >
                      {task.title}
                    </Typography>
                    <Box className="mt-1 flex items-center gap-2">
                      <AppSubjectTag size="sm" subject={task.subject} />
                      <Typography
                        className="text-sm"
                        sx={{ color: 'text.secondary' }}
                      >
                        {task.status === 'pending'
                          ? 'Vídeo'
                          : task.status === 'inProgress'
                            ? 'Exercício'
                            : 'Leitura'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <ChevronRightRoundedIcon sx={{ color: 'text.secondary' }} />
              </Box>
            )
          })}
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}

export default StudentDashboardPage
