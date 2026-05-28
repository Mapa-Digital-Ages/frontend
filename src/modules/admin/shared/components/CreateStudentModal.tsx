import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import type { BoxProps } from '@mui/material'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import { isValidEmail, hasMinLength } from '@/shared/utils/validators'
import {
  studentFormOptionsService,
  yearOptions,
  type SchoolOption,
  type GuardianOption,
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

const statusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
]

const NONE_VALUE = 'none'
const NONE_OPTION = { label: 'Nenhum', value: NONE_VALUE }

interface CreateStudentModalProps extends BoxProps {
  open: boolean
  onClose: () => void
  onConfirm: (values: StudentFormValues) => void
  apiError?: string | null
  defaultSchool?: SchoolOption | null
  confirmColor?: string
}

export interface StudentFormValues {
  name: string
  email: string
  password: string
  school: string
  guardian: string
  guardianName: string
  year: string
  status: string
  birthDate: string
}

type FormErrors = Partial<Record<keyof StudentFormValues, string>>

function getDefaultValues(defaultSchoolId?: string | null): StudentFormValues {
  return {
    name: '',
    email: '',
    password: '',
    school: defaultSchoolId || NONE_VALUE,
    guardian: NONE_VALUE,
    guardianName: '',
    year: yearOptions[0].value,
    status: 'ativo',
    birthDate: '',
  }
}

export default function CreateStudentModal({
  open,
  onClose,
  onConfirm,
  apiError,
  defaultSchool = null,
  confirmColor: confirmColorProp,
  ...props
}: CreateStudentModalProps) {
  const theme = useTheme()
  const confirmColor = confirmColorProp ?? theme.palette.error.main
  const defaultSchoolId = defaultSchool?.value ?? null
  const [values, setValues] = useState<StudentFormValues>(() =>
    getDefaultValues(defaultSchoolId)
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const [schools, setSchools] = useState<SchoolOption[]>([])
  const [guardians, setGuardians] = useState<GuardianOption[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingOptions(true)
    void Promise.all([
      studentFormOptionsService.getSchools(),
      studentFormOptionsService.getGuardians(),
    ]).then(([schoolList, guardianList]) => {
      setSchools(schoolList)
      setGuardians(guardianList)
      setIsLoadingOptions(false)
    })
  }, [open])

  const hasSchool = values.school !== NONE_VALUE
  const hasGuardian = values.guardian !== NONE_VALUE
  const isLinked = hasSchool || hasGuardian

  function handleChange(field: keyof StudentFormValues, value: string) {
    setValues(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: undefined }))
  }

  function validate(): boolean {
    const next: FormErrors = {}

    if (!values.name.trim()) {
      next.name = 'Informe o nome do aluno.'
    }

    if (!isValidEmail(values.email)) {
      next.email = 'Informe um e-mail válido.'
    }

    if (!hasMinLength(values.password, 8)) {
      next.password = 'A senha deve ter pelo menos 8 caracteres.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleConfirm() {
    if (!validate() || !isLinked) return
    const guardianLabel =
      guardians.find(g => g.value === values.guardian)?.label ?? ''
    onConfirm({ ...values, guardianName: guardianLabel })
    setValues(getDefaultValues(defaultSchoolId))
    setErrors({})
  }

  function handleClose() {
    setValues(getDefaultValues(defaultSchoolId))
    setErrors({})
    onClose()
  }

  const resolvedSchools =
    defaultSchool && !schools.some(s => s.value === defaultSchool.value)
      ? [defaultSchool, ...schools]
      : schools

  const schoolDropdownOptions = [
    NONE_OPTION,
    ...resolvedSchools.map(s => ({ label: s.label, value: s.value })),
  ]

  const guardianDropdownOptions = [
    NONE_OPTION,
    ...guardians.map(g => ({ label: g.label, value: g.value })),
  ]

  const yearDropdownOptions = [...yearOptions]

  return (
    <AppActionModal
      {...props}
      confirmLabel="Criar aluno"
      description="Cadastre um novo aluno. Vincule-o a uma escola e/ou a um responsável"
      disableConfirm={!isLinked || isLoadingOptions}
      maxWidth="sm"
      mode="form"
      onClose={handleClose}
      onConfirm={handleConfirm}
      open={open}
      title="Criar aluno"
      confirmColor={confirmColor}
    >
      <Box className="grid gap-3">
        <AppInput
          label="Nome do aluno"
          labelSx={fieldLabelSx}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Ex.: Sofia Almeida"
          sx={inputSx}
          value={values.name}
          error={Boolean(errors.name)}
          helperText={errors.name ?? ' '}
        />

        <AppInput
          label="E-mail"
          labelSx={fieldLabelSx}
          onChange={e => handleChange('email', e.target.value)}
          placeholder="Ex.: voce@exemplo.com"
          sx={inputSx}
          type="email"
          value={values.email}
          error={Boolean(errors.email)}
          helperText={errors.email ?? ' '}
        />

        <AppInput
          label="Senha"
          labelSx={fieldLabelSx}
          onChange={e => handleChange('password', e.target.value)}
          placeholder="Mínimo 8 caracteres"
          sx={inputSx}
          type="password"
          value={values.password}
          error={Boolean(errors.password)}
          helperText={errors.password ?? ' '}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          }}
        >
          <AppInput
            label="Data de nascimento"
            labelSx={fieldLabelSx}
            onChange={e => handleChange('birthDate', e.target.value)}
            sx={inputSx}
            type="date"
            value={values.birthDate}
          />
          <AppDropdown
            fullWidth
            label="Ano"
            onChange={e => handleChange('year', String(e.target.value))}
            options={yearDropdownOptions}
            sx={selectSx}
            value={values.year}
          />
        </Box>
        <AppDropdown
          fullWidth
          label="Escola"
          disabled={isLoadingOptions}
          onChange={e => handleChange('school', String(e.target.value))}
          options={schoolDropdownOptions}
          sx={selectSx}
          value={values.school}
        />

        <AppDropdown
          fullWidth
          label="Responsável"
          onChange={e => handleChange('guardian', String(e.target.value))}
          options={guardianDropdownOptions}
          sx={selectSx}
          value={values.guardian}
        />

        <AppDropdown
          fullWidth
          label="Status"
          onChange={e => handleChange('status', String(e.target.value))}
          options={statusOptions}
          sx={selectSx}
          value={values.status}
        />

        {!isLinked && !isLoadingOptions && (
          <Box
            sx={{
              fontSize: { md: 12, xs: 11 },
              color: 'warning.main',
              fontWeight: 500,
            }}
          >
            Selecione ao menos uma <strong>escola</strong> ou um{' '}
            <strong>responsável</strong> para habilitar o cadastro.
          </Box>
        )}

        {apiError && (
          <Box
            sx={{
              borderRadius: '10px',
              color: 'error.main',
              fontSize: { md: 13, xs: 12 },
              fontWeight: 600,
              px: 1,
              py: 0.5,
            }}
          >
            ✕ {apiError}
          </Box>
        )}
      </Box>
    </AppActionModal>
  )
}
