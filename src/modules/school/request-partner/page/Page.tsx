import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import AppButton from '@/shared/ui/AppButton'
import { useState } from 'react'

export default function Page() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit() {
    setTitle('')
    setDescription('')
  }

  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title="Solicitação de Parceiro"
        subtitle="Solicite apoio de uma Empresa Parceira"
        variant="school"
      />

      <AppCard>
        <Typography
          sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', mb: 1 }}
        >
          Abrir uma solicitação de apoio
        </Typography>

        <AppInput
          label="Titulo de apoio"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder=""
        />

        <AppInput
          label="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descreva o cenário, turma(s) impactada(s) e objetivo do apoio, conte sobre o tipo de apoio que necessitas…"
          multiline
          rows={4}
          inputSize="large"
          sx={{ '& .MuiOutlinedInput-root': { height: 'auto !important' } }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AppButton
            label="Enviar solicitação"
            onClick={handleSubmit}
            sx={{ width: 'fit-content' }}
          />

          <Box
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
