export type SchoolClassCard = {
  id: string
  grade: string
  studentCount: number
  tutorName: string
  progress: number
}

export type SchoolDashboardData = {
  totalStudents: number
  activeClasses: number
  classes: SchoolClassCard[]
}
