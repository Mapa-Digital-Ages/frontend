import { Alert, Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import AppButton from '@/shared/ui/AppButton'
import { HttpRequestError } from '@/shared/lib/http/client'
import { requestPartnerService } from '../services/service'
import { useState } from 'react'

export default function Page() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [spots, setSpots] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    spots?: string
  }>({})

  function validate(): { title?: string; spots?: string } {
    const errors: { title?: string; spots?: string } = {}
    if (!title.trim()) {
      errors.title = 'Informe um título para a solicitação.'
    }
    const parsedSpots = Number(spots)
    if (!spots.trim() || !Number.isInteger(parsedSpots) || parsedSpots <= 0) {
      errors.spots = 'Informe um número de vagas maior que zero.'
    }
    return errors
  }

  async function handleSubmit() {
    setErrorMessage('')
    setSuccessMessage('')

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await requestPartnerService.createRequest({
        title: title.trim(),
        description: description.trim(),
        requestedSpots: Number(spots),
      })
      setTitle('')
      setDescription('')
      setSpots('')
      setSuccessMessage('Solicitação enviada com sucesso!')
    } catch (error) {
      if (error instanceof HttpRequestError) {
        const body = (await error.response?.json().catch(() => null)) as {
          detail?: string
        } | null
        setErrorMessage(
          body?.detail ??
            'Não foi possível enviar a solicitação. Tente novamente.'
        )
      } else if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(
          'Não foi possível enviar a solicitação. Tente novamente.'
        )
      }
    } finally {
      setSubmitting(false)
    }
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
          error={Boolean(fieldErrors.title)}
          helperText={fieldErrors.title || ' '}
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

        <AppInput
          label="Número de vagas"
          value={spots}
          onChange={e => setSpots(e.target.value.replace(/\D/g, ''))}
          placeholder="Ex.: 10"
          inputMode="numeric"
          error={Boolean(fieldErrors.spots)}
          helperText={fieldErrors.spots || ' '}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {successMessage ? (
            <Alert
              icon={false}
              severity="success"
              variant="outlined"
              sx={{ borderRadius: '10px', fontSize: 14 }}
            >
              {successMessage}
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert
              icon={false}
              severity="error"
              variant="outlined"
              sx={{ borderRadius: '10px', fontSize: 14 }}
            >
              {errorMessage}
            </Alert>
          ) : null}

          <AppButton
            label={submitting ? 'Enviando…' : 'Enviar solicitação'}
            onClick={handleSubmit}
            disabled={submitting}
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
