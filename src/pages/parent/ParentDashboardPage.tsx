import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentNeutralOutlinedIcon from '@mui/icons-material/SentimentNeutralOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { parentService } from '@/services/parent.service'
import { AppColors } from '@/styles/AppColors'
import type { ParentChild, SummaryMetric } from '@/types/common'
import ParentStatusModal from './components/ParentStatusModal'
import { shouldOpenParentStatusModal } from './components/parentStatusModal.utils'

const DISCIPLINE_PERFORMANCE = [
  {
    id: 'math',
    label: 'Matemática',
    grade: '7.5',
    progress: 72,
    tone: 'bg-blue-500',
  },
  {
    id: 'portuguese',
    label: 'Português',
    grade: '8.2',
    progress: 85,
    tone: 'bg-violet-500',
  },
  {
    id: 'science',
    label: 'Ciências',
    grade: '6.8',
    progress: 58,
    tone: 'bg-emerald-500',
  },
  {
    id: 'history',
    label: 'História',
    grade: '7.0',
    progress: 64,
    tone: 'bg-amber-500',
  },
] as const

const WEEKLY_MOOD = [
  {
    day: 'Seg',
    icon: <SentimentSatisfiedOutlinedIcon />,
    tone: 'text-emerald-600',
  },
  {
    day: 'Ter',
    icon: <SentimentSatisfiedOutlinedIcon />,
    tone: 'text-emerald-600',
  },
  {
    day: 'Qua',
    icon: <SentimentNeutralOutlinedIcon />,
    tone: 'text-amber-500',
  },
  {
    day: 'Qui',
    icon: <SentimentDissatisfiedOutlinedIcon />,
    tone: 'text-rose-500',
  },
  {
    day: 'Sex',
    icon: <SentimentSatisfiedOutlinedIcon />,
    tone: 'text-emerald-600',
  },
]

function ParentDashboardPage() {
  const [summary, setSummary] = useState<SummaryMetric[]>([])
  const [children, setChildren] = useState<ParentChild[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextSummary, nextChildren, nextStatus] = await Promise.all([
        parentService.getSummary(),
        parentService.getChildren(),
        parentService.getStatus(),
      ])

      if (!isActive) {
        return
      }

      setSummary(nextSummary)
      setChildren(nextChildren)
      setStatus(nextStatus)
      setIsLoading(false)

      if (shouldOpenParentStatusModal(nextStatus)) {
        setIsModalOpen(true)
      }
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  const highlightedChild = children[0]
  const attendanceMetric = summary[0]
  const alertMetric = summary[1]

  const cards = [
    {
      id: 'average',
      title: 'Média Geral',
      value: '7.4',
      helper: '+0.3 vs mês anterior',
      icon: <StarBorderRoundedIcon />,
      iconTone: 'bg-orange-100 text-orange-600',
      helperTone: 'text-emerald-600',
    },
    {
      id: 'trail',
      title: 'Trilha Completa',
      value: attendanceMetric ? `${attendanceMetric.value}` : '62%',
      helper: '',
      icon: <QueryStatsRoundedIcon />,
      iconTone: 'bg-sky-100 text-sky-600',
      helperTone: 'text-slate-500',
    },
    {
      id: 'hours',
      title: 'Horas Estudadas',
      value: '12h',
      helper: 'esta semana',
      icon: <ScheduleRoundedIcon />,
      iconTone: 'bg-blue-100 text-blue-600',
      helperTone: 'text-rose-500',
    },
    {
      id: 'done',
      title: 'Atividades Feitas',
      value: alertMetric ? `${alertMetric.value}` : '18',
      helper: '',
      icon: <MenuBookRoundedIcon />,
      iconTone: 'bg-emerald-100 text-emerald-600',
      helperTone: 'text-slate-500',
    },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Box
        className="rounded-3xl px-4 py-5 text-white shadow-[0_16px_34px_rgba(249,115,22,0.26)] md:px-6 md:py-6"
        style={{ background: AppColors.roleGradient('parent') }}
      >
        <Typography className="text-sm text-white/90 md:text-xl">
          Filho(a): {highlightedChild?.name ?? 'Lucas Silva'} - 7º Ano
        </Typography>
        <Typography className="text-3xl font-bold leading-tight md:text-5xl">
          Relatório Geral
        </Typography>
        <Typography className="mt-2 text-lg text-white/90">
          Resumo consolidado do progresso do aluno
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
            {card.helper && (
              <Typography className={['text-base', card.helperTone].join(' ')}>
                {card.helper}
              </Typography>
            )}
          </AppCard>
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentClassName="gap-4 p-5"
          title="Desempenho por Disciplina"
          titleClassName="text-2xl font-bold text-slate-900 md:text-3xl"
        >
          {DISCIPLINE_PERFORMANCE.map(item => (
            <Box
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
              key={item.id}
            >
              <Box className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-semibold text-slate-700 shadow-sm">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  Nota: {item.grade}
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
          title="Resumo Socioemocional"
          titleClassName="text-2xl font-bold text-slate-900 md:text-3xl"
        >
          <Box className="grid grid-cols-5 gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            {WEEKLY_MOOD.map(item => (
              <Box className="text-center" key={item.day}>
                <div className={['text-3xl', item.tone].join(' ')}>
                  {item.icon}
                </div>
                <Typography className="text-sm text-slate-500">
                  {item.day}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="rounded-2xl bg-emerald-50 px-3 py-3">
            <Typography className="text-base text-slate-700">
              Humor positivo na maior parte da semana
            </Typography>
          </Box>
          <Box className="rounded-2xl bg-amber-50 px-3 py-3">
            <Typography className="text-base text-slate-700">
              Queda de motivação detectada na quinta
            </Typography>
          </Box>
          <Typography className="text-sm text-slate-500">
            Mensagens recebidas da plataforma: 2
          </Typography>
        </AppCard>
      </Box>

      <ParentStatusModal
        open={isModalOpen}
        status={status}
        onClose={() => setIsModalOpen(false)}
      />
    </AppPageContainer>
  )
}

export default ParentDashboardPage
