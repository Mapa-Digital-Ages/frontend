import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import AppButton from '@/shared/ui/AppButton'
import AppTags from '@/shared/ui/AppTags'
import { HttpRequestError } from '@/shared/lib/http/client'
import { requestPartnerService } from '../services/service'
import type {
  SchoolPartnershipApi,
  SponsorshipRequestApi,
} from '../types/types'
import type { TagContext } from '@/shared/types/common'
import { useCallback, useEffect, useState } from 'react'

const PEDIDO_TAG: TagContext = { label: 'Pedido', color: '#1565c0' }

const PARTNERSHIP_TAGS: Record<string, TagContext> = {
  pending: { label: 'Aguardando Aprovação', color: '#e65100' },
  approved: { label: 'Aceito', color: '#1b5e20' },
}

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
  const [requests, setRequests] = useState<SponsorshipRequestApi[]>([])
  const [partnerships, setPartnerships] = useState<SchoolPartnershipApi[]>([])
  const [listsLoading, setListsLoading] = useState(true)
  const [listsError, setListsError] = useState('')

  const loadLists = useCallback(async () => {
    setListsError('')
    try {
      const [nextRequests, nextPartnerships] = await Promise.all([
        requestPartnerService.listRequests(),
        requestPartnerService.listPartnerships(),
      ])
      setRequests(nextRequests)
      setPartnerships(nextPartnerships)
    } catch {
      setListsError('Não foi possível carregar seus pedidos e parcerias.')
    } finally {
      setListsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    void (async () => {
      await loadLists()
      if (!isActive) {
        return
      }
    })()

    return () => {
      isActive = false
    }
  }, [loadLists])

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
      await loadLists()
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

  const openRequests = requests.filter(request => request.remaining_spots > 0)
  const visiblePartnerships = partnerships.filter(
    partnership => partnership.status in PARTNERSHIP_TAGS
  )
  const hasTracking = openRequests.length > 0 || visiblePartnerships.length > 0

  return (
    <AppPageContainer className="gap-4" data-testid="request-partner-page">
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

      <AppCard data-testid="tracking-section">
        <Typography
          sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', mb: 0.5 }}
        >
          Meus pedidos e parcerias
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}>
          Acompanhe as vagas pedidas, as vagas aceitas e o status de cada
          solicitação.
        </Typography>

        {listsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : listsError ? (
          <Alert
            icon={false}
            severity="error"
            variant="outlined"
            sx={{ borderRadius: '10px', fontSize: 14 }}
          >
            {listsError}
          </Alert>
        ) : !hasTracking ? (
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            Você ainda não possui pedidos em aberto ou parcerias.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {openRequests.length > 0 ? (
              <Box
                data-testid="open-requests"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  Pedidos em aberto
                </Typography>
                {openRequests.map(request => (
                  <Box
                    key={request.id}
                    data-testid={`request-card-${request.id}`}
                    sx={{
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: '12px',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 15, fontWeight: 700, minWidth: 0 }}
                      >
                        {request.title}
                      </Typography>
                      <AppTags size="sm" tags={[PEDIDO_TAG]} />
                    </Box>
                    {request.description ? (
                      <Typography
                        sx={{ fontSize: 13, color: 'text.secondary' }}
                      >
                        {request.description}
                      </Typography>
                    ) : null}
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                      {request.remaining_spots} de {request.requested_spots}{' '}
                      vagas ainda disponíveis para apoio
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : null}

            {visiblePartnerships.length > 0 ? (
              <Box
                data-testid="partnerships"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  Parcerias
                </Typography>
                {visiblePartnerships.map(partnership => (
                  <Box
                    key={partnership.id}
                    data-testid={`partnership-card-${partnership.id}`}
                    sx={{
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: '12px',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 15, fontWeight: 700, minWidth: 0 }}
                      >
                        {partnership.request_title}
                      </Typography>
                      <AppTags
                        size="sm"
                        tags={[PARTNERSHIP_TAGS[partnership.status]]}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                      {partnership.company_name}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                      {partnership.granted_spots} vagas aceitas
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>
        )}
      </AppCard>
    </AppPageContainer>
  )
}
