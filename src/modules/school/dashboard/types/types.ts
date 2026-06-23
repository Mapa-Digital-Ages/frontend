export type SchoolClassCard = {
  id: string
  grade: string
  studentCount: number
  disciplines: SchoolDisciplineProgress[]
}

export type SchoolDisciplineProgress = {
  subjectId: string
  subjectLabel: string
  subjectColor?: string | null
  progress: number
}

export type SchoolDashboardData = {
  totalStudents: number
  activeClasses: number
  classes: SchoolClassCard[]
}
