import { useCallback, useEffect, useState } from 'react'
import {
  parentService,
  type RegisterChildRequest,
  type UpdateChildRequest,
} from '../services/service'
import type {
  ParentDashboardChild,
  StudentDisciplineProgress,
} from '../types/types'
import type { SummaryMetric } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

interface UseParentSettingsResult {
  child: ParentDashboardChild | null
  children: ParentDashboardChild[]
  disciplines: StudentDisciplineProgress[]
  error: boolean
  isLoading: boolean
  metrics: SummaryMetric[]
  tasks: Task[]
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
  ...EMPTY_STATE,
  error: true,
}

function childrenFromParents(children: ParentDashboardChild[]) {
  return children.map(child => ({
    grade: child.grade,
    id: child.id,
    name: child.name,
  }))
}

export function useParentSettings(): UseParentSettingsResult {
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
        setState(prev => ({ ...prev, error: true, isLoading: false }))
      }
    },
    []
  )

  const createChild = useCallback(async (data: RegisterChildRequest) => {
    const child = await parentService.createChild(data)

    setState(prev => ({
      ...prev,
      child,
      children: [...prev.children, child],
      disciplines: [],
      error: false,
      isLoading: false,
      metrics: [],
      selectedChildId: child.id,
      tasks: [],
    }))
  }, [])

  const updateChild = useCallback(
    async (childId: string, data: UpdateChildRequest) => {
      const updatedChild = await parentService.updateChild(childId, data)

      setState(prev => ({
        ...prev,
        child: prev.child?.id === childId ? updatedChild : prev.child,
        children: prev.children.map(child =>
          child.id === childId ? updatedChild : child
        ),
        error: false,
      }))
    },
    []
  )

  const deleteChild = useCallback(async (childId: string) => {
    await parentService.deleteChild(childId)

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
        disciplines: child ? prev.disciplines : [],
        error: false,
        metrics: child ? prev.metrics : [],
        selectedChildId: nextSelectedChildId,
        tasks: child ? prev.tasks : [],
      }
    })
  }, [])

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

        const children = childrenFromParents(fetched)
        const firstId = children[0].id

        setState(prev => ({
          ...prev,
          children,
          isLoading: true,
          selectedChildId: firstId,
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

  return { ...state, createChild, deleteChild, selectChild, updateChild }
}
