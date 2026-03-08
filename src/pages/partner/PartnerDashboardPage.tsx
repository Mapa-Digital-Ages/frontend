import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { partnerService } from '@/services/partner.service'
import type { PartnerProject, SummaryMetric } from '@/types/common'
import PartnerProjectCard from './components/PartnerProjectCard'

function PartnerDashboardPage() {
  const [summary, setSummary] = useState<SummaryMetric[]>([])
  const [projects, setProjects] = useState<PartnerProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextSummary, nextProjects] = await Promise.all([
        partnerService.getSummary(),
        partnerService.getProjects(),
      ])

      if (!isActive) {
        return
      }

      setSummary(nextSummary)
      setProjects(nextProjects)
      setIsLoading(false)
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer>
      <PageHeader
        eyebrow="Parceiro"
        subtitle="Estrutura demonstrativa para parceiros acompanharem projetos e impacto."
        title="Projetos e expansão da rede"
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { md: 'repeat(2, 1fr)', xs: '1fr' },
        }}
      >
        {summary.map(metric => (
          <AppCard key={metric.id}>
            <Typography color="text.secondary">{metric.title}</Typography>
            <Typography sx={{ my: 1 }} variant="h3">
              {metric.value}
            </Typography>
            <Typography color="text.secondary">{metric.helperText}</Typography>
          </AppCard>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { md: 'repeat(2, 1fr)', xs: '1fr' },
        }}
      >
        {projects.map(project => (
          <PartnerProjectCard key={project.id} project={project} />
        ))}
      </Box>
    </AppPageContainer>
  )
}

export default PartnerDashboardPage
