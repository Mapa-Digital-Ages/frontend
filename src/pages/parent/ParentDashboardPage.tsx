import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { parentService } from '@/services/parent.service'
import type { ParentChild, SummaryMetric } from '@/types/common'
import ParentChildCard from './components/ParentChildCard'

function ParentDashboardPage() {
  const [summary, setSummary] = useState<SummaryMetric[]>([])
  const [children, setChildren] = useState<ParentChild[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextSummary, nextChildren] = await Promise.all([
        parentService.getSummary(),
        parentService.getChildren(),
      ])

      if (!isActive) {
        return
      }

      setSummary(nextSummary)
      setChildren(nextChildren)
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
        eyebrow="Responsável"
        subtitle="Dashboard do responsável"
        title="Acompanhe o desempenho dos seus filhos"
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
            <Typography color="text.secondary" variant="body2">
              {metric.title}
            </Typography>
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
        {children.map(child => (
          <ParentChildCard child={child} key={child.id} />
        ))}
      </Box>
    </AppPageContainer>
  )
}

export default ParentDashboardPage
