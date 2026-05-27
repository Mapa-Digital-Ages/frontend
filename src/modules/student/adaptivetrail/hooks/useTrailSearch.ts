import { useMemo, useState } from 'react'
import type { AdaptiveTrailStep } from '../types/types'

export interface HighlightPart {
  text: string
  isMatch: boolean
}

export function highlightText(text: string, query: string): HighlightPart[] {
  if (!query.trim()) return [{ text, isMatch: false }]

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')

  return text.split(regex).map((part, i) => ({
    text: part,
    isMatch: i % 2 === 1,
  }))
}

export function useTrailSearch(steps: AdaptiveTrailStep[]) {
  const [query, setQuery] = useState('')

  const { filteredSteps, expandedBySearch } = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return { filteredSteps: steps, expandedBySearch: new Set<string>() }

    const expandedBySearch = new Set<string>()
    const result: AdaptiveTrailStep[] = []

    for (const step of steps) {
      const stepMatches =
        step.title.toLowerCase().includes(q) ||
        (step.description?.toLowerCase().includes(q) ?? false)

      const matchingSubSteps = step.subSteps.filter(
        ss =>
          ss.title.toLowerCase().includes(q) ||
          ss.description.toLowerCase().includes(q)
      )

      if (!stepMatches && matchingSubSteps.length === 0) continue

      if (matchingSubSteps.length > 0) expandedBySearch.add(step.id)

      result.push({
        ...step,
        subSteps: stepMatches ? step.subSteps : matchingSubSteps,
      })
    }

    return { filteredSteps: result, expandedBySearch }
  }, [steps, query])

  return { query, setQuery, filteredSteps, expandedBySearch }
}
