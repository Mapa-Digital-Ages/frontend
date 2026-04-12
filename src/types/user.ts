export type UserRole = 'student' | 'parent' | 'admin' | 'empresa' | 'escola'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  avatarUrl?: string
}
