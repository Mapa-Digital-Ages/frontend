import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppCard from '@/components/ui/AppCard'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { schoolService } from '@/services/school.service'
import type { SchoolStudent, SummaryMetric } from '@/types/common'
import SchoolStudentTable from './components/SchoolStudentTable'

function SchoolDashboardPage() {
  const [summary, setSummary] = useState<SummaryMetric[]>([])
  const [students, setStudents] = useState<SchoolStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextSummary, nextStudents] = await Promise.all([
        schoolService.getSummary(),
        schoolService.getStudents(),
      ])

      if (!isActive) {
        return
      }

      setSummary(nextSummary)
      setStudents(nextStudents)
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
        eyebrow="Escola"
        subtitle="Dashboard da escola"
        title="Indicadores institucionais"
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

      <SchoolStudentTable students={students} />
    </AppPageContainer>
  )
}

export default SchoolDashboardPage
