import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { studentService } from '@/services/student.service'
import type { StudentTask } from '@/types/common'
import StudentTaskList from './components/StudentTaskList'

function StudentTasksPage() {
  const [tasks, setTasks] = useState<StudentTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const nextTasks = await studentService.getTasks()

      if (!isActive) {
        return
      }

      setTasks(nextTasks)
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
        eyebrow="Aluno"
        subtitle="Lista de tarefas do aluno"
        title="Planejamento de atividades"
      />

      <StudentTaskList tasks={tasks} title="Lista completa de tarefas" />
    </AppPageContainer>
  )
}

export default StudentTasksPage
