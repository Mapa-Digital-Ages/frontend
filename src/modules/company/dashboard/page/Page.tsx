import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Alert, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { HttpRequestError } from '@/shared/lib/http/client'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import MetricsCard from '@/shared/ui/MetricsCard'
import PageHeader from '@/shared/ui/PageHeader'
import { AppTag } from '@/shared/ui/AppTags'
import { companyDashboardService } from '../services/service'
import type { CompanyStat, TagContext } from '@/shared/types/common'
import type { IconVariantName } from '@/app/theme/core/palette'
import type { SupportedSchool, SupportRequest } from '../types/types'
import { getHoverStyle, getRolePalette } from '@/app/theme/core/roles'
import { useCompanyRole } from '@/modules/company/shared/hooks/useCompanyRole'
import AppInput from '@/shared/ui/AppInput'

const STATUS_MAP: Record<string, TagContext> = {
  aguardando: {
    id: 'aguardando',
    label: 'Aguardando Retorno',
    color: '#e65100',
  },
  pendente: {
    id: 'pendente',
    label: 'Aguardando Aprovação',
    color: '#e65100',
  },
  pending: {
    id: 'pending',
    label: 'Aguardando Aprovação',
    color: '#e65100',
  },
  apoiada: {
    id: 'apoiada',
    label: 'Apoiada',
    color: '#1b5e20',
  },
  recusada: {
    id: 'recusada',
    label: 'Recusada',
    color: '#b71c1c',
  },
}

async function resolveErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HttpRequestError) {
    const body = (await error.response?.json().catch(() => null)) as {
      detail?: string
    } | null

    return body?.detail ?? 'Não foi possível concluir a ação. Tente novamente.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível concluir a ação. Tente novamente.'
}

