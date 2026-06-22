import { useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { getRolePalette } from '@/app/theme/core/roles'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'

type SupportRequest = {
  id: string
  schoolName: string
  description: string
}

export default function Page() {
  const theme = useTheme()
  const accent = getRolePalette(theme, 'escola_empresa')

  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([
    {
      id: '1',
      schoolName: 'Escola São Paulo',
      description: 'Solicitação de apoio para 200 alunos.',
    },
    {
      id: '2',
      schoolName: 'Escola Porto Alegre',
      description: 'Solicitação de apoio para 170 alunos.',
    },
  ])

  const [supportedSchools, setSupportedSchools] = useState<SupportRequest[]>([
    {
      id: '3',
      schoolName: 'Escola Canoas',
      description: 'Parceria aprovada e em andamento.',
    },
  ])

  function handleApprove(id: string) {
    const request = supportRequests.find(item => item.id === id)

    if (!request) {
      return
    }

    setSupportedSchools(current => [...current, request])

    setSupportRequests(current => current.filter(item => item.id !== id))
  }

  function handleReject(id: string) {
    setSupportRequests(current => current.filter(item => item.id !== id))
  }

  const impactedStudents = supportedSchools.length * 200

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="enterpriseSchool"
        title="Parcerias e Impacto Educacional"
        subtitle="Acompanhe indicadores de resultado e investimento social."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 2,
        }}
      >
        <AppCard contentClassName="p-5">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography color="text.secondary">Escolas Apoiadas</Typography>

              <Typography
                sx={{
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {supportedSchools.length}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: alpha(accent.primary, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccountBalanceIcon
                sx={{
                  color: accent.primary,
                }}
              />
            </Box>
          </Box>
        </AppCard>

        <AppCard contentClassName="p-5">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography color="text.secondary">Alunos Impactados</Typography>

              <Typography
                sx={{
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {impactedStudents}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: alpha(accent.primary, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SchoolRoundedIcon
                sx={{
                  color: accent.primary,
                }}
              />
            </Box>
          </Box>
        </AppCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },
          gap: 2,
        }}
      >
        <AppCard contentClassName="p-5">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Solicitações de Apoio
            </Typography>

            <Typography
              sx={{
                color: accent.primary,
                fontWeight: 700,
              }}
            >
              {supportRequests.length}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {supportRequests.map(request => (
              <Box
                key={request.id}
                sx={{
                  border: `1px solid ${theme.palette.background.border}`,
                  borderRadius: '16px',
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>
                      {request.schoolName}
                    </Typography>

                    <Typography color="text.secondary" fontSize={13}>
                      {request.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleApprove(request.id)}
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0.5,
                        border: '1px solid',
                        borderColor: alpha('#22C55E', 0.3),
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: 18,
                          color: '#22C55E',
                        }}
                      />
                    </IconButton>

                    <IconButton
                      onClick={() => handleReject(request.id)}
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0.5,
                        border: '1px solid',
                        borderColor: alpha('#EF4444', 0.3),
                      }}
                    >
                      <CancelRoundedIcon
                        sx={{
                          fontSize: 18,
                          color: '#EF4444',
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </AppCard>

        <AppCard contentClassName="p-5">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Escolas Apoiadas
            </Typography>

            <Typography
              sx={{
                color: accent.primary,
                fontWeight: 700,
              }}
            >
              {supportedSchools.length}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {supportedSchools.map(school => (
              <Box
                key={school.id}
                sx={{
                  border: `1px solid ${theme.palette.background.border}`,
                  borderRadius: '16px',
                  p: 2,
                }}
              >
                <Typography fontWeight={700}>{school.schoolName}</Typography>

                <Typography color="text.secondary" fontSize={13}>
                  {school.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </AppCard>
      </Box>
    </AppPageContainer>
  )
}
