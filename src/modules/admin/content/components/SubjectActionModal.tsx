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

function rgbaToHex(rgba: string): string {
  const match = rgba
    .trim()
    .match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\s*\)$/i)
  if (match) {
    const r = Number.parseInt(match[1]).toString(16).padStart(2, '0')
    const g = Number.parseInt(match[2]).toString(16).padStart(2, '0')
    const b = Number.parseInt(match[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }
  if (rgba.startsWith('#')) return rgba
  return '#206dc5'
}

function hexToRgba(hex: string): string {
  const clean = hex.replace('#', '')
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, 1)`
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

  const currentHex = rgbaToHex(values.color)

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

            {/* Preset swatches */}
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
                      border: '3px solid',
                      borderColor: isSelected
                        ? theme.palette.background.paper
                        : 'transparent',
                      borderRadius: '50%',
                      boxShadow: isSelected
                        ? `0 0 0 2px ${preset.value}`
                        : 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      height: 32,
                      padding: 0,
                      transition: 'transform 120ms ease, box-shadow 120ms ease',
                      width: 32,
                      '&:hover': {
                        transform: 'scale(1.12)',
                      },
                    }}
                  />
                )
              })}
            </Box>

            {/* Native color picker + value display */}
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: 1.5,
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'background.default',
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexShrink: 0,
                  height: 42,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  width: 42,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: values.color || theme.palette.primary.main,
                    borderRadius: '6px',
                    height: 26,
                    width: 26,
                  }}
                />
                <Box
                  component="input"
                  type="color"
                  value={currentHex}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange('color', hexToRgba(e.target.value))
                  }
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    left: 0,
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                  }}
                />
              </Box>

              <AppInput
                label=""
                onChange={event => onChange('color', event.target.value)}
                placeholder="#5B21B6 ou rgba(91,33,182,1)"
                sx={{
                  ...inputSx,
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    height: { md: 42, xs: 40 },
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
