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
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useParentDashboard } from '../hooks/useParentDashboard'
import { SUBJECTS, getSubjectTagContextByLabel } from '@/shared/utils/themes'
import { useCallback, useState } from 'react'
import { parentService } from '../services/service'
import type { RegisterChildRequest } from '@/modules/parent/dashboard/services/service'
import ChildRegistrationModal from '@/modules/parent/shared/components/ChildRegistrationModal'
import ChildSwitcher from '@/modules/parent/shared/components/ChildSwitcher'
import ParentEmotionalSummary from '@/modules/parent/shared/components/ParentEmotionalSummary'

const emptyForm: RegisterChildRequest = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone_number: '',
  birth_date: '',
  student_class: '7',
  school_id: '',
}

export default function Page() {
  const {
    child,
    children,
    metrics,
    disciplines,
    tasks,
    isLoading,
    selectedChildId,
    selectChild,
  } = useParentDashboard()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<RegisterChildRequest>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const updateField = useCallback(
    (field: keyof RegisterChildRequest, value: string) => {
      setForm(prev => ({ ...prev, [field]: value }))
      setFeedbackMessage(null)
    },
    []
  )

  function closeModal() {
    setModalOpen(false)
    setForm(emptyForm)
    setFeedbackMessage(null)
  }

  async function handleRegisterChild() {
    setSubmitting(true)
    const result = await parentService.registerChild(form)
    setSubmitting(false)

    if (result.success) {
      closeModal()
    } else {
      setFeedbackMessage(result.message ?? 'Erro ao cadastrar.')
    }
  }

  const isFormValid =
    form.first_name.trim() !== '' &&
    form.last_name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.length >= 8 &&
    form.birth_date !== '' &&
    form.student_class !== ''

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
          subtitle="Acompanhe o progresso dos seus filhos."
          title="Dashboard do Responsável"
          variant="responsavel"
          actions={childActions}
        />
        <EmptyState
          title="Nenhum aluno vinculado"
          description="Você ainda não possui alunos vinculados ao seu perfil."
        />
        <ChildRegistrationModal
          feedbackMessage={feedbackMessage}
          form={form}
          isFormValid={isFormValid}
          onClose={closeModal}
          onConfirm={handleRegisterChild}
          onUpdateField={updateField}
          open={modalOpen}
          submitting={submitting}
        />
      </AppPageContainer>
    )
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        eyebrow="Relatório Geral"
        subtitle="Resumo consolidado do progresso do aluno"
        title={`Filho(a): ${child.name} - ${child.grade}`}
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
          <ParentEmotionalSummary />
          <Planner tasks={tasks} hideStatus />
        </Box>
      </Box>

      <ChildRegistrationModal
        feedbackMessage={feedbackMessage}
        form={form}
        isFormValid={isFormValid}
        onClose={closeModal}
        onConfirm={handleRegisterChild}
        onUpdateField={updateField}
        open={modalOpen}
        submitting={submitting}
      />
    </AppPageContainer>
  )
}
