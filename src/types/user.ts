export type UserRole = 'student' | 'parent' | 'school' | 'partner' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  avatarUrl?: string
}
