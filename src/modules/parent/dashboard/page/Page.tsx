import { Box, MenuItem, Select, Stack, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import EmptyState from '@/shared/ui/EmptyState'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import AppCard from '@/shared/ui/AppCard'
import ProgressBar from '@/shared/ui/ProgressBar'
import EmotionalContainer from '@/shared/ui/EmotionalContainer'
import { AppSubjectTag } from '@/shared/ui/AppSubjectsTags'
import Planner from '@/modules/student/shared/components/Planner'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import { useParentDashboard } from '../hooks/useParentDashboard'
import { SUBJECTS, getSubjectTagContextByLabel } from '@/shared/utils/themes'
import { useState } from 'react'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import { parentService } from '../services/service'
import type { RegisterChildRequest } from '../services/service'

const CLASS_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: '1º Ano (Fund.)' },
  { value: '2', label: '2º Ano (Fund.)' },
  { value: '3', label: '3º Ano (Fund.)' },
  { value: '4', label: '4º Ano (Fund.)' },
  { value: '5', label: '5º Ano (Fund.)' },
  { value: '6', label: '6º Ano (Fund.)' },
  { value: '7', label: '7º Ano (Fund.)' },
  { value: '8', label: '8º Ano (Fund.)' },
  { value: '9', label: '9º Ano (Fund.)' },
  { value: '10', label: '1º Ano (Médio)' },
  { value: '11', label: '2º Ano (Médio)' },
  { value: '12', label: '3º Ano (Médio)' },
]

const emptyForm: RegisterChildRequest = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  birth_date: '',
  student_class: '7',
}

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

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<RegisterChildRequest>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  function updateField(field: keyof RegisterChildRequest, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setFeedbackMessage(null)
  }

  function openModal() {
    setForm(emptyForm)
    setFeedbackMessage(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  async function handleRegisterChild() {
    setSubmitting(true)
    const result = await parentService.registerChild(form)
    setSubmitting(false)

    if (result.success) {
      setModalOpen(false)
      setForm(emptyForm)
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

  if (!child) {
    return (
      <AppPageContainer className="gap-4 md:gap-5">
        <PageHeader
          subtitle="Acompanhe o progresso dos seus filhos."
          title="Dashboard do Responsável"
          variant="responsavel"
        />
        <EmptyState
          title="Nenhum aluno vinculado"
          description="Você ainda não possui alunos vinculados ao seu perfil."
        />
        <ChildRegistrationModal
          open={modalOpen}
          form={form}
          submitting={submitting}
          feedbackMessage={feedbackMessage}
          isFormValid={isFormValid}
          onClose={closeModal}
          onConfirm={handleRegisterChild}
          onUpdateField={updateField}
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
                color: 'rgba(32,109,197,1)',
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
          <EmotionalContainer mode="summary" wellBeing={wellBeing} />
          <Planner tasks={tasks} hideStatus />
        </Box>
      </Box>

      <ChildRegistrationModal
        open={modalOpen}
        form={form}
        submitting={submitting}
        feedbackMessage={feedbackMessage}
        isFormValid={isFormValid}
        onClose={closeModal}
        onConfirm={handleRegisterChild}
        onUpdateField={updateField}
      />
    </AppPageContainer>
  )
}

interface ChildRegistrationModalProps {
  open: boolean
  form: RegisterChildRequest
  submitting: boolean
  feedbackMessage: string | null
  isFormValid: boolean
  onClose: () => void
  onConfirm: () => void
  onUpdateField: (field: keyof RegisterChildRequest, value: string) => void
}

function ChildRegistrationModal({
  open,
  form,
  submitting,
  feedbackMessage,
  isFormValid,
  onClose,
  onConfirm,
  onUpdateField,
}: ChildRegistrationModalProps) {
  return (
    <AppActionModal
      confirmLabel="Cadastrar"
      description="Preencha os dados do aluno. O cadastro requer aprovação do administrador."
      disableConfirm={!isFormValid || submitting}
      loading={submitting}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title="Cadastrar filho"
    >
      <Stack gap={2}>
        <Box className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <AppInput
            label="Nome"
            onChange={e => onUpdateField('first_name', e.target.value)}
            placeholder="Ex.: Lucas"
            value={form.first_name}
          />
          <AppInput
            label="Sobrenome"
            onChange={e => onUpdateField('last_name', e.target.value)}
            placeholder="Ex.: Silva"
            value={form.last_name}
          />
        </Box>

        <AppInput
          label="E-mail do aluno"
          type="email"
          onChange={e => onUpdateField('email', e.target.value)}
          placeholder="aluno@escola.com"
          value={form.email}
        />

        <AppInput
          label="Senha de acesso (mín. 8 caracteres)"
          type="password"
          onChange={e => onUpdateField('password', e.target.value)}
          placeholder="••••••••"
          value={form.password}
        />

        <AppInput
          label="Data de nascimento"
          type="date"
          onChange={e => onUpdateField('birth_date', e.target.value)}
          value={form.birth_date}
          InputLabelProps={{ shrink: true }}
        />

        <Box>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 500 }}
          >
            Ano escolar
          </Typography>
          <Select
            fullWidth
            value={form.student_class}
            onChange={e => onUpdateField('student_class', e.target.value)}
            size="small"
            sx={{ borderRadius: '10px' }}
          >
            {CLASS_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {feedbackMessage && (
          <Box
            sx={{
              backgroundColor: feedbackMessage.includes('aprovação')
                ? 'rgba(234,179,8,0.08)'
                : 'rgba(239,68,68,0.08)',
              border: `1px solid ${
                feedbackMessage.includes('aprovação')
                  ? 'rgba(234,179,8,0.35)'
                  : 'rgba(239,68,68,0.35)'
              }`,
              borderRadius: '10px',
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: feedbackMessage.includes('aprovação')
                  ? '#eab308'
                  : '#ef4444',
                fontWeight: 500,
              }}
            >
              {feedbackMessage}
            </Typography>
          </Box>
        )}
      </Stack>
    </AppActionModal>
  )
}
