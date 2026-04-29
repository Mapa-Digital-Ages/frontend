import { useCallback, useEffect, useState } from 'react'
import { parentService } from '../services/service'
import { PARENT_DASHBOARD_MOCK } from '../__mocks__/parentDashboard.mock'
import type {
  ParentDashboardChild,
  ParentDashboardData,
  StudentDisciplineProgress,
} from '../types/types'
import type { SummaryMetric, WeeklyMoodEntry } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

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

function mockState(): DashboardState {
  const mock: ParentDashboardData = PARENT_DASHBOARD_MOCK
  return {
    child: mock.child,
    children: mock.children,
    disciplines: mock.disciplines,
    error: false,
    isLoading: false,
    metrics: mock.metrics,
    tasks: mock.tasks,
    wellBeing: mock.wellBeing,
    selectedChildId: mock.child?.id ?? null,
  }
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
        const [metrics, disciplines, tasks, wellBeing] = await Promise.all([
          parentService.getStudentSummary(childId),
          parentService.getStudentDisciplines(childId),
          parentService.getStudentTasks(childId),
          parentService.getStudentWellBeing(childId),
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
        setState(prev => ({
          ...mockState(),
          children,
          child: children.find(c => c.id === childId) ?? prev.child,
          selectedChildId: childId,
        }))
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
          setState(mockState())
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
        if (active) setState(mockState())
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [loadStudentData])

  // Re-fetch when child selection changes after initial load
  const { selectedChildId, children, isLoading } = state
  useEffect(() => {
    if (!selectedChildId || isLoading || children.length === 0) return
    void loadStudentData(selectedChildId, children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId])

  return { ...state, selectChild }
}
