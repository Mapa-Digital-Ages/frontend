import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useState } from 'react'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import AppCard from '@/shared/ui/AppCard'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppButton from '@/shared/ui/AppButton'

const supportTypeOptions = [
  { label: 'Pedagógico', value: 'Pedagógico' },
  { label: 'Socioemocional', value: 'Socioemocional' },
  { label: 'Técnico', value: 'Técnico' },
]

const priorityOptions = [
  { label: 'Baixa', value: 'Baixa' },
  { label: 'Média', value: 'Média' },
  { label: 'Alta', value: 'Alta' },
]

export default function Page() {
  const [supportType, setSupportType] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [supportTypeTouched, setSupportTypeTouched] = useState(false)
  const [priorityTouched, setPriorityTouched] = useState(false)
  const [descriptionTouched, setDescriptionTouched] = useState(false)

  const isSupportTypeInvalid = supportTypeTouched && !supportType
  const isPriorityInvalid = priorityTouched && !priority
  const isDescriptionInvalid = descriptionTouched && !description.trim()

  const isValid =
    supportType !== '' && priority !== '' && description.trim() !== ''

  function handleSubmit() {
    setSupportTypeTouched(true)
    setPriorityTouched(true)
    setDescriptionTouched(true)

    if (!isValid) {
      return
    }

    setSupportType('')
    setPriority('')
    setDescription('')
    setSupportTypeTouched(false)
    setPriorityTouched(false)
    setDescriptionTouched(false)
  }

  return (
    <AppPageContainer data-testid="support-page" className="gap-4">
      <PageHeader
        title="Escola | Solicitação de Apoio"
        subtitle="Abra solicitações pedagógicas, socioemocionais e técnicas."
        variant="enterpriseSchool"
      />

      <AppCard>
        <Typography
          sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', mb: 3 }}
        >
          Abrir solicitação de apoio
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppDropdown
              data-testid="support-type-select"
              label="Tipo de apoio"
              placeholder="Selecione o tipo de apoio"
              value={supportType}
              onChange={e => {
                setSupportType(e.target.value as string)
                setSupportTypeTouched(true)
              }}
              options={supportTypeOptions}
              fullWidth
              error={isSupportTypeInvalid}
              helperText={isSupportTypeInvalid ? 'Campo obrigatório' : ''}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppDropdown
              data-testid="priority-select"
              label="Prioridade"
              placeholder="Selecione a prioridade"
              value={priority}
              onChange={e => {
                setPriority(e.target.value as string)
                setPriorityTouched(true)
              }}
              options={priorityOptions}
              fullWidth
              error={isPriorityInvalid}
              helperText={isPriorityInvalid ? 'Campo obrigatório' : ''}
            />
          </Box>
        </Box>

        <AppInput
          data-testid="description-input"
          label="Descrição"
          value={description}
          onChange={e => {
            setDescription(e.target.value)
            setDescriptionTouched(true)
          }}
          placeholder="Escreva o cenário, turma(s) impactada(s) e objetivo do apoio..."
          multiline
          rows={4}
          inputSize="large"
          error={isDescriptionInvalid}
          helperText={isDescriptionInvalid ? 'Campo obrigatório' : ''}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': { height: 'auto !important' },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AppButton
            data-testid="submit-button"
            label="Enviar solicitação"
            onClick={handleSubmit}
            sx={{
              width: 'fit-content',
              cursor: 'pointer',
              ...(!isValid && {
                opacity: 0.6,
                backgroundColor: 'action.disabledBackground',
                color: 'text.disabled',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'action.disabledBackground',
                  borderColor: 'transparent',
                },
              }),
            }}
          />

          <Box
            data-testid="deadline-alert"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(251, 188, 4, 0.1)',
              borderRadius: '10px',
              px: 2,
              py: 1.25,
            }}
          >
            <InfoOutlinedIcon
              sx={{ color: '#b37a00', fontSize: 18, flexShrink: 0 }}
            />
            <Typography
              sx={{ fontSize: 13, color: '#b37a00', fontWeight: 500 }}
            >
              Prazo médio de resposta: até 24h úteis.
            </Typography>
          </Box>
        </Box>
      </AppCard>
    </AppPageContainer>
  )
}
