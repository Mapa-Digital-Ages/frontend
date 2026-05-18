import type {
  StudentItem,
  StudentListResult,
  StudentStatus,
  CreateStudentInput,
  UpdateStudentInput,
} from '@/modules/admin/student/types/types'

export interface StudentDto {
  id: string
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  school_name: string | null
  school_id: string | null
  guardian_name: string | null
  guardian_id: string | null
  student_class: string | null
}

export interface StudentListDto {
  items: StudentDto[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

const classLabelMap: Record<string, string> = {
  '5th class': '5º Ano',
  '6th class': '6º Ano',
  '7th class': '7º Ano',
  '8th class': '8º Ano',
  '9th class': '9º Ano',
}

export const yearValueToClassEnum: Record<string, string> = {
  '5': '5th class',
  '6': '6th class',
  '7': '7th class',
  '8': '8th class',
  '9': '9th class',
}

export function mapStudentDto(dto: StudentDto): StudentItem {
  return {
    id: dto.id,
    name: `${dto.first_name} ${dto.last_name}`.trim(),
    email: dto.email,
    guardian: dto.guardian_name,
    school: dto.school_name,
    year: dto.student_class
      ? (classLabelMap[dto.student_class] ?? dto.student_class)
      : null,
    status: dto.is_active ? 'ativo' : 'inativo',
  }
}

export function mapStudentListDto(dto: StudentListDto): StudentListResult {
  return {
    items: dto.items.map(mapStudentDto),
    total: dto.total,
  }
}

export function mapCreateStudentInput(input: CreateStudentInput) {
  const [firstName, ...rest] = input.name.trim().split(' ')
  return {
    first_name: firstName ?? '',
    last_name: rest.join(' '),
    email: input.email.trim(),
    password: input.password,
    school_id: input.schoolId ?? null,
    guardian_id: input.guardianId ?? null,
    student_class: input.year
      ? (yearValueToClassEnum[input.year] ?? null)
      : null,
    is_active: input.status === 'ativo',
  }
}

export function mapUpdateStudentInput(input: UpdateStudentInput) {
  const body: Record<string, unknown> = {}
  if (input.password !== undefined && input.password !== '') {
    body.password = input.password
  }
  if (input.schoolId !== undefined) {
    body.school_id = input.schoolId ?? null
  }
  if (input.year !== undefined) {
    body.student_class = input.year
      ? (yearValueToClassEnum[input.year] ?? null)
      : null
  }
  return body
}
