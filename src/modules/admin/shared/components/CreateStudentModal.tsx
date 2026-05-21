import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import type { BoxProps } from '@mui/material'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
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

const riskOptions = [
  { label: 'Baixo', value: 'baixo' },
  { label: 'Médio', value: 'medio' },
  { label: 'Alto', value: 'alto' },
]

const statusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
]

interface CreateStudentModalProps extends BoxProps {
  open: boolean
  onClose: () => void
  onConfirm: (values: StudentFormValues) => void
}

export interface StudentFormValues {
  name: string
  school: string
  class: string
  guardian: string
  risk: string
  frequency: string
  average: string
  status: string
}

function getDefaultValues(): StudentFormValues {
  return {
    name: '',
    school: 'escola-sao-paulo',
    class: 'none',
    guardian: '',
    risk: 'baixo',
    frequency: '',
    average: '',
    status: 'ativo',
  }
}

export default function CreateStudentModal({
  open,
  onClose,
  onConfirm,
  ...props
}: CreateStudentModalProps) {
  const theme = useTheme()
  const [values, setValues] = useState<StudentFormValues>(getDefaultValues())

  function handleChange(field: keyof StudentFormValues, value: string) {
    setValues(current => ({ ...current, [field]: value }))
  }

  function handleConfirm() {
    onConfirm(values)
    setValues(getDefaultValues())
  }

  function handleClose() {
    setValues(getDefaultValues())
    onClose()
  }

  return (
    <AppActionModal
      {...props}
      confirmLabel="Criar aluno"
      description="Cadastre um novo aluno e vincule a uma turma, se desejar."
      disableConfirm={!values.name.trim()}
      maxWidth="sm"
      mode="form"
      onClose={handleClose}
      onConfirm={handleConfirm}
      open={open}
      title="Criar aluno"
      confirmColor={theme.palette.error.main}
    >
      <Box className="grid gap-3">
        <AppInput
          label="Nome do aluno"
          labelSx={fieldLabelSx}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Ex.: Sofia Almeida"
          sx={inputSx}
          value={values.name}
        />

        <Box className="grid gap-1">
          <AppDropdown
            fullWidth
            label="Escola"
            onChange={e => handleChange('school', String(e.target.value))}
            options={schoolOptions}
            sx={selectSx}
            value={values.school}
          />
        </Box>

        <Box className="grid gap-1">
          <AppDropdown
            fullWidth
            label="Turma"
            onChange={e => handleChange('class', String(e.target.value))}
            options={classOptions}
            sx={selectSx}
            value={values.class}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          }}
        >
          <AppInput
            label="Responsável"
            labelSx={fieldLabelSx}
            onChange={e => handleChange('guardian', e.target.value)}
            placeholder="Ex.: Camila Almeida"
            sx={inputSx}
            value={values.guardian}
          />
          <Box className="grid gap-1">
            <AppDropdown
              fullWidth
              label="Risco"
              onChange={e => handleChange('risk', String(e.target.value))}
              options={riskOptions}
              sx={selectSx}
              value={values.risk}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
          }}
        >
          <AppInput
            label="Frequência"
            labelSx={fieldLabelSx}
            onChange={e => handleChange('frequency', e.target.value)}
            placeholder="95"
            sx={inputSx}
            value={values.frequency}
          />
          <AppInput
            label="Média"
            labelSx={fieldLabelSx}
            onChange={e => handleChange('average', e.target.value)}
            placeholder="7"
            sx={inputSx}
            value={values.average}
          />
          <Box className="grid gap-1">
            <AppDropdown
              fullWidth
              label="Status"
              onChange={e => handleChange('status', String(e.target.value))}
              options={statusOptions}
              sx={selectSx}
              value={values.status}
            />
          </Box>
        </Box>
      </Box>
    </AppActionModal>
  )
}
