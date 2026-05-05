import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getRoleActionTone } from '@/app/theme/core/roles'
import type { DropdownOption } from '@/shared/ui/AppDropdown'
import AppActionModal, {
  type AppActionModalMode,
} from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import type {
  ApprovalActionFormValues,
  ApprovalItem,
  ApprovalModalAction,
  ApprovalType,
  ContentApprovalActionFormValues,
  ContentApprovalResourceType,
  GuardianApprovalActionFormValues,
} from '@/modules/admin/shared/types/types'
import type { UserRole } from '@/shared/types/user'

export type ApprovalActionModalMode = {
  action: Exclude<ApprovalModalAction, 'correct'>
  item?: ApprovalItem
  type: ApprovalType
}

type ApprovalActionModalUsage = 'confirm' | 'content-form' | 'parent-form'

interface ApprovalActionModalProps {
  mode: ApprovalActionModalMode | null
  onChange: (
    field:
      | keyof ContentApprovalActionFormValues
      | keyof GuardianApprovalActionFormValues,
    value: string | ContentApprovalResourceType
  ) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  resourceTypeOptions: DropdownOption[]
  subjectOptions: DropdownOption[]
  values: ApprovalActionFormValues
  role: UserRole
  disableConfirm?: boolean
  isSubmitting?: boolean
}

const fieldLabelSx = {
  color: 'text.secondary',
  fontSize: { md: 13, xs: 12 },
  fontWeight: 700,
  letterSpacing: '0.02em',
}

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

function isGuardianFormValues(
  values: ApprovalActionFormValues
): values is GuardianApprovalActionFormValues {
  return values.type === 'parent'
}

function isContentFormValues(
  values: ApprovalActionFormValues
): values is ContentApprovalActionFormValues {
  return values.type === 'content'
}

function resolveItemTitle(item?: ApprovalItem) {
  if (!item) {
    return ''
  }

  if (item.kind === 'content') {
    return item.title
  }

  const firstName = item.guardian?.first_name ?? ''
  const lastName = item.guardian?.last_name ?? ''
  const fullName = `${firstName} ${lastName}`.trim()

  return fullName || item.title || ''
}

function resolveUsageMode(
  mode: ApprovalActionModalMode
): ApprovalActionModalUsage {
  if (mode.action === 'delete') {
    return 'confirm'
  }

  return mode.type === 'content' ? 'content-form' : 'parent-form'
}

function resolveDialogMode(
  usage: ApprovalActionModalUsage
): AppActionModalMode {
  if (usage === 'confirm') {
    return 'confirm'
  }

  return 'form'
}

function resolveModalCopy(mode: ApprovalActionModalMode) {
  if (mode.action === 'delete') {
    return {
      confirmLabel: 'Confirmar exclusão',
      description: 'Essa ação remove o item da fila local de aprovação.',
      title:
        mode.type === 'parent' ? 'Excluir responsável' : 'Excluir conteúdo',
    }
  }

  if (mode.type === 'parent') {
    return {
      confirmLabel:
        mode.action === 'create' ? 'Salvar cadastro' : 'Salvar alterações',
      description:
        'Preencha os dados usados para o fluxo de liberação do responsável.',
      title:
        mode.action === 'create'
          ? 'Cadastrar responsável'
          : 'Editar responsável',
    }
  }

  return {
    confirmLabel:
      mode.action === 'create' ? 'Salvar cadastro' : 'Salvar alterações',
    description:
      'Preencha os dados da tarefa ou prova usada no fluxo de aprovação.',
    title: mode.action === 'create' ? 'Cadastrar conteúdo' : 'Editar conteúdo',
  }
}

