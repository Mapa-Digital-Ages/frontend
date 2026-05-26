import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { parentService } from '../services/service'
import type {
  ParentDashboardChild,
  StudentDisciplineProgress,
} from '../types/types'
import type { SummaryMetric, WeeklyMoodEntry } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

const WELL_BEING_HISTORY_DAYS = 28
const WELL_BEING_POLL_INTERVAL_MS = 15_000

interface UseParentDashboardResult {
  child: ParentDashboardChild | null
  children: ParentDashboardChild[]
  disciplines: StudentDisciplineProgress[]
  error: boolean
  isLoading: boolean
  metrics: SummaryMetric[]
  tasks: Task[]
  wellBeing: WeeklyMoodEntry[]
  selectedChildId: string | null
  selectChild: (id: string) => void
}

interface DashboardState {
  child: ParentDashboardChild | null
  children: ParentDashboardChild[]
  disciplines: StudentDisciplineProgress[]
  error: boolean
  isLoading: boolean
  metrics: SummaryMetric[]
  tasks: Task[]
  wellBeing: WeeklyMoodEntry[]
  selectedChildId: string | null
}

const LOADING_STATE: DashboardState = {
  child: null,
  children: [],
  disciplines: [],
  error: false,
  isLoading: true,
  metrics: [],
  tasks: [],
  wellBeing: [],
  selectedChildId: null,
}

const EMPTY_STATE: DashboardState = {
  ...LOADING_STATE,
  isLoading: false,
}

const ERROR_STATE: DashboardState = {
  ...LOADING_STATE,
  isLoading: false,
  error: true,
}

export function useParentDashboard(): UseParentDashboardResult {
  const [state, setState] = useState<DashboardState>(LOADING_STATE)

  const selectChild = useCallback((id: string) => {
    setState(prev => {
      const child = prev.children.find(c => c.id === id) ?? prev.child
      return { ...prev, selectedChildId: id, child }
    })
  }, [])

  const wellBeingDateRange = useCallback(() => {
    const today = dayjs()
    return {
      from: today
        .subtract(WELL_BEING_HISTORY_DAYS - 1, 'day')
        .format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
    }
  }, [])

  const refetchWellBeing = useCallback(
    async (childId: string) => {
      const { from, to } = wellBeingDateRange()
      try {
        const wellBeing = await parentService.getStudentWellBeing(
          childId,
          from,
          to
        )
        setState(prev =>
          prev.selectedChildId === childId ? { ...prev, wellBeing } : prev
        )
      } catch {
        // keep previous wellBeing on transient errors
      }
    },
    [wellBeingDateRange]
  )

  const loadStudentData = useCallback(
    async (childId: string, children: ParentDashboardChild[]) => {
      const { from, to } = wellBeingDateRange()
      try {
        const [metrics, disciplines, tasks, wellBeing] = await Promise.all([
          parentService.getStudentSummary(childId),
          parentService.getStudentDisciplines(childId),
          parentService.getStudentTasks(childId),
          parentService.getStudentWellBeing(childId, from, to),
        ])
        setState(prev => ({
          ...prev,
          child: children.find(c => c.id === childId) ?? prev.child,
          disciplines,
          error: false,
          isLoading: false,
          metrics,
          tasks,
          wellBeing,
        }))
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: true }))
      }
    },
    [wellBeingDateRange]
  )

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const fetched = await parentService.getChildren()

        if (!active) return

        if (fetched.length === 0) {
          setState(EMPTY_STATE)
          return
        }

        const children: ParentDashboardChild[] = fetched.map(c => ({
          id: c.id,
          name: c.name,
          grade: c.grade,
        }))

        const firstId = children[0].id
        setState(prev => ({
          ...prev,
          children,
          selectedChildId: firstId,
          isLoading: true,
        }))
        await loadStudentData(firstId, children)
      } catch {
        if (active) setState(ERROR_STATE)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [loadStudentData])

  const { selectedChildId, children, isLoading } = state
  useEffect(() => {
    if (!selectedChildId || isLoading || children.length === 0) return
    void loadStudentData(selectedChildId, children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId])

  useEffect(() => {
    if (!selectedChildId) return
    const childId = selectedChildId

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void refetchWellBeing(childId)
      }
    }, WELL_BEING_POLL_INTERVAL_MS)

    const onFocus = () => {
      void refetchWellBeing(childId)
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [selectedChildId, refetchWellBeing])

  return { ...state, selectChild }
}
