export type StudentRisk = 'baixo' | 'médio' | 'alto'
export type StudentStatus = 'estável' | 'atenção' | 'crítico'

export interface StudentRecord {
  id: string
  name: string
  responsible: string
  school: string
  year: string
  attendance: number
  risk: StudentRisk
  status: StudentStatus
}

export interface StudentIndicator {
  id: string
  title: string
  value: number
}
