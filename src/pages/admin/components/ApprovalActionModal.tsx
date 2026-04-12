import { Box, Typography } from '@mui/material'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import AppActionModal, {
  type AppActionModalMode,
} from '@/components/common/AppActionModal'
import AppDropdown from '@/components/ui/AppDropdown'
import AppInput from '@/components/ui/AppInput'
import { AppColors } from '@/styles/AppColors'
import type {
  ApprovalItem,
  ApprovalModalAction,
  ApprovalType,
  ContentApprovalResourceType,
} from '@/types/admin'
import type { UserRole } from '@/types/user'

export type ApprovalActionModalMode = {
  action: Exclude<ApprovalModalAction, 'correct'>
  item?: ApprovalItem
  type: ApprovalType
}

type ApprovalActionModalUsage = 'confirm' | 'content-form' | 'guardian-form'

export interface ApprovalActionFormValues {
  childName: string
  requestedAt: string
  resourceType: ContentApprovalResourceType
  subjectId: string
  title: string
}

interface ApprovalActionModalProps {
  mode: ApprovalActionModalMode | null
  onChange: (
    field: keyof ApprovalActionFormValues,
    value: string | ContentApprovalResourceType
  ) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  resourceTypeOptions: DropdownOption[]
  subjectOptions: DropdownOption[]
  values: ApprovalActionFormValues
  role: UserRole
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

function resolveUsageMode(
  mode: ApprovalActionModalMode
): ApprovalActionModalUsage {
  const isContentMode = mode.type === 'content'

  if (mode.action === 'delete') {
    return 'confirm'
  }

  return mode.type === 'guardian'
    ? 'guardian-form'
    : isContentMode
      ? 'content-form'
      : 'guardian-form'
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
        mode.type === 'guardian' ? 'Excluir responsável' : 'Excluir conteúdo',
    }
  }

  if (mode.type === 'guardian') {
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
}: ApprovalActionModalProps) {
  if (!mode) {
    return null
  }

  const accent = AppColors.role[role]
  const usage = resolveUsageMode(mode)
  const dialogMode = resolveDialogMode(usage)
  const copy = resolveModalCopy(mode)
  const currentItem = mode.item

  return (
    <AppActionModal
      accentSoftColor={accent.soft}
      confirmColor={accent.primary}
      confirmLabel={copy.confirmLabel}
      confirmTextColor={accent.contrast}
      description={copy.description}
      maxWidth="sm"
      mode={dialogMode}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      role={role}
      title={copy.title}
    >
      {usage === 'confirm' ? (
        <Typography color="text.secondary">
          {currentItem
            ? `Deseja remover "${currentItem.title}" desta fila?`
            : 'Deseja remover este item desta fila?'}
        </Typography>
      ) : null}

      {usage === 'guardian-form' ? (
        <Box className="grid gap-3">
          <AppInput
            label="Nome do responsável"
            labelSx={fieldLabelSx}
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Mariana Souza"
            sx={inputSx}
            value={values.title}
          />
          <AppInput
            label="Nome do aluno"
            labelSx={fieldLabelSx}
            onChange={event => onChange('childName', event.target.value)}
            placeholder="Ex.: Luiza Souza"
            sx={inputSx}
            value={values.childName}
          />
          <Box
            sx={{
              backgroundColor: 'background.default',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: '14px',
              display: 'grid',
              gap: 0.5,
              px: 1.75,
              py: 1.25,
            }}
          >
            <Typography sx={fieldLabelSx}>Papel do responsável</Typography>
            <Typography
              sx={{ color: 'text.primary', fontSize: { md: 14, xs: 13 } }}
            >
              Responsável
            </Typography>
          </Box>
          <AppInput
            label="Data da solicitação"
            labelSx={fieldLabelSx}
            onChange={event => onChange('requestedAt', event.target.value)}
            placeholder="DD/MM/AAAA"
            sx={inputSx}
            value={values.requestedAt}
          />
        </Box>
      ) : null}

      {usage === 'content-form' ? (
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
