import { useCallback, useEffect, useState } from 'react'
import {
  parentService,
  type RegisterChildRequest,
  type UpdateChildRequest,
} from '../services/service'
import {
  CHILD_MOCK_DATA,
  MOCK_CHILDREN,
} from '@/modules/parent/__mocks__/parentDashboard.mock'
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
  createChild: (data: RegisterChildRequest) => Promise<void>
  updateChild: (childId: string, data: UpdateChildRequest) => Promise<void>
  deleteChild: (childId: string) => Promise<void>
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

function mockStateForChild(
  childId: string,
  children: ParentDashboardChild[]
): DashboardState {
  const data = CHILD_MOCK_DATA[childId] ?? CHILD_MOCK_DATA['mock-student-1']
  return {
    child: data.child,
    children,
    disciplines: data.disciplines,
    error: false,
    isLoading: false,
    metrics: data.metrics,
    tasks: data.tasks,
    wellBeing: data.wellBeing,
    selectedChildId: childId,
  }
}

function mockState(): DashboardState {
  return mockStateForChild('mock-student-1', MOCK_CHILDREN)
}

function generateLocalChildId() {
  return globalThis.crypto?.randomUUID?.() ?? `local-child-${Date.now()}`
}

function formatClassLabel(studentClass: string) {
  return studentClass ? `${studentClass}º Ano` : 'Ano não informado'
}

function localChildFromCreate(
  data: RegisterChildRequest
): ParentDashboardChild {
  return {
    id: generateLocalChildId(),
    name: `${data.first_name} ${data.last_name}`.trim(),
    grade: formatClassLabel(data.student_class),
  }
}

function localChildFromUpdate(
  childId: string,
  data: UpdateChildRequest
): ParentDashboardChild {
  return {
    id: childId,
    name: `${data.first_name} ${data.last_name}`.trim(),
    grade: formatClassLabel(data.student_class),
  }
}

export function useParentSettings(): UseParentDashboardResult {
  const [state, setState] = useState<DashboardState>(LOADING_STATE)

  const selectChild = useCallback((id: string) => {
    setState(prev => {
      const child = prev.children.find(c => c.id === id) ?? prev.child
      return { ...prev, selectedChildId: id, child }
    })
  }, [])

  const createChild = useCallback(async (data: RegisterChildRequest) => {
    let child: ParentDashboardChild
    try {
      child = await parentService.createChild(data)
    } catch {
      child = localChildFromCreate(data)
    }

    setState(prev => ({
      ...prev,
      child: prev.child ?? child,
      children: [...prev.children, child],
      selectedChildId: prev.selectedChildId ?? child.id,
    }))
  }, [])

  const updateChild = useCallback(
    async (childId: string, data: UpdateChildRequest) => {
      let updatedChild: ParentDashboardChild
      try {
        updatedChild = await parentService.updateChild(childId, data)
      } catch {
        updatedChild = localChildFromUpdate(childId, data)
      }

      setState(prev => ({
        ...prev,
        child: prev.child?.id === childId ? updatedChild : prev.child,
        children: prev.children.map(child =>
          child.id === childId ? updatedChild : child
        ),
      }))
    },
    []
  )

  const deleteChild = useCallback(async (childId: string) => {
    try {
      await parentService.deleteChild(childId)
    } catch {
      // Keep the settings page usable with the existing local mock fallback.
    }

    setState(prev => {
      const children = prev.children.filter(child => child.id !== childId)
      const nextSelectedChildId =
        prev.selectedChildId === childId
          ? (children[0]?.id ?? null)
          : prev.selectedChildId
      const child =
        nextSelectedChildId != null
          ? (children.find(item => item.id === nextSelectedChildId) ?? null)
          : null

      return {
        ...prev,
        child,
        children,
        selectedChildId: nextSelectedChildId,
      }
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
        setState(mockStateForChild(childId, children))
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

  const { selectedChildId, children, isLoading } = state
  useEffect(() => {
    if (!selectedChildId || isLoading || children.length === 0) return
    void loadStudentData(selectedChildId, children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId])

  return { ...state, createChild, deleteChild, selectChild, updateChild }
}
