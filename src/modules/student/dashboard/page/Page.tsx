import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import Planner from '@/modules/student/shared/components/Planner'
import type { Task } from '@/modules/student/shared/components/Planner'
import SubjectBaseCard from '@/modules/student/shared/components/SubjectBaseCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmotionalContainer from '@/shared/ui/EmotionalContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SUBJECTS, getSubjectTagContextByLabel } from '@/shared/utils/themes'
import { studentService } from '@/modules/student/dashboard/services/service'
import { studentService as routineService } from '@/modules/student/routine/services/service'
import { authService } from '@/app/auth/core/service'

function mapApiTask(t: Task): Task {
  const resolvedSubject =
    getSubjectTagContextByLabel(t.subject?.label) ||
    (t.subject?.id != null
      ? getSubjectTagContextByLabel(String(t.subject.id))
      : undefined) ||
    t.subject

  const rawDate = t.date as unknown
  let parsedDate: Date
  if (typeof rawDate === 'string') {
    const dateOnly = (rawDate as string).substring(0, 10)
    parsedDate = new Date(`${dateOnly}T00:00:00`)
  } else if (t.date instanceof Date) {
    parsedDate = t.date
  } else {
    parsedDate = new Date()
  }

  const mapped = {
    ...t,
    id: String(t.id),
    date: parsedDate,
    subject: resolvedSubject,
  }

  if (mapped.id && (!mapped.subject || !mapped.subject.label)) {
    const cached = localStorage.getItem(`task-subj-${mapped.id}`)
    if (cached) {
      try {
        mapped.subject = JSON.parse(cached)
      } catch (e) {
        console.error('Error parsing cached subject:', e)
      }
    }
  }

  return mapped
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [studentClassLabel, setStudentClassLabel] = useState<string>()

  useEffect(() => {
    let isMounted = true

    const studentId = authService.getUserId()
    if (studentId) {
      setLoadingTasks(true)
      routineService
        .getTasks(studentId)
        .then(data => {
          if (isMounted) {
            setTasks(data.map(mapApiTask))
          }
        })
        .catch(err => {
          console.error('Erro ao buscar tarefas semanais:', err)
        })
        .finally(() => {
          if (isMounted) {
            setLoadingTasks(false)
          }
        })
    }

    void studentService
      .getCurrentStudentClassLabel()
      .then(label => {
        if (isMounted) {
          setStudentClassLabel(label)
        }
      })
      .catch(() => {
        if (isMounted) {
          setStudentClassLabel(undefined)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="aluno"
        title="Continue sua jornada no Mapa Digital"
        subtitle="Progresso até o próximo nível:"
        tag={studentClassLabel}
        progress={85}
      />

      <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SubjectBaseCard
          icon={<MenuBookRoundedIcon fontSize="medium" />}
          progress={78}
          subject={SUBJECTS.portugues}
          title="Português"
        />

        <SubjectBaseCard
          icon={<CalculateRoundedIcon fontSize="medium" />}
          progress={55}
          subject={SUBJECTS.matematica}
          title="Matemática"
        />

        <SubjectBaseCard
          icon={<PublicRoundedIcon fontSize="medium" />}
          progress={20}
          subject={SUBJECTS.geografia}
          title="Geografia"
        />
      </Box>

      <Box className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Box className="min-w-0">
          <Planner tasks={tasks} loading={loadingTasks} />
        </Box>

        <Box className="w-full max-w-none lg:max-w-[600px]">
          <EmotionalContainer />
        </Box>
      </Box>
    </AppPageContainer>
  )
}
