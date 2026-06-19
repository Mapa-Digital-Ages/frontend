import { useEffect, useState } from 'react'
import { httpClient } from '@/shared/lib/http/client'
import { authService } from '@/app/auth/core/service'
import { useUserRole } from '@/app/access/hook'

type SchoolIsPrivateState = {
  isPrivate: boolean | null
  loading: boolean
}

// Module-level cache keyed by school id so the sidebar and the route guard
// share a single request instead of each firing its own fetch.
const cache = new Map<string, boolean>()

/**
 * Resolve whether the logged-in school is private.
 *
 * Only fetches for the `escola` role; for every other role it resolves
 * immediately with `isPrivate: null` and never hits the network. On a failed
 * request it resolves as non-private (fail-open) — the backend remains the
 * real enforcement boundary.
 */
export function useSchoolIsPrivate(): SchoolIsPrivateState {
  const { role } = useUserRole()
  const schoolId = authService.getUserId()
  const enabled = role === 'escola' && Boolean(schoolId)

  // null = not resolved yet. Seeded from the cache so repeat mounts skip loading.
  const [resolved, setResolved] = useState<boolean | null>(
    enabled && schoolId ? (cache.get(schoolId) ?? null) : null
  )

  useEffect(() => {
    if (!enabled || !schoolId || cache.has(schoolId)) {
      return
    }

    let active = true

    httpClient
      .get<{ is_private: boolean }>(`school/${encodeURIComponent(schoolId)}`)
      .then(response => {
        cache.set(schoolId, response.data.is_private)
        if (active) {
          setResolved(response.data.is_private)
        }
      })
      .catch(() => {
        if (active) {
          setResolved(false)
        }
      })

    return () => {
      active = false
    }
  }, [enabled, schoolId])

  if (!enabled) {
    return { isPrivate: null, loading: false }
  }

  return { isPrivate: resolved, loading: resolved === null }
}
