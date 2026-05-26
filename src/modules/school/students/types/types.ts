export type SchoolStudentStatus = 'Ativo' | 'Inativo'

export type SchoolStudentRow = {
  id: string
  name: string
  guardian: string
  school: string
  grade: string
  status: SchoolStudentStatus
}

export type SchoolStudentsData = {
  visibleStudents: number
  schools: number
  students: SchoolStudentRow[]
}