function ApprovalActionModal({
  mode,
  onChange,
  onClose,
  onConfirm,
  open,
  resourceTypeOptions,
  subjectOptions,
  values,
  role,
  disableConfirm = false,
  isSubmitting = false,
}: ApprovalActionModalProps) {
  const theme = useTheme()

  if (!mode) {
    return null
  }

  const actionTone = getRoleActionTone(theme, role)
  const usage = resolveUsageMode(mode)
  const dialogMode = resolveDialogMode(usage)
  const copy = resolveModalCopy(mode)
  const currentItemTitle = resolveItemTitle(mode.item)
  const isParentForm = usage === 'parent-form' && isGuardianFormValues(values)
  const isContentForm = usage === 'content-form' && isContentFormValues(values)

  return (
    <AppActionModal
      confirmLabel={copy.confirmLabel}
      description={copy.description}
      disableConfirm={disableConfirm}
      loading={isSubmitting}
      maxWidth="sm"
      mode={dialogMode}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={copy.title}
      {...actionTone}
    >
      {usage === 'confirm' ? (
        <Typography color="text.secondary">
          {currentItemTitle
            ? `Deseja remover "${currentItemTitle}" desta fila?`
            : 'Deseja remover este item desta fila?'}
        </Typography>
      ) : null}

      {isParentForm ? (
        <Box className="grid gap-3">
          <Box className="grid grid-cols-2 gap-3">
            <AppInput
              label="Nome"
              labelSx={fieldLabelSx}
              onChange={event => onChange('first_name', event.target.value)}
              placeholder="Ex.: Mariana"
              sx={inputSx}
              value={values.first_name}
            />
            <AppInput
              label="Sobrenome"
              labelSx={fieldLabelSx}
              onChange={event => onChange('last_name', event.target.value)}
              placeholder="Ex.: Souza"
              sx={inputSx}
              value={values.last_name}
            />
            <AppInput
              label="Email"
              labelSx={fieldLabelSx}
              onChange={event => onChange('email', event.target.value)}
              placeholder="Ex.: m.souza@email.com"
              sx={inputSx}
              value={values.email}
            />
            <AppInput
              label="Telefone"
              labelSx={fieldLabelSx}
              onChange={event => onChange('phone_number', event.target.value)}
              placeholder="Ex.: +55 51 98765-4321"
              sx={inputSx}
              value={values.phone_number}
            />
          </Box>
          {mode.action === 'create' ? (
            <AppInput
              label="Senha provisória"
              labelSx={fieldLabelSx}
              onChange={event => onChange('password', event.target.value)}
              placeholder="Defina uma senha inicial"
              sx={inputSx}
              type="password"
              value={values.password}
            />
          ) : null}
        </Box>
      ) : null}

      {isContentForm ? (
        <Box className="grid gap-3">
          <AppInput
            label="Título"
            labelSx={fieldLabelSx}
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Lista de Equações do 7º ano"
            sx={inputSx}
            value={values.title}
          />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                md: 'minmax(0, 1fr) minmax(0, 1fr)',
                xs: '1fr',
              },
            }}
          >
            <Box className="grid gap-1">
              <Typography sx={fieldLabelSx}>Tipo</Typography>
              <AppDropdown
                fullWidth
                onChange={event =>
                  onChange(
                    'resourceType',
                    String(event.target.value) as ContentApprovalResourceType
                  )
                }
                options={resourceTypeOptions}
                placeholder="Selecione o tipo"
                sx={selectSx}
                value={values.resourceType}
              />
            </Box>
            <Box className="grid gap-1">
              <Typography sx={fieldLabelSx}>Disciplina</Typography>
              <AppDropdown
                fullWidth
                onChange={event =>
                  onChange('subjectId', String(event.target.value))
                }
                options={subjectOptions}
                placeholder="Selecione a disciplina"
                sx={selectSx}
                value={values.subjectId}
              />
            </Box>
          </Box>
          <AppInput
            disabled={mode.action === 'create'}
            label="Data da solicitação"
            labelSx={fieldLabelSx}
            onChange={event => onChange('requestedAt', event.target.value)}
            placeholder="DD/MM/AAAA"
            sx={inputSx}
            value={values.requestedAt}
          />
        </Box>
      ) : null}
    </AppActionModal>
  )
}

export default ApprovalActionModal
