import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import {
  schoolOptions,
  classOptions,
} from '@/modules/admin/shared/constants/studentOptions'

const fieldLabelSx = {
  color: 'text.primary',
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

interface TransferStudentModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (values: TransferFormValues) => void
  defaultStudentId?: string
  studentOptions: {
    label: string
    value: string
    school: string
    class: string
  }[]
}

export interface TransferFormValues {
  studentId: string
  school: string
  class: string
}

function getDefaultValues(studentId = '1'): TransferFormValues {
  return {
    studentId,
    school: 'escola-sao-paulo',
    class: '7a',
  }
}

export default function TransferStudentModal({
  open,
  onClose,
  onConfirm,
  defaultStudentId,
  studentOptions,
}: TransferStudentModalProps) {
  const theme = useTheme()
  const [values, setValues] = useState<TransferFormValues>(() =>
    getDefaultValues(defaultStudentId)
  )

  const selectedStudent = studentOptions.find(s => s.value === values.studentId)

  const school = selectedStudent?.school
  const studentClass = selectedStudent?.class

  function handleChange(field: keyof TransferFormValues, value: string) {
    setValues(current => ({ ...current, [field]: value }))
  }

  function handleConfirm() {
    onConfirm(values)
    setValues(getDefaultValues(defaultStudentId))
  }

  function handleClose() {
    setValues(getDefaultValues(defaultStudentId))
    onClose()
  }

  return (
    <AppActionModal
      confirmLabel="Transferir aluno"
      description="Selecione um aluno já cadastrado e defina a escola e a turma de destino para concluir a transferência."
      maxWidth="sm"
      mode="form"
      onClose={handleClose}
      onConfirm={handleConfirm}
      open={open}
      title="Transferir aluno"
      confirmColor={theme.palette.error.main}
    >
      <Box className="grid gap-3">
        <Box className="grid gap-1">
          <Typography sx={fieldLabelSx}>Aluno existente</Typography>
          <AppDropdown
            fullWidth
            onChange={e => {
              const studentId = String(e.target.value)

              const student = studentOptions.find(s => s.value === studentId)

              const schoolValue =
                schoolOptions.find(s => s.label === student?.school)?.value ??
                'escola-sao-paulo'

              const classValue =
                classOptions.find(c => c.label.startsWith(student?.class ?? ''))
                  ?.value ?? '7a'

              setValues(current => ({
                ...current,
                studentId,
                school: schoolValue,
                class: classValue,
              }))
            }}
            options={studentOptions}
            sx={selectSx}
            value={values.studentId}
          />
        </Box>

        <Box className="grid gap-1">
          <Typography sx={fieldLabelSx}>Escola de destino</Typography>
          <AppDropdown
            fullWidth
            onChange={e => handleChange('school', String(e.target.value))}
            options={schoolOptions}
            sx={selectSx}
            value={values.school}
          />
        </Box>

        <Box className="grid gap-1">
          <Typography sx={fieldLabelSx}>Turma de destino</Typography>
          <AppDropdown
            fullWidth
            onChange={e => handleChange('class', String(e.target.value))}
            options={classOptions}
            sx={selectSx}
            value={values.class}
          />
        </Box>

        {selectedStudent && (
          <Box
            sx={{
              backgroundColor: 'rgba(220, 53, 69, 0.06)',
              border: '1px solid',
              borderColor: 'rgba(220, 53, 69, 0.2)',
              borderRadius: '14px',
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
              {selectedStudent.label}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
              Vínculo atual: {school} · {studentClass}
            </Typography>
          </Box>
        )}
      </Box>
    </AppActionModal>
  )
}
