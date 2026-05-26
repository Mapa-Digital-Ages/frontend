import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/shared/lib/storage/local'

const STORAGE_KEY_PREFIX = 'mapa-digital.parent.children'

function buildKey(guardianEmail: string) {
  return `${STORAGE_KEY_PREFIX}:${guardianEmail.trim().toLowerCase()}`
}

export function getLinkedChildIds(guardianEmail: string | null): string[] {
  if (!guardianEmail) return []
  return getStorageItem<string[]>(buildKey(guardianEmail)) ?? []
}

export function addLinkedChildId(
  guardianEmail: string | null,
  studentId: string
) {
  if (!guardianEmail) return
  const ids = getLinkedChildIds(guardianEmail)
  if (ids.includes(studentId)) return
  setStorageItem(buildKey(guardianEmail), [...ids, studentId])
}

export function removeLinkedChildId(
  guardianEmail: string | null,
  studentId: string
) {
  if (!guardianEmail) return
  const ids = getLinkedChildIds(guardianEmail).filter(id => id !== studentId)
  if (ids.length === 0) {
    removeStorageItem(buildKey(guardianEmail))
    return
  }
  setStorageItem(buildKey(guardianEmail), ids)
}
