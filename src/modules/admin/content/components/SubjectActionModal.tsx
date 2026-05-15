import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getRoleActionTone } from '@/app/theme/core/roles'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppInput from '@/shared/ui/AppInput'
import type { UserRole } from '@/shared/types/user'

export interface SubjectFormValues {
  name: string
  color: string
}

export type SubjectActionModalMode =
  | { action: 'create' }
  | { action: 'edit'; subjectName: string }
  | { action: 'delete'; subjectName: string }

interface SubjectActionModalProps {
  mode: SubjectActionModalMode | null
  onChange: (field: keyof SubjectFormValues, value: string) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  role: UserRole
  values: SubjectFormValues
  isSubmitting?: boolean
}

const PRESET_COLORS = [
  { label: 'Matemática', value: 'rgba(173, 68, 248, 1)' },
  { label: 'Português', value: 'rgba(5, 113, 247, 1)' },
  { label: 'Ciências', value: 'rgba(0, 210, 237, 1)' },
  { label: 'História', value: 'rgba(255, 186, 0, 1)' },
  { label: 'Geografia', value: 'rgba(0, 212, 106, 1)' },
  { label: 'Biologia', value: 'rgba(20, 184, 166, 1)' },
  { label: 'Inglês', value: 'rgba(254, 51, 163, 1)' },
  { label: 'Geral', value: 'rgba(32, 109, 197, 1)' },
]

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

function SubjectActionModal({
  mode,
  onChange,
  onClose,
  onConfirm,
  open,
  role,
  values,
  isSubmitting = false,
}: SubjectActionModalProps) {
  const theme = useTheme()

  if (!mode) return null

  const actionTone = getRoleActionTone(theme, role)
  const isDelete = mode.action === 'delete'
  const subjectName = mode.action !== 'create' ? mode.subjectName : ''

  const title = isDelete
    ? 'Excluir disciplina'
    : mode.action === 'create'
      ? 'Cadastrar disciplina'
      : 'Editar disciplina'

  const description = isDelete
    ? 'Esta ação remove permanentemente a disciplina do sistema.'
    : mode.action === 'create'
      ? 'Defina o nome e a cor de identificação da nova disciplina.'
      : 'Edite o nome e a cor de identificação da disciplina.'

  const confirmLabel = isDelete
    ? 'Confirmar exclusão'
    : mode.action === 'create'
      ? 'Salvar disciplina'
      : 'Salvar alterações'

  return (
    <AppActionModal
      confirmLabel={confirmLabel}
      description={description}
      disableConfirm={!isDelete && !values.name.trim()}
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
          Deseja excluir a disciplina &quot;{subjectName}&quot;? Esta ação não
          pode ser desfeita.
        </Typography>
      ) : (
        <Box className="grid gap-4">
          <AppInput
            label="Nome da disciplina"
            labelSx={fieldLabelSx}
            onChange={event => onChange('name', event.target.value)}
            placeholder="Ex.: Matemática"
            sx={inputSx}
            value={values.name}
          />

          <Box className="grid gap-2">
            <Typography sx={fieldLabelSx}>Cor de identificação</Typography>

            {/* Color swatches */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PRESET_COLORS.map(preset => {
                const isSelected = values.color === preset.value
                return (
                  <Box
                    component="button"
                    key={preset.value}
                    onClick={() => onChange('color', preset.value)}
                    title={preset.label}
                    type="button"
                    sx={{
                      backgroundColor: preset.value,
                      border: '2px solid',
                      borderColor: isSelected ? 'text.primary' : 'transparent',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      height: 28,
                      outline: isSelected
                        ? `3px solid ${theme.palette.background.paper}`
                        : 'none',
                      outlineOffset: '-1px',
                      padding: 0,
                      transition:
                        'transform 120ms ease, border-color 120ms ease',
                      width: 28,
                      '&:hover': {
                        transform: 'scale(1.15)',
                      },
                    }}
                  />
                )
              })}
            </Box>

            {/* Custom hex input */}
            <Box
              sx={{ alignItems: 'center', display: 'flex', gap: 1.5, mt: 0.5 }}
            >
              <Box
                sx={{
                  backgroundColor: values.color || theme.palette.primary.main,
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '8px',
                  flexShrink: 0,
                  height: 36,
                  width: 36,
                }}
              />
              <AppInput
                label=""
                onChange={event => onChange('color', event.target.value)}
                placeholder="#5B21B6 ou rgba(91,33,182,1)"
                sx={{
                  ...inputSx,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    height: { md: 38, xs: 36 },
                  },
                }}
                value={values.color}
              />
            </Box>
          </Box>
        </Box>
      )}
    </AppActionModal>
  )
}

export default SubjectActionModal
