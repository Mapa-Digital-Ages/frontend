import { ROLE_LABELS } from '@/app/access/core/roles'
import type { UserRole } from '@/shared/types/user'

export function formatRole(role: UserRole) {
  return ROLE_LABELS[role]
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatEngagement(value: number) {
  return `${value}%`
}
