import type { ReactNode } from 'react'
import type { User, UserRole } from './user'

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

export interface StudentTask {
  id: string
  title: string
  subject: string
  dueDate: string
  status: 'pending' | 'inProgress' | 'completed'
}

export interface ParentChild {
  id: string
  name: string
  grade: string
  status: string
}

export interface SchoolStudent {
  id: string
  name: string
  className: string
  engagement: number
}

export interface PartnerProject {
  id: string
  name: string
  status: string
  schools: number
}

export interface AdminStat {
  id: string
  label: string
  value: string
  description: string
}

export interface AdminUser extends User {
  lastAccess: string
}
