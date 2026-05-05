import { Alert, Box } from '@mui/material'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import type { RegisterChildRequest } from '@/modules/parent/dashboard/services/service'

const CLASS_OPTIONS: DropdownOption[] = [
  { value: '5', label: '5º Ano (Fund.)' },
  { value: '6', label: '6º Ano (Fund.)' },
  { value: '7', label: '7º Ano (Fund.)' },
  { value: '8', label: '8º Ano (Fund.)' },
  { value: '9', label: '9º Ano (Fund.)' },
]

type FeedbackTone = 'warning' | 'error'

const feedbackTokens: Record<
  FeedbackTone,
  { border: string; color: string; backgroundColor: string }
> = {
  warning: {
    backgroundColor: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.35)',
    color: '#eab308',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.35)',
    color: '#ef4444',
  },
}

function resolveFeedbackTone(message: string): FeedbackTone {
  return message.includes('aprovação') ? 'warning' : 'error'
}

export interface ChildRegistrationModalProps {
  feedbackMessage: string | null
  form: RegisterChildRequest
  isFormValid: boolean
  onClose: () => void
  onConfirm: () => void
  onUpdateField: (field: keyof RegisterChildRequest, value: string) => void
  open: boolean
  submitting: boolean
}

function ChildRegistrationModal({
  feedbackMessage,
  form,
  isFormValid,
  onClose,
  onConfirm,
  onUpdateField,
  open,
  submitting,
}: ChildRegistrationModalProps) {
  const feedbackTone = feedbackMessage
    ? resolveFeedbackTone(feedbackMessage)
    : null

  return (
    <AppActionModal
      confirmLabel="Cadastrar"
      description="Preencha os dados do aluno. O acesso será criado e vinculado ao responsável."
      disableConfirm={!isFormValid || submitting}
      loading={submitting}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title="Cadastrar filho"
    >
      <Box className="grid gap-3">
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
          label="Telefone (opcional)"
          onChange={e => onUpdateField('phone_number', e.target.value)}
          placeholder="(00) 00000-0000"
          value={form.phone_number ?? ''}
        />
        <AppInput
          label="Data de nascimento"
          onChange={e => onUpdateField('birth_date', e.target.value)}
          placeholder="DD/MM/AAAA"
          value={form.birth_date}
        />
        <AppDropdown
          fullWidth
          label="Ano escolar"
          options={CLASS_OPTIONS}
          onChange={e => onUpdateField('student_class', String(e.target.value))}
          placeholder="Selecione o ano"
          value={form.student_class}
          neutralOutline
        />

        {feedbackTone ? (
          <Alert
            icon={false}
            severity={feedbackTone}
            variant="outlined"
            sx={{
              alignItems: 'center',
              backgroundColor: feedbackTokens[feedbackTone].backgroundColor,
              borderColor: feedbackTokens[feedbackTone].border,
              borderRadius: '10px',
              color: feedbackTokens[feedbackTone].color,
              fontWeight: 500,
              px: 2,
              py: 0.5,
            }}
          >
            {feedbackMessage}
          </Alert>
        ) : null}
      </Box>
    </AppActionModal>
  )
}

export default ChildRegistrationModal
