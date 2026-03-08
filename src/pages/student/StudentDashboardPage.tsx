import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppButton from '@/components/ui/AppButton'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { APP_ROUTES } from '@/constants/routes'
import { studentService } from '@/services/student.service'
import type { StudentTask, SummaryMetric } from '@/types/common'
import StudentSummaryCard from './components/StudentSummaryCard'
import StudentTaskList from './components/StudentTaskList'

function StudentDashboardPage() {
  const [summary, setSummary] = useState<SummaryMetric[]>([])
  const [tasks, setTasks] = useState<StudentTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const [nextSummary, nextTasks] = await Promise.all([
        studentService.getSummary(),
        studentService.getTasks(),
      ])

      if (!isActive) {
        return
      }

      setSummary(nextSummary)
      setTasks(nextTasks.slice(0, 3))
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
        actions={
          <AppButton
            component={RouterLink}
            to={APP_ROUTES.student.tasks}
            variant="outlined"
          >
            Ver todas as tarefas
          </AppButton>
        }
        eyebrow="Aluno"
        subtitle="Dashboard do aluno"
        title="Seu progresso da semana"
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { md: 'repeat(2, 1fr)', xs: '1fr' },
        }}
      >
        {summary.map(metric => (
          <StudentSummaryCard key={metric.id} metric={metric} />
        ))}
      </Box>

      <StudentTaskList tasks={tasks} />
    </AppPageContainer>
  )
}

export default StudentDashboardPage
