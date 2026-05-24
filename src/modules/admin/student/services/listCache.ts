import type {
  StudentListQuery,
  StudentListResult,
} from '@/modules/admin/student/types/types'

export const STUDENT_LIST_CACHE_TTL_MS = 45_000

type CacheEntry = {
  data: StudentListResult
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const pendingRequests = new Map<string, Promise<StudentListResult>>()
let cacheVersion = 0

function getStudentListCacheKey(query: StudentListQuery) {
  return JSON.stringify({
    email: query.email ?? '',
    name: query.name ?? query.query ?? '',
    page: query.page ?? 1,
    size: query.size ?? query.pageSize ?? 10,
  })
}

export async function getCachedStudentList(
  query: StudentListQuery,
  fetcher: () => Promise<StudentListResult>
): Promise<StudentListResult> {
  const key = getStudentListCacheKey(query)
  const now = Date.now()
  const cached = cache.get(key)

  if (cached) {
    if (cached.expiresAt > now) return cached.data
    cache.delete(key)
  }

  const pendingRequest = pendingRequests.get(key)
  if (pendingRequest) return pendingRequest

  const requestVersion = cacheVersion
  const request = Promise.resolve()
    .then(fetcher)
    .then(result => {
      if (requestVersion === cacheVersion) {
        cache.set(key, {
          data: result,
          expiresAt: Date.now() + STUDENT_LIST_CACHE_TTL_MS,
        })
      }

      return result
    })
    .finally(() => {
      if (pendingRequests.get(key) === request) {
        pendingRequests.delete(key)
      }
    })

  pendingRequests.set(key, request)
  return request
}

export function invalidateStudentListCache() {
  cacheVersion += 1
  cache.clear()
  pendingRequests.clear()
}
