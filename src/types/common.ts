import type { ReactNode } from 'react'
import type { UserRole } from './user'

export interface SidebarItem {
  label: string
  path: string
  icon: ReactNode
  roles?: UserRole[]
  description?: string
}

export interface RouteConfig {
  path: string
  label: string
  roles?: UserRole[]
}

export interface SummaryMetric {
  id: string
  title: string
  value: string | number
  helperText?: string
}

export interface TagContext {
  contrastColor?: string
  id?: string
  label: string
  color?: string
}

export type SubjectContext = TagContext
export interface StudentTask {
  id: string
  title: string
  subject: SubjectContext
  dueDate: string
  status: 'pending' | 'inProgress' | 'completed'
}

export interface ParentChild {
  id: string
  name: string
  grade: string
  status: string
}

export interface AdminStat {
  id: string
  label: string
  value: string
  description: string
}
