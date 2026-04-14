import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import EmotionalContainer from '@/shared/ui/EmotionalContainer'

interface ChildRegistrationForm {
  grade: string
  name: string
  school: string
}

const emptyChildRegistrationForm: ChildRegistrationForm = {
  grade: '',
  name: '',
  school: '',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--app-radius-control)',
  },
}

export default function Page() {
  const [parentChildModalOpen, setParentChildModalOpen] = useState(false)
  const [childRegistrationForm, setChildRegistrationForm] =
    useState<ChildRegistrationForm>(emptyChildRegistrationForm)

  function updateChildRegistrationField(
    field: keyof ChildRegistrationForm,
    value: string
  ) {
    setChildRegistrationForm(current => ({
      ...current,
      [field]: value,
    }))
  }

  function closeParentChildModal() {
    setParentChildModalOpen(false)
  }

  function confirmParentChildRegistration() {
    setParentChildModalOpen(false)
    setChildRegistrationForm(emptyChildRegistrationForm)
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        subtitle="Cadastre e acompanhe os filhos vinculados ao seu perfil."
        title="Dashboard do Responsável"
        variant="responsavel"
      />

      <AppCard
        contentClassName="gap-4"
        sx={{
          maxWidth: 720,
        }}
      >
        <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Box className="min-w-0 space-y-1">
            <Typography
              sx={{ color: 'text.primary', fontSize: 22, fontWeight: 700 }}
            >
              Cadastro de filho
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
              Informe os dados do aluno para iniciar a vinculação ao seu perfil.
            </Typography>
          </Box>
          <AppButton
            onClick={() => setParentChildModalOpen(true)}
            sx={{ alignSelf: { md: 'center', xs: 'stretch' } }}
          >
            <Stack alignItems="center" direction="row" gap={1}>
              <AddRoundedIcon fontSize="small" />
              Cadastrar filho
            </Stack>
          </AppButton>
        </Box>
      </AppCard>

      <EmotionalContainer />

      <AppActionModal
        confirmLabel="Salvar cadastro"
        description="Preencha os dados iniciais do aluno."
        onClose={closeParentChildModal}
        onConfirm={confirmParentChildRegistration}
        open={parentChildModalOpen}
        title="Cadastrar filho"
      >
        <Stack gap={2}>
          <AppInput
            label="Nome do filho"
            onChange={event =>
              updateChildRegistrationField('name', event.target.value)
            }
            placeholder="Ex.: Lucas Silva"
            sx={inputSx}
            value={childRegistrationForm.name}
          />
          <AppInput
            label="Ano escolar"
            onChange={event =>
              updateChildRegistrationField('grade', event.target.value)
            }
            placeholder="Ex.: 7º ano"
            sx={inputSx}
            value={childRegistrationForm.grade}
          />
        </Stack>
      </AppActionModal>
    </AppPageContainer>
  )
}
