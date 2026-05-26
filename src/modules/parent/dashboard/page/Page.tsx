import { Box, IconButton, Tooltip } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import EmptyState from '@/shared/ui/EmptyState'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import AppCard from '@/shared/ui/AppCard'
import ProgressBar from '@/shared/ui/ProgressBar'
import { AppSubjectTag } from '@/shared/ui/AppSubjectsTags'
import Planner from '@/modules/student/shared/components/Planner'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import { useParentDashboard } from '../hooks/useParentDashboard'
import { SUBJECTS, getSubjectTagContextByLabel } from '@/shared/utils/themes'
import ChildSwitcher from '@/modules/parent/shared/components/ChildSwitcher'
import ParentEmotionalSummary from '@/modules/parent/shared/components/ParentEmotionalSummary'

export default function Page() {
  const {
    child,
    children,
    metrics,
    disciplines,
    tasks,
    wellBeing,
    isLoading,
    selectedChildId,
    selectChild,
  } = useParentDashboard()

  if (isLoading) {
    return <LoadingScreen />
  }

  const streak = metrics[0]
  const complete = metrics[1]
  const cards = [
    {
      id: 'streak',
      title: streak?.title ?? 'Sequência do Aluno',
      value: streak ? `${streak.value}` : '—',
      icon: <TrendingUpRoundedIcon />,
      iconVariant: 'green' as const,
    },
    {
      id: 'activity',
      title: complete?.title ?? 'Atividades Feitas',
      value: complete ? `${complete.value}` : '—',
      icon: <TrackChangesRoundedIcon />,
      iconVariant: 'purple' as const,
    },
  ]

  const childActions = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ChildSwitcher
        children={children}
        selectedChildId={selectedChildId}
        onSelect={selectChild}
      />
    </Box>
  )

  if (!child) {
    return (
      <AppPageContainer className="gap-4 md:gap-5">
        <PageHeader
          subtitle="Acompanhe o progresso dos alunos vinculados a você."
          title="Dashboard do Responsável"
          variant="responsavel"
          actions={childActions}
        />
        <EmptyState
          title="Nenhum aluno vinculado"
          description="Você ainda não possui alunos vinculados ao seu perfil."
        />
      </AppPageContainer>
    )
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        eyebrow="Relatório Geral"
        subtitle="Resumo consolidado do progresso do aluno"
        title={`Aluno(a): ${child.name} - ${child.grade}`}
        variant="responsavel"
        actions={childActions}
      />

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <AppCard
          contentClassName="gap-4 p-5"
          title="Desempenho por Disciplina"
          titleClassName="text-2xl font-bold md:text-3xl"
        >
          {disciplines.map(item => {
            const subject = getSubjectTagContextByLabel(item.subjectLabel) ??
              SUBJECTS[item.subjectId] ?? {
                label: item.subjectLabel,
              }
            return (
              <Box
                key={item.subjectId}
                sx={{
                  backgroundColor: 'var(--app-surface-muted)',
                  border: '1px solid var(--app-border)',
                  borderRadius: '16px',
                  p: 1.5,
                }}
              >
                <ProgressBar
                  headerSlot={<AppSubjectTag size="sm" subject={subject} />}
                  subject={subject}
                  value={item.progress}
                  valueLabelVariant="subject"
                  valueLabel={`Progresso: ${item.progress}%`}
                />
              </Box>
            )
          })}
          {disciplines.length === 0 && (
            <EmptyState
              title="Sem dados de disciplinas"
              description="Nenhum progresso registrado ainda."
            />
          )}
        </AppCard>

        <Box className="flex flex-col gap-4">
          <ParentEmotionalSummary wellBeing={wellBeing} />
          <Planner tasks={tasks} hideStatus />
        </Box>
      </Box>
    </AppPageContainer>
  )
}
