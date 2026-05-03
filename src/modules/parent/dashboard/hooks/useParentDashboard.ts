import { useCallback, useEffect, useState } from 'react'
import { parentService } from '../services/service'
import type {
  ParentDashboardChild,
  StudentDisciplineProgress,
} from '../types/types'
import type { SummaryMetric } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

interface UseParentDashboardResult {
  child: ParentDashboardChild | null
  children: ParentDashboardChild[]
  disciplines: StudentDisciplineProgress[]
  error: boolean
  isLoading: boolean
  metrics: SummaryMetric[]
  tasks: Task[]
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

  const loadStudentData = useCallback(
    async (childId: string, children: ParentDashboardChild[]) => {
      try {
        const [metrics, disciplines, tasks] = await Promise.all([
          parentService.getStudentSummary(childId),
          parentService.getStudentDisciplines(childId),
          parentService.getStudentTasks(childId),
        ])
        setState(prev => ({
          ...prev,
          child: children.find(c => c.id === childId) ?? prev.child,
          disciplines,
          error: false,
          isLoading: false,
          metrics,
          tasks,
        }))
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: true }))
      }
    },
    []
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

  return { ...state, selectChild }
}
