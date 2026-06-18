import { authService } from '@/app/auth/core/service'
import { httpClient } from '@/shared/lib/http/client'
import type {
  AdoptedSchool,
  AdoptedSchoolGrade,
  SupportedStudent,
} from '../types/types'

type CompanyPartnershipApi = {
  id: string
  school_id: string
  school_name: string
  company_id: string
  request_id: string
  request_title: string
  granted_spots: number
  supported_student_ids: string[]
  status: string
  created_at: string
}

type CompanyPartnershipListApi = {
  items: CompanyPartnershipApi[]
  total: number
}

type StudentApi = {
  id: string
  first_name: string
  last_name: string | null
  email: string
  student_class: string | null
}

type StudentListApi = {
  items: StudentApi[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

const CLASS_LABELS: Record<string, string> = {
  '5th class': '5º Ano',
  '6th class': '6º Ano',
  '7th class': '7º Ano',
  '8th class': '8º Ano',
  '9th class': '9º Ano',
}

function resolveCompanyId(): string {
  const companyId = authService.getUserId()

  if (!companyId) {
    throw new Error(
      'Não foi possível identificar a empresa. Faça login novamente.'
    )
  }

  return companyId
}

function mapStudent(student: StudentApi): SupportedStudent {
  const name = [student.first_name, student.last_name].filter(Boolean).join(' ')
  return {
    id: student.id,
    name,
    email: student.email,
    year: student.student_class
      ? (CLASS_LABELS[student.student_class] ?? student.student_class)
      : null,
  }
}

function buildGrades(students: SupportedStudent[]): AdoptedSchoolGrade[] {
  const grouped = new Map<string, number>()

  students.forEach(student => {
    const year = student.year ?? 'Sem ano'
    grouped.set(year, (grouped.get(year) ?? 0) + 1)
  })

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([year, count]) => ({
      year,
      responsible: '-',
      trails: count,
      subject: `${count} aluno(s)`,
    }))
}

async function getApprovedPartnerships(
  companyId: string
): Promise<CompanyPartnershipApi[]> {
  const response = await httpClient.get<CompanyPartnershipListApi>(
    `company/${encodeURIComponent(companyId)}/partnerships`,
    { query: { partnership_status: 'approved' } }
  )

  return response.data.items
}

async function getStudentsBySchool(
  schoolId: string
): Promise<SupportedStudent[]> {
  const pageSize = 100
  let page = 1
  let totalPages = 1
  const students: SupportedStudent[] = []

  while (page <= totalPages) {
    const response = await httpClient.get<StudentListApi>('student', {
      query: {
        school_id: schoolId,
        page,
        size: pageSize,
      },
    })

    students.push(...response.data.items.map(mapStudent))
    totalPages = response.data.total_pages || 1
    page += 1
  }

  return students
}

function selectSupportedStudents(
  partnership: CompanyPartnershipApi,
  students: SupportedStudent[]
) {
  const supportedStudentIds = new Set(partnership.supported_student_ids)

  return students.filter(student => supportedStudentIds.has(student.id))
}

export const adoptedSchoolsService = {
  getTitle(): string {
    return 'Gestão de Escolas Adotadas'
  },

  getSubtitle(): string {
    return 'Status operacional das escolas parceiras'
  },

  async getSchools(): Promise<AdoptedSchool[]> {
    const companyId = resolveCompanyId()
    const partnerships = await getApprovedPartnerships(companyId)

    return Promise.all(
      partnerships.map(async partnership => {
        const schoolStudents = await getStudentsBySchool(partnership.school_id)
        const supportedStudents = selectSupportedStudents(
          partnership,
          schoolStudents
        )

        return {
          id: partnership.id,
          partnershipId: partnership.id,
          schoolId: partnership.school_id,
          schoolName: partnership.school_name,
          city: '-',
          state: '-',
          coordinator: '-',
          students: supportedStudents.length,
          supportedStudents,
          grades: buildGrades(supportedStudents),
        }
      })
    )
  },

  async removeSchool(partnershipId: string): Promise<void> {
    const companyId = resolveCompanyId()
    await httpClient.delete(
      `company/${encodeURIComponent(companyId)}/partnerships/${encodeURIComponent(partnershipId)}`
    )
  },
}
