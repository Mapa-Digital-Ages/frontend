import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import Planner from '../../shared/components/Planner'
import AppCalendar from '../../shared/components/AppCalendar'
import { getSubjectTagContextByLabel } from '@/shared/utils/themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import type { Task } from '@/modules/student/shared/components/Planner'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import { studentService } from '../services/service'
import { authService } from '@/app/auth/core/service'

interface DBSubject {
  id: number
  slug: string | null
  name: string
}

const initialTasks: Task[] = []

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
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [dbSubjects, setDbSubjects] = useState<DBSubject[]>([])
  const isLoadingTasksRef = useRef(false)

  const studentId = authService.getUserId()

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const subjects = await studentService.listSubjects()
        setDbSubjects(subjects)
      } catch (error) {
        console.error('Erro ao carregar matérias:', error)
      }
    }
    fetchSubjects()
  }, [])

  const loadPlanner = useCallback(async (id: string) => {
    if (isLoadingTasksRef.current) return
    try {
      isLoadingTasksRef.current = true
      setIsLoadingTasks(true)
      setHasError(false)
      const data = await studentService.getTasks(id)
      const weekTasks = data.map(mapApiTask)

      // Merge: keep tasks from other weeks, replace only dates returned by API
      const returnedDates = new Set(
        weekTasks.map(t => dayjs(t.date).format('YYYY-MM-DD'))
      )
      setTasks(prev => [
        ...prev.filter(
          t => !returnedDates.has(dayjs(t.date).format('YYYY-MM-DD'))
        ),
        ...weekTasks,
      ])
    } catch (error) {
      setHasError(true)
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      isLoadingTasksRef.current = false
      setIsLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    if (studentId) {
      loadPlanner(studentId)
    }
  }, [studentId, loadPlanner])

  const handleConfirmTasksForDate = useCallback(
    async (dateStr: string, updatedDayTasks: Task[]) => {
      if (!studentId) return
      try {
        setIsLoadingTasks(true)
        setHasError(false)
        const payload = updatedDayTasks.map(t => {
          const numericId =
            typeof t.id === 'number' ||
            (!isNaN(Number(t.id)) && !t.id.toString().includes('-'))
              ? Number(t.id)
              : null

          // Try to find the DB subject by slug match OR by name match
          const dbSub = dbSubjects.find(
            s =>
              (s.slug &&
                t.subject.id &&
                s.slug.toLowerCase() === String(t.subject.id).toLowerCase()) ||
              (s.name &&
                t.subject.label &&
                s.name.toLowerCase() === t.subject.label.toLowerCase())
          )

          // subId must be a valid number — never send NaN to the backend
          const subId = dbSub ? dbSub.id : null

          return {
            id: numericId,
            title: t.title,
            task_status: t.status,
            subject_id: subId,
          }
        })
        const responseTasks = await studentService.syncCalendarDay(
          studentId,
          dateStr,
          payload
        )

        // Resolve subject details and save to localStorage
        const resolvedTasks: Task[] = responseTasks.map((rt, index) => {
          const matchedLocal =
            updatedDayTasks.find(lt => String(lt.id) === String(rt.id)) ||
            updatedDayTasks[index] ||
            updatedDayTasks.find(lt => lt.title === rt.title)

          const subject = matchedLocal
            ? matchedLocal.subject
            : { id: 'default', label: 'Geral', color: 'rgba(32, 109, 197, 1)' }

          if (rt.id && subject) {
            localStorage.setItem(`task-subj-${rt.id}`, JSON.stringify(subject))
          }

          return {
            ...rt,
            id: String(rt.id),
            date: new Date(`${dateStr}T00:00:00`),
            subject,
          }
        })

        setTasks(prev => [
          ...prev.filter(t => dayjs(t.date).format('YYYY-MM-DD') !== dateStr),
          ...resolvedTasks,
        ])

        await loadPlanner(studentId)
      } catch (error: unknown) {
        setHasError(true)
        const err = error as { response?: { data?: unknown }; message?: string }
        const msg = err?.response?.data ?? err?.message ?? String(error)
        console.error('Erro ao sincronizar tarefas do calendário:', msg)
      } finally {
        setIsLoadingTasks(false)
      }
    },
    [studentId, loadPlanner, dbSubjects]
  )

  const handleFetchTasksForDate = useCallback(
    async (dateStr: string): Promise<Task[]> => {
      if (!studentId) return []
      try {
        const data = await studentService.getTasksForDate(studentId, dateStr)
        return data.map(mapApiTask)
      } catch {
        return []
      }
    },
    [studentId]
  )

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Rotina, Foco e Bem-estar"
        subtitle="Organize sua rotina e acompanhe sinais emocionais em uma única tela"
      />

      {hasError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'error.main',
            backgroundColor: theme => alpha(theme.palette.error.main, 0.08),
            color: 'error.main',
          }}
        >
          <ErrorOutlineRoundedIcon />
          <Typography sx={{ fontWeight: 500 }}>
            Erro ao carregar as tarefas da rotina. Por favor, tente novamente
            mais tarde.
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            p: 3,
            backgroundColor: 'background.paper',
            overflowX: 'auto',
          }}
        >
          <AppCalendar
            tasks={tasks}
            onTasksChange={setTasks}
            onConfirmTasksForDate={handleConfirmTasksForDate}
            onFetchTasksForDate={handleFetchTasksForDate}
          />
        </Box>

        <Planner tasks={tasks} loading={isLoadingTasks} />
      </Box>
    </AppPageContainer>
  )
}
