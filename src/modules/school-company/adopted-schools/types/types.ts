export interface AdoptedSchoolGrade {
  year: string
  responsible: string
  trails: number
  subject: string
}

export interface AdoptedSchool {
  id: string
  schoolName: string
  city: string
  state: string
  coordinator: string
  students: number
  grades: AdoptedSchoolGrade[]
}
