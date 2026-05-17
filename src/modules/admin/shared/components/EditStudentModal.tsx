import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import type { BoxProps } from '@mui/material'
import { hasMinLength } from '@/shared/utils/validators'
import {
  schoolOptions,
  yearOptions,
} from '@/modules/admin/shared/constants/studentOptions'

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
  const [passwordError, setPasswordError] = useState('')

  function handleChange(field: keyof EditFormValues, value: string) {
    setValues(current => ({ ...current, [field]: value }))
    if (field === 'password') setPasswordError('')
  }

  function validate(): boolean {
    if (values.password && !hasMinLength(values.password, 8)) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres.')
      return false
    }
    return true
  }

  function handleConfirm() {
    if (!validate()) return
    onConfirm(values)
  }

  function handleClose() {
    onClose()
  }

  const hasPasswordError = Boolean(passwordError)

  return (
    <AppActionModal
      {...props}
      confirmLabel="Salvar alterações"
      description="Edite os dados do aluno. A senha só será alterada se um novo valor for informado."
      disableConfirm={hasPasswordError}
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
          type="password"
          value={values.password}
          error={hasPasswordError}
          helperText={passwordError || ' '}
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
