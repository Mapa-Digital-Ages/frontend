import dayjs from 'dayjs'

export function formatRelativeDate(dateString: string): string {
  const date = dayjs(dateString)
  const now = dayjs()
  const time = date.format('HH:mm')

  if (date.isSame(now, 'day')) {
    return `Hoje · ${time}`
  }

  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `Ontem · ${time}`
  }

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  if (date.isAfter(now.subtract(7, 'day'))) {
    return `${weekdays[date.day()]} · ${time}`
  }

  return date.format('DD/MM/YYYY · HH:mm')
}
