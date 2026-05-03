import { ROLE_LABELS } from '@/app/access/core/roles'
import type { UserRole } from '@/shared/types/user'

export function formatRole(role: UserRole) {
  return ROLE_LABELS[role]
}

export function formatDate(date: string) {
  const calendarDateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (calendarDateMatch) {
    const [, year, month, day] = calendarDateMatch
    return `${day}/${month}/${year}`
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatEngagement(value: number) {
  return `${value}%`
}
