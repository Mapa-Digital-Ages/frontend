import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { HexColorPicker } from 'react-colorful'
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
  { label: 'Matemática', value: '#ad44f8' },
  { label: 'Português', value: '#0571f7' },
  { label: 'Ciências', value: '#00d2ed' },
  { label: 'História', value: '#ffba00' },
  { label: 'Geografia', value: '#00d46a' },
  { label: 'Biologia', value: '#14b8a6' },
  { label: 'Inglês', value: '#fe33a3' },
  { label: 'Geral', value: '#206dc5' },
]

function normalizeToHex(color: string): string {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    if (hex.length === 3) {
      return (
        '#' +
        hex
          .split('')
          .map(c => c + c)
          .join('')
      )
    }
    if (hex.length === 6) return color.toLowerCase()
    return '#206dc5'
  }
  const match = color
    .trim()
    .match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\s*\)$/i)
  if (match) {
    const r = Number.parseInt(match[1]).toString(16).padStart(2, '0')
    const g = Number.parseInt(match[2]).toString(16).padStart(2, '0')
    const b = Number.parseInt(match[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }
  return '#206dc5'
}

const fieldLabelSx = {
  color: 'text.secondary',
  fontSize: { md: 13, xs: 12 },
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
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
  const isDark = theme.palette.mode === 'dark'

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

  const currentHex = normalizeToHex(values.color)
  const activeColor = currentHex

  const surfaceBg = isDark
    ? alpha(theme.palette.common.white, 0.04)
    : alpha(theme.palette.text.primary, 0.03)
  const surfaceBorder = isDark
    ? alpha(theme.palette.common.white, 0.1)
    : alpha(theme.palette.text.primary, 0.1)

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AppInput
            label="Nome da disciplina"
            labelSx={fieldLabelSx}
            onChange={event => onChange('name', event.target.value)}
            placeholder="Ex.: Matemática"
            sx={inputSx}
            value={values.name}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography sx={fieldLabelSx}>Cor de identificação</Typography>

            <Box
              sx={{
                backgroundColor: surfaceBg,
                border: '1px solid',
                borderColor: surfaceBorder,
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              {/* HexColorPicker — full-width, flat, sem border-radius próprio */}
              <Box
                sx={{
                  '& .react-colorful': {
                    width: '100%',
                    height: 200,
                    borderRadius: 0,
                    gap: 0,
                  },
                  '& .react-colorful__saturation': {
                    borderRadius: 0,
                    flex: 1,
                  },
                  '& .react-colorful__hue': {
                    height: 14,
                    borderRadius: 0,
                    margin: 0,
                  },
                  '& .react-colorful__saturation-pointer': {
                    width: 18,
                    height: 18,
                    borderWidth: 2,
                  },
                  '& .react-colorful__hue-pointer': {
                    width: 18,
                    height: 18,
                    borderWidth: 2,
                  },
                }}
              >
                <HexColorPicker
                  color={currentHex}
                  onChange={hex => onChange('color', hex)}
                />
              </Box>

              {/* Bottom row: swatch preview + hex input + presets */}
              <Box
                sx={{
                  borderTop: '1px solid',
                  borderColor: surfaceBorder,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 2,
                }}
              >
                {/* Preview + hex input */}
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5 }}>
                  <Box
                    sx={{
                      backgroundColor: activeColor,
                      borderRadius: '8px',
                      boxShadow: `0 2px 8px ${alpha(activeColor, 0.45)}`,
                      flexShrink: 0,
                      height: 38,
                      transition: 'background-color 80ms, box-shadow 80ms',
                      width: 38,
                    }}
                  />
                  <AppInput
                    label=""
                    onChange={event => onChange('color', event.target.value)}
                    placeholder="#206dc5"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        height: 38,
                        backgroundColor: isDark
                          ? alpha(theme.palette.common.white, 0.05)
                          : alpha(theme.palette.common.black, 0.03),
                      },
                      '& .MuiInputBase-input': {
                        fontSize: 13,
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                      },
                    }}
                    value={values.color}
                  />
                </Box>

                {/* Preset swatches */}
                <Box
                  sx={{
                    display: 'grid',
                    gap: 1,
                    gridTemplateColumns: 'repeat(8, 1fr)',
                  }}
                >
                  {PRESET_COLORS.map(preset => {
                    const isSelected =
                      normalizeToHex(values.color) === preset.value
                    return (
                      <Box
                        component="button"
                        key={preset.value}
                        onClick={() => onChange('color', preset.value)}
                        title={preset.label}
                        type="button"
                        sx={{
                          aspectRatio: '1',
                          backgroundColor: preset.value,
                          border: '2.5px solid',
                          borderColor: isSelected
                            ? theme.palette.background.paper
                            : 'transparent',
                          borderRadius: '50%',
                          boxShadow: isSelected
                            ? `0 0 0 2px ${preset.value}`
                            : 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition:
                            'transform 120ms ease, box-shadow 120ms ease',
                          width: '100%',
                          '&:hover': {
                            transform: 'scale(1.18)',
                            boxShadow: `0 0 0 2px ${preset.value}`,
                          },
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </AppActionModal>
  )
}

export default SubjectActionModal
