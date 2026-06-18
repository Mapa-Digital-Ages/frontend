export interface AdoptedSchoolGrade {
  year: string
  responsible: string
  trails: number
  subject: string
}

export interface SupportedStudent {
  id: string
  name: string
  email: string
  year: string | null
}

export interface AdoptedSchool {
  id: string
  partnershipId: string
  schoolId: string
  schoolName: string
  city: string
  state: string
  coordinator: string
  students: number
  supportedStudents: SupportedStudent[]
  grades: AdoptedSchoolGrade[]
}
