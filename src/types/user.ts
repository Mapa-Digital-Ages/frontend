export type UserRole = 'student' | 'parent' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  avatarUrl?: string
}
