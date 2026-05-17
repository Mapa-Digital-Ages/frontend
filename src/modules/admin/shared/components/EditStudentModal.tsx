import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import type { BoxProps } from '@mui/material'
import {
  schoolOptions,
  yearOptions,
} from '@/modules/admin/shared/constants/studentOptions'

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

const fieldLabelSx = {
  color: 'text.primary',
  fontSize: { md: 13, xs: 12 },
  fontWeight: 700,
  letterSpacing: '0.02em',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'background.paper',
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

export interface Student {
  name: string
  school: string
  year: string
}

interface EditStudentModalProps extends BoxProps {
  open: boolean
  onClose: () => void
  onConfirm: (values: EditFormValues) => void
  student: Student
}

export interface EditFormValues {
  password: string
  school: string
  year: string
}

function getDefaultValues(student: Student): EditFormValues {
  return {
    password: '',
    school: student.school,
    year: student.year,
  }
}

function isValidPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}

function getPasswordHelperText(password: string): string {
  if (!password) return ''
  if (isValidPassword(password)) return ''
  const missing: string[] = []
  if (password.length < 8) missing.push('mínimo 8 caracteres')
  if (!/[A-Z]/.test(password)) missing.push('uma letra maiúscula')
  if (!/[a-z]/.test(password)) missing.push('uma letra minúscula')
  if (!/\d/.test(password)) missing.push('um número')
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    missing.push('um caractere especial')
  return `Faltando: ${missing.join(', ')}.`
}

export default function EditStudentModal({
  open,
  onClose,
  onConfirm,
  student,
  ...props
}: EditStudentModalProps) {
  const theme = useTheme()
  const [values, setValues] = useState<EditFormValues>(() =>
    getDefaultValues(student)
  )
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (open) {
      setValues(getDefaultValues(student))
      setShowPassword(false)
    }
  }, [open, student])

  function handleChange(field: keyof EditFormValues, value: string) {
    setValues(current => ({ ...current, [field]: value }))
  }

  function handleConfirm() {
    onConfirm(values)
  }

  function handleClose() {
    onClose()
  }

  const passwordOk = !values.password || isValidPassword(values.password)
  const isDisabled = !passwordOk

  return (
    <AppActionModal
      {...props}
      confirmLabel="Salvar alterações"
      description="Edite os dados do aluno. A senha só será alterada se um novo valor for informado."
      disableConfirm={isDisabled}
      maxWidth="sm"
      mode="form"
      onClose={handleClose}
      onConfirm={handleConfirm}
      open={open}
      title="Editar aluno"
      confirmColor={theme.palette.error.main}
    >
      <Box className="grid gap-3">
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'action.hover',
            borderRadius: '12px',
            display: 'flex',
            gap: 1.5,
            px: 2,
            py: 1.25,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'error.main',
              borderRadius: '50%',
              color: '#fff',
              display: 'flex',
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 700,
              height: 32,
              justifyContent: 'center',
              width: 32,
            }}
          >
            {student.name.charAt(0).toUpperCase()}
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: { md: 14, xs: 13 },
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {student.name}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { md: 12, xs: 11 },
                lineHeight: 1.3,
              }}
            >
              Editando dados do aluno
            </Typography>
          </Box>
        </Box>

        <AppInput
          label="Nova senha"
          labelSx={fieldLabelSx}
          onChange={e => handleChange('password', e.target.value)}
          placeholder="Deixe em branco para não alterar"
          sx={inputSx}
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          error={!!values.password && !isValidPassword(values.password)}
          helperText={getPasswordHelperText(values.password)}
          InputProps={{
            endAdornment: (
              <Box
                component="span"
                onClick={() => setShowPassword(v => !v)}
                sx={{
                  cursor: 'pointer',
                  color: 'text.secondary',
                  fontSize: 12,
                  fontWeight: 600,
                  userSelect: 'none',
                  pr: 0.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Box>
            ),
          }}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          }}
        >
          <AppDropdown
            fullWidth
            label="Escola"
            onChange={e => handleChange('school', String(e.target.value))}
            options={schoolOptions}
            sx={selectSx}
            value={values.school}
          />
          <AppDropdown
            fullWidth
            label="Ano"
            onChange={e => handleChange('year', String(e.target.value))}
            options={yearOptions}
            sx={selectSx}
            value={values.year}
          />
        </Box>
      </Box>
    </AppActionModal>
  )
}
