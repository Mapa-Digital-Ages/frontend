export type UserRole = 'aluno' | 'responsavel' | 'admin' | 'empresa' | 'escola'

export interface User {
  name: string
  email: string
  role: UserRole
  organization?: string
  avatarUrl?: string
}
