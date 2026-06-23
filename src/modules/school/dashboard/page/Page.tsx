import { Box, Typography } from '@mui/material'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AppCard from '@/shared/ui/AppCard'
import ProgressBar from '@/shared/ui/ProgressBar'
import { useEffect, useState } from 'react'
import { schoolDashboardService } from '../services/service'
import type { SchoolDashboardData } from '../types/types'
import { AppSubjectTag } from '@/shared/ui/AppSubjectsTags'
import { SUBJECTS, getSubjectTagContextByLabel } from '@/shared/utils/themes'

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
                  {cls.studentCount} alunos
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {cls.disciplines.map(item => {
                const subject = getSubjectTagContextByLabel(
                  item.subjectLabel
                ) ??
                  SUBJECTS[item.subjectId] ?? {
                    id: item.subjectId,
                    label: item.subjectLabel,
                    color: item.subjectColor ?? undefined,
                  }
                return (
                  <ProgressBar
                    key={item.subjectId}
                    headerSlot={<AppSubjectTag size="sm" subject={subject} />}
                    subject={subject}
                    value={item.progress}
                    valueLabelVariant="subject"
                    valueLabel={`Progresso: ${item.progress}%`}
                  />
                )
              })}
            </Box>
          </AppCard>
        ))}
      </Box>
    </AppPageContainer>
  )
}
