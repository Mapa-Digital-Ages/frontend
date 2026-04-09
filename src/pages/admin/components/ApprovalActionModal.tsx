import { Box, Typography } from '@mui/material'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import AppActionModal from '@/components/common/AppActionModal'
import AppDropdown from '@/components/ui/AppDropdown'
import AppInput from '@/components/ui/AppInput'
import type {
  ApprovalItem,
  ApprovalModalAction,
  ApprovalType,
  ContentApprovalResourceType,
} from '@/types/admin'

export type ApprovalActionModalMode =
  | {
      action: Exclude<ApprovalModalAction, 'correct'>
      item?: ApprovalItem
      type: ApprovalType
    }
  | {
      action: 'correct'
      item: ApprovalItem
      type: 'content'
    }

export interface ApprovalActionFormValues {
  childName: string
  correctionNote: string
  requestedAt: string
  resourceType: ContentApprovalResourceType
  roleLabel: string
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
  roleOptions: DropdownOption[]
  subjectOptions: DropdownOption[]
  values: ApprovalActionFormValues
}

function ApprovalActionModal({
  mode,
  onChange,
  onClose,
  onConfirm,
  open,
  resourceTypeOptions,
  roleOptions,
  subjectOptions,
  values,
}: ApprovalActionModalProps) {
  if (!mode) {
    return null
  }

  const isDelete = mode.action === 'delete'
  const isEdit = mode.action === 'edit'
  const isCreate = mode.action === 'create'
  const isForm = mode.action !== 'delete'
  const title =
    mode.action === 'correct'
      ? 'Solicitar correção'
      : mode.type === 'guardian'
        ? isCreate
          ? 'Cadastrar responsável'
          : isEdit
            ? 'Editar responsável'
            : 'Excluir responsável'
        : isCreate
          ? 'Cadastrar conteúdo'
          : isEdit
            ? 'Editar conteúdo'
            : 'Excluir conteúdo'
  const confirmLabel =
    mode.action === 'correct'
      ? 'Solicitar correção'
      : isDelete
        ? 'Confirmar exclusão'
        : isCreate
          ? 'Salvar cadastro'
          : 'Salvar alterações'
  const description =
    mode.action === 'correct'
      ? 'Registre a orientação para a correção provisória da atividade.'
      : isDelete
        ? 'Essa ação remove o item da fila local de aprovação.'
        : mode.type === 'guardian'
          ? 'Preencha os dados usados para o fluxo de liberação do responsável.'
          : 'Preencha os dados da tarefa ou prova usada no fluxo de aprovação.'

  return (
    <AppActionModal
      confirmLabel={confirmLabel}
      confirmTone={isDelete ? 'error.main' : 'primary.main'}
      description={description}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={title}
      variant={isForm ? 'form' : 'confirm'}
    >
      {isDelete ? (
        <Typography color="text.secondary">
          {mode.item
            ? `Deseja remover "${mode.item.title}" desta fila?`
            : 'Deseja remover este item desta fila?'}
        </Typography>
      ) : mode.action === 'correct' ? (
        <AppInput
          label="Orientação de correção"
          multiline
          minRows={4}
          onChange={event => onChange('correctionNote', event.target.value)}
          placeholder="Descreva o que precisa ser ajustado pelo aluno."
          value={values.correctionNote}
        />
      ) : mode.type === 'guardian' ? (
        <Box className="grid gap-3">
          <AppInput
            label="Nome do responsável"
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Mariana Souza"
            value={values.title}
          />
          <AppInput
            label="Nome do aluno"
            onChange={event => onChange('childName', event.target.value)}
            placeholder="Ex.: Luiza Souza"
            value={values.childName}
          />
          <AppDropdown
            fullWidth
            onChange={event => onChange('roleLabel', String(event.target.value))}
            options={roleOptions}
            placeholder="Selecione o papel"
            value={values.roleLabel}
          />
          <AppInput
            label="Data da solicitação"
            onChange={event => onChange('requestedAt', event.target.value)}
            placeholder="DD/MM/AAAA"
            value={values.requestedAt}
          />
        </Box>
      ) : mode.type === 'content' ? (
        <Box className="grid gap-3">
          <AppInput
            label="Título"
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Lista de Equações do 7º ano"
            value={values.title}
          />
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
            value={values.resourceType}
          />
          <AppDropdown
            fullWidth
            onChange={event => onChange('subjectId', String(event.target.value))}
            options={subjectOptions}
            placeholder="Selecione a disciplina"
            value={values.subjectId}
          />
          <AppInput
            label="Data da solicitação"
            onChange={event => onChange('requestedAt', event.target.value)}
            placeholder="DD/MM/AAAA"
            value={values.requestedAt}
          />
        </Box>
      ) : null
      }
    </AppActionModal>
  )
}

export default ApprovalActionModal
