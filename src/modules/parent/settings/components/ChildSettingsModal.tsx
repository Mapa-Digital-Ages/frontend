import { Alert, Box, Typography } from '@mui/material'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import type { ParentDashboardChild } from '@/modules/parent/settings/types/types'

export type ChildSettingsModalMode = 'create' | 'edit' | 'delete'

export interface ChildSettingsForm {
  birth_date: string
  email: string
  first_name: string
  last_name: string
  password: string
  phone_number: string
  school_id: string
  student_class: string
}

interface ChildSettingsModalProps {
  child?: ParentDashboardChild | null
  disableConfirm?: boolean
  feedbackMessage?: string | null
  form: ChildSettingsForm
  mode: ChildSettingsModalMode | null
  onChange: (field: keyof ChildSettingsForm, value: string) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  submitting?: boolean
}

const CLASS_OPTIONS: DropdownOption[] = [
  { value: '5', label: '5º Ano (Fund.)' },
  { value: '6', label: '6º Ano (Fund.)' },
  { value: '7', label: '7º Ano (Fund.)' },
  { value: '8', label: '8º Ano (Fund.)' },
  { value: '9', label: '9º Ano (Fund.)' },
]

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    height: { md: 46, xs: 44 },
  },
  '& .MuiInputBase-input': {
    fontSize: { md: 14, xs: 13 },
  },
}

const selectSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    minHeight: { md: 46, xs: 44 },
  },
  '& .MuiSelect-select': {
    fontSize: { md: 14, xs: 13 },
    py: 1.25,
  },
}

function resolveModalCopy(mode: ChildSettingsModalMode | null) {
  if (mode === 'edit') {
    return {
      confirmLabel: 'Salvar alterações',
      description: 'Atualize os dados usados no cadastro do filho.',
      title: 'Editar filho',
    }
  }

  if (mode === 'delete') {
    return {
      confirmLabel: 'Excluir filho',
      description: 'Essa ação remove o vínculo deste filho da sua conta.',
      title: 'Excluir filho',
    }
  }

  return {
    confirmLabel: 'Cadastrar filho',
    description:
      'Preencha os dados do aluno. O acesso será criado e vinculado ao responsável.',
    title: 'Cadastrar filho',
  }
}

function ChildSettingsModal({
  child,
  disableConfirm = false,
  feedbackMessage,
  form,
  mode,
  onChange,
  onClose,
  onConfirm,
  open,
  submitting = false,
}: ChildSettingsModalProps) {
  const copy = resolveModalCopy(mode)
  const isDelete = mode === 'delete'
  const isCreate = mode === 'create'

  return (
    <AppActionModal
      confirmLabel={copy.confirmLabel}
      confirmTone={isDelete ? 'error.main' : 'primary.main'}
      description={copy.description}
      disableConfirm={disableConfirm || submitting}
      loading={submitting}
      mode={isDelete ? 'confirm' : 'form'}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={copy.title}
      variant={isDelete ? 'confirm' : 'form'}
    >
      {isDelete ? (
        <Typography color="text.secondary">
          Deseja excluir o vínculo de {child?.name ?? 'este filho'}?
        </Typography>
      ) : (
        <Box className="grid gap-3">
          <Box className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <AppInput
              label="Nome"
              onChange={event => onChange('first_name', event.target.value)}
              placeholder="Ex.: Lucas"
              sx={inputSx}
              value={form.first_name}
            />
            <AppInput
              label="Sobrenome"
              onChange={event => onChange('last_name', event.target.value)}
              placeholder="Ex.: Silva"
              sx={inputSx}
              value={form.last_name}
            />
          </Box>
          {isCreate ? (
            <>
              <AppInput
                label="E-mail do aluno"
                onChange={event => onChange('email', event.target.value)}
                placeholder="aluno@escola.com"
                sx={inputSx}
                type="email"
                value={form.email}
              />
              <AppInput
                label="Senha de acesso (mín. 8 caracteres)"
                onChange={event => onChange('password', event.target.value)}
                placeholder="Defina uma senha inicial"
                sx={inputSx}
                type="password"
                value={form.password}
              />
            </>
          ) : null}
          <AppInput
            label="Telefone (opcional)"
            onChange={event => onChange('phone_number', event.target.value)}
            placeholder="(00) 00000-0000"
            sx={inputSx}
            value={form.phone_number}
          />
          <AppInput
            label="Data de nascimento"
            onChange={event => onChange('birth_date', event.target.value)}
            placeholder="DD/MM/AAAA"
            sx={inputSx}
            value={form.birth_date}
            type="date"
          />
          <AppDropdown
            fullWidth
            label="Ano escolar"
            neutralOutline
            onChange={event =>
              onChange('student_class', String(event.target.value))
            }
            options={CLASS_OPTIONS}
            placeholder="Selecione o ano"
            sx={selectSx}
            value={form.student_class}
          />
          {feedbackMessage ? (
            <Alert
              icon={false}
              severity="error"
              variant="outlined"
              sx={{ borderRadius: '10px', fontSize: 14, py: 0.5 }}
            >
              {feedbackMessage}
            </Alert>
          ) : null}
        </Box>
      )}
    </AppActionModal>
  )
}

export default ChildSettingsModal