export default function Page() {
  const theme = useTheme()
  const [stats, setStats] = useState<CompanyStat[]>([])
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([])
  const [supportedSchools, setSupportedSchools] = useState<SupportedSchool[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [spotsByRequest, setSpotsByRequest] = useState<Record<string, string>>(
    {}
  )
  const [pendingRequest, setPendingRequest] = useState<SupportRequest | null>(
    null
  )
  const [isConfirming, setIsConfirming] = useState(false)
  const role = useCompanyRole()
  const accent = getRolePalette(theme, role)
  const hoverStyle = getHoverStyle(theme, accent.primary)

  async function refreshData() {
    const [nextRequests, nextSchools] = await Promise.all([
      companyDashboardService.getSupportRequests(),
      companyDashboardService.getSupportedSchools(),
    ])

    setSupportRequests(nextRequests)
    setSupportedSchools(nextSchools)
    setStats(companyDashboardService.getStats(nextSchools))
  }

  function getSpotsValue(request: SupportRequest) {
    return spotsByRequest[request.id] ?? String(request.remainingSpots)
  }

  function handleSpotsChange(requestId: string, value: string) {
    setSpotsByRequest(prev => ({
      ...prev,
      [requestId]: value,
    }))
  }

  function requestApproval(request: SupportRequest) {
    setErrorMessage('')

    const grantedSpots = Number(getSpotsValue(request))

    if (
      !Number.isInteger(grantedSpots) ||
      grantedSpots < 1 ||
      grantedSpots > request.remainingSpots
    ) {
      setErrorMessage(
        `Informe um número de vagas entre 1 e ${request.remainingSpots}.`
      )
      return
    }

    setPendingRequest(request)
  }

  async function confirmApproval() {
    if (!pendingRequest) {
      return
    }

    const request = pendingRequest
    const grantedSpots = Number(getSpotsValue(request))

    setIsConfirming(true)

    try {
      await companyDashboardService.acceptRequest(request, grantedSpots)
      setSpotsByRequest(prev => {
        const next = { ...prev }
        delete next[request.id]
        return next
      })
      setPendingRequest(null)
      await refreshData()
    } catch (error) {
      setPendingRequest(null)
      setErrorMessage(await resolveErrorMessage(error))
    } finally {
      setIsConfirming(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      try {
        const [nextRequests, nextSchools] = await Promise.all([
          companyDashboardService.getSupportRequests(),
          companyDashboardService.getSupportedSchools(),
        ])

        if (!isActive) {
          return
        }

        setSupportRequests(nextRequests)
        setSupportedSchools(nextSchools)
        setStats(companyDashboardService.getStats(nextSchools))
      } catch (error) {
        const message = await resolveErrorMessage(error)

        if (isActive) {
          setErrorMessage(message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  const getStatById = (id: CompanyStat['id']) =>
    stats.find(stat => stat.id === id)

  const schoolsStat = getStatById('supported-schools')
  const studentsStat = getStatById('impacted-students')

  const cards = [
    {
      icon: <AccountBalanceRoundedIcon />,
      iconVariant: 'purple' as IconVariantName,
      id: 'supported-schools',
      title: 'Escolas Apoiadas',
      value: schoolsStat?.value ?? '0',
    },
    {
      icon: <SchoolRoundedIcon />,
      iconVariant: 'blue' as IconVariantName,
      id: 'impacted-students',
      title: 'Alunos Impactados',
      value: studentsStat?.value ?? '0',
    },
  ]

  return (
    <AppPageContainer
      className="gap-4 md:gap-5"
      data-testid="company-dashboard"
    >
      <PageHeader
        title={companyDashboardService.getTitle()}
        subtitle="Acompanhe indicadores de resultado e investimento social"
        variant="company"
      />

      {errorMessage ? (
        <Alert
          data-testid="company-dashboard-error"
          icon={false}
          severity="error"
          variant="outlined"
          sx={{ borderRadius: '10px', fontSize: 14 }}
        >
          {errorMessage}
        </Alert>
      ) : null}

      <Box
        className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
        data-testid="metrics-section"
      >
        {cards.map(card => (
          <MetricsCard
            contentClassName="p-5"
            data-testid={`metric-card-${card.id}`}
            key={card.id}
            {...card}
          />
        ))}
      </Box>

      <Box className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppCard
          contentSx={{ maxHeight: 400, overflowY: 'auto' }}
          data-testid="support-requests-section"
          sx={{
            '& .MuiCardHeader-root': {
              px: { xs: 3, md: 3.5 },
              pt: { xs: 3, md: 3.5 },
              pb: 0,
            },
          }}
          title="Solicitações de Apoio"
          titleClassName="text-2xl font-bold md:text-3xl"
          action={
            <AppTag
              size="sm"
              tag={{
                id: 'support-requests-count',
                label: String(supportRequests.length),
                color: accent.primary,
              }}
            />
          }
        >
          {supportRequests.map(request => (
            <Box
              className="flex items-start justify-between rounded-2xl p-4"
              data-testid={`support-request-${request.id}`}
              key={request.id}
              sx={{
                backgroundColor: theme.palette.background.paper,
                border: '1px solid',
                borderColor: theme.palette.background.border,
                transition:
                  'background-color 0.15s ease, border-color 0.15s ease',
                '&:hover': hoverStyle,
              }}
            >
              <Box className="min-w-0 flex-1">
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: 18, xs: 16 },
                    fontWeight: 600,
                  }}
                >
                  {request.schoolName}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {request.title}
                </Typography>
                {request.description ? (
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: 14,
                    }}
                  >
                    {request.description}
                  </Typography>
                ) : null}
                <Typography
                  data-testid={`support-request-spots-${request.id}`}
                  sx={{
                    color: accent.primary,
                    fontSize: 13,
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {request.remainingSpots} vaga(s) disponível(is)
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <AppTag
                    size="sm"
                    tag={
                      STATUS_MAP[request.status] ?? {
                        id: request.status,
                        label: request.status,
                      }
                    }
                  />
                </Box>
              </Box>
              <Box className="flex flex-col items-end shrink-0">
                <AppInput
                  data-testid={`spots-input-${request.id}`}
                  inputMode="numeric"
                  label="Vagas"
                  onChange={e =>
                    handleSpotsChange(
                      request.id,
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  inputSize="small"
                  value={getSpotsValue(request)}
                  sx={{
                    width: 80,
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      fontSize: 14,
                    },
                  }}
                />
                <AppButton
                  data-testid={`approve-request-${request.id}`}
                  onClick={() => requestApproval(request)}
                  size="small"
                  sx={{ gap: 0.5, fontSize: 12, px: 1.5, py: 0.4, mt: 2 }}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14 }} />
                  Aceitar apoio
                </AppButton>
              </Box>
            </Box>
          ))}
        </AppCard>

        <AppCard
          contentSx={{ maxHeight: 400, overflowY: 'auto' }}
          data-testid="supported-schools-section"
          sx={{
            '& .MuiCardHeader-root': {
              px: { xs: 3, md: 3.5 },
              pt: { xs: 3, md: 3.5 },
              pb: 0,
            },
          }}
          title="Escolas Apoiadas"
          titleClassName="text-2xl font-bold md:text-3xl"
          action={
            <AppTag
              size="sm"
              tag={{
                id: 'supported-schools-count',
                label: String(supportedSchools.length),
                color: accent.primary,
              }}
            />
          }
        >
          {supportedSchools.map(school => (
            <Box
              className="flex items-center justify-between rounded-2xl p-4"
              data-testid={`supported-school-${school.id}`}
              key={school.id}
              sx={{
                backgroundColor: theme.palette.background.paper,
                border: '1px solid',
                borderColor: theme.palette.background.border,
                transition:
                  'background-color 0.15s ease, border-color 0.15s ease',
                '&:hover': hoverStyle,
              }}
            >
              <Box className="min-w-0 flex-1">
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: 18, xs: 16 },
                    fontWeight: 600,
                  }}
                >
                  {school.schoolName}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                  }}
                >
                  {school.description}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <AppTag
                    size="sm"
                    tag={
                      STATUS_MAP[school.status] ?? {
                        id: school.status,
                        label: school.status,
                      }
                    }
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </AppCard>
      </Box>

      <AppActionModal
        cancelLabel="Cancelar"
        confirmLabel="Aceitar apoio"
        confirmTone="success.main"
        description={
          pendingRequest
            ? `Você está prestes a apoiar ${pendingRequest.schoolName}.`
            : undefined
        }
        loading={isConfirming}
        mode="confirm"
        onClose={() => setPendingRequest(null)}
        onConfirm={() => void confirmApproval()}
        open={pendingRequest !== null}
        title="Confirmar apoio"
      >
        {pendingRequest ? (
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
            Confirmar a doação de {getSpotsValue(pendingRequest)} vaga(s) para a
            solicitação “{pendingRequest.title}”?
          </Typography>
        ) : null}
      </AppActionModal>
    </AppPageContainer>
  )
}
