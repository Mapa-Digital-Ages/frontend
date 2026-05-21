import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getRoleActionTone } from '@/app/theme/core/roles'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import type { UserRole } from '@/shared/types/user'
import type {
  UploadActivityType,
  UploadApprovalItem,
  UploadEditFormValues,
} from '../types/upload'

export type UploadActionModalMode =
  | { action: 'edit'; item: UploadApprovalItem }
  | { action: 'delete'; item: UploadApprovalItem }

interface UploadActionModalProps {
  mode: UploadActionModalMode | null
  onChange: (
    field: keyof UploadEditFormValues,
    value: UploadActivityType
  ) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  role: UserRole
  values: UploadEditFormValues
  isSubmitting?: boolean
}

const ACTIVITY_TYPE_OPTIONS = [
  { label: 'Exercício', value: 'exercise' },
  { label: 'Redação', value: 'essay' },
  { label: 'Atividade', value: 'activity' },
]

const fieldLabelSx = {
  color: 'text.secondary',
  fontSize: { md: 13, xs: 12 },
  fontWeight: 700,
  letterSpacing: '0.02em',
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

function UploadActionModal({
  mode,
  onChange,
  onClose,
  onConfirm,
  open,
  role,
  values,
  isSubmitting = false,
}: UploadActionModalProps) {
  const theme = useTheme()

  if (!mode) return null

  const actionTone = getRoleActionTone(theme, role)
  const isDelete = mode.action === 'delete'

  const title = isDelete ? 'Excluir upload' : 'Editar tipo de atividade'
  const description = isDelete
    ? 'Esta ação remove permanentemente o arquivo de upload do aluno.'
    : 'Defina o tipo de atividade para este arquivo enviado pelo aluno.'
  const confirmLabel = isDelete ? 'Confirmar exclusão' : 'Salvar alteração'

  return (
    <AppActionModal
      confirmLabel={confirmLabel}
      description={description}
      loading={isSubmitting}
      maxWidth="sm"
      mode={isDelete ? 'confirm' : 'form'}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={title}
      {...actionTone}
    >
      {isDelete ? (
        <Typography color="text.secondary">
          Deseja remover o arquivo &quot;{mode.item.fileName}&quot; enviado por{' '}
          {mode.item.studentName}?
        </Typography>
      ) : (
        <Box className="grid gap-3">
          <Box className="grid gap-1">
            <Typography sx={fieldLabelSx}>Tipo de atividade</Typography>
            <AppDropdown
              fullWidth
              onChange={event =>
                onChange(
                  'activityType',
                  String(event.target.value) as UploadActivityType
                )
              }
              options={ACTIVITY_TYPE_OPTIONS}
              placeholder="Selecione o tipo"
              sx={selectSx}
              value={values.activityType}
            />
          </Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            Arquivo: {mode.item.fileName} · Aluno: {mode.item.studentName}
          </Typography>
        </Box>
      )}
    </AppActionModal>
  )
}

export default UploadActionModal
