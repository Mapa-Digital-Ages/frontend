import { useEffect, useState } from 'react'
import {
  schoolService,
  type SchoolOption,
} from '@/modules/parent/shared/services/schoolService'

interface UseSchoolOptionsState {
  schools: SchoolOption[]
  isLoading: boolean
  error: boolean
}

const INITIAL_STATE: UseSchoolOptionsState = {
  schools: [],
  isLoading: false,
  error: false,
}

export function useSchoolOptions(enabled: boolean): UseSchoolOptionsState {
  const [state, setState] = useState<UseSchoolOptionsState>(INITIAL_STATE)

  useEffect(() => {
    if (!enabled) return

    let active = true

    async function load() {
      if (active) setState({ schools: [], isLoading: true, error: false })
      try {
        const schools = await schoolService.listActiveSchools()
        if (active) setState({ schools, isLoading: false, error: false })
      } catch {
        if (active) setState({ schools: [], isLoading: false, error: true })
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [enabled])

  return state
}
