import { Box, Typography } from '@mui/material'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AppCard from '@/shared/ui/AppCard'
import ProgressBar from '@/shared/ui/ProgressBar'
import { useEffect, useState } from 'react'
import { schoolDashboardService } from '../services/service'
import type { SchoolDashboardData } from '../types/types'

export default function Page() {
  const [data, setData] = useState<SchoolDashboardData | null>(null)

  useEffect(() => {
    void schoolDashboardService.getDashboardData().then(setData)
  }, [])

  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title={schoolDashboardService.getTitle()}
        subtitle="Visão geral da operação e desempenho"
        variant="school"
      />

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <MetricsCard
          title="Total de Alunos"
          value={data?.totalStudents ?? '—'}
          icon={<SchoolRoundedIcon />}
          iconVariant="green"
        />
        <MetricsCard
          title="Turmas Ativas"
          value={data?.activeClasses ?? '—'}
          icon={<PeopleAltRoundedIcon />}
          iconVariant="purple"
        />
      </Box>

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {(data?.classes ?? []).map(cls => (
          <AppCard key={cls.id} sx={{ cursor: 'pointer' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: 20, fontWeight: 700, color: 'text.primary' }}
                >
                  {cls.grade}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}
                >
                  {cls.studentCount} alunos · Tutor: {cls.tutorName}
                </Typography>
              </Box>
            </Box>
            <ProgressBar
              label="Progresso da trilha"
              value={cls.progress}
              valueLabelVariant="plain"
            />
          </AppCard>
        ))}
      </Box>
    </AppPageContainer>
  )
}
