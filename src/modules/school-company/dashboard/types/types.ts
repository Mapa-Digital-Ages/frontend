import type { ReactNode } from 'react'
import type { IconVariantName } from '@/app/theme/core/palette'

export interface DashboardIndicator {
  id: string
  title: string
  value: string | number
  helperText?: string
  icon: ReactNode
  iconVariant: IconVariantName
}

export interface ClassCard {
  id: string
  name: string
  students: number
  tutor: string
  progress: number
}
