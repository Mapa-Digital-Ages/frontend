import { COOKIE_KEYS } from '@/shared/constants/storage'
import { httpClient } from '@/shared/lib/http/client'
import type {
  ParentChild,
  SummaryMetric,
  WeeklyMoodEntry,
} from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'
import {
  addLinkedChildId,
  getLinkedChildIds,
} from '@/modules/parent/shared/storage/linkedChildren'
import type { ApiResponse } from '@/shared/types/api'
import type { StudentDisciplineProgress } from '../types/types'
import type { Task } from '@/modules/student/shared/components/Planner'
import { wellBeingService } from '@/shared/services/wellBeingService'

export interface RegisterChildRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  birth_date: string
  student_class: string
  school_id?: string
}

export interface RegisterChildResult {
  success: boolean
  studentId?: string
  error?: 'forbidden' | 'conflict' | 'unknown'
  message?: string
}

interface StudentApiResponse {
  id?: string
  user_id?: string
  first_name: string
  last_name: string
  student_class: string
}

interface RegisterStudentApiResponse {
  id?: string
  detail?: string
  user_id?: string
}

interface GuardianMeStudent {
  user_id: string
  first_name: string
  last_name: string
  email: string
  birth_date: string
  student_class: string
}

interface GuardianMeResponse {
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  guardian_status: string
  is_active: boolean
  students: GuardianMeStudent[]
}

function formatClassLabel(studentClass: string) {
  if (!studentClass) return 'Ano não informado'
  const match = studentClass.match(/(\d+)/)
  return match ? `${match[1]}º Ano` : `${studentClass}º Ano`
}

function mapStudentToParentChild(student: StudentApiResponse): ParentChild {
  return {
    id: student.id ?? student.user_id ?? '',
    name: `${student.first_name} ${student.last_name}`.trim(),
    grade: formatClassLabel(student.student_class),
    status: 'approved',
  }
}

function mapGuardianStudentToChild(
  student: GuardianMeStudent,
  status: string
): ParentChild {
  return {
    id: student.user_id,
    name: `${student.first_name} ${student.last_name}`.trim(),
    grade: formatClassLabel(student.student_class),
    status,
  }
}

async function fetchChildrenFromLinkedIds(
  guardianEmail: string | null
): Promise<ParentChild[]> {
  const ids = getLinkedChildIds(guardianEmail)
  if (ids.length === 0) return []

  const results = await Promise.allSettled(
    ids.map(id => httpClient.get<StudentApiResponse>(`student/${id}`))
  )

  return results
    .filter(
      (r): r is PromiseFulfilledResult<ApiResponse<StudentApiResponse>> =>
        r.status === 'fulfilled'
    )
    .map(r => mapStudentToParentChild(r.value.data))
    .filter(child => child.id !== '')
}

export const parentService = {
  getName(): string | null {
    return getCookie(COOKIE_KEYS.authName)
  },

  getEmail(): string | null {
    return getCookie(COOKIE_KEYS.authEmail)
  },

  async getSummary() {
    return []
  },

  async getChildren(): Promise<ParentChild[]> {
    try {
      const response = await httpClient.get<GuardianMeResponse>('guardian/me')
      const students = response.data.students ?? []
      if (students.length > 0) {
        return students.map(s =>
          mapGuardianStudentToChild(s, response.data.guardian_status)
        )
      }
    } catch {
      // fall through — backend endpoint may not exist yet
    }

    const guardianEmail = getCookie(COOKIE_KEYS.authEmail)
    try {
      const children = await fetchChildrenFromLinkedIds(guardianEmail)
      if (children.length > 0) return children
    } catch {
      // fall through to mock fallback
    }
    return []
  },

  async getStudentSummary(studentId: string) {
    const response = await httpClient.get<SummaryMetric[]>(
      `student/${studentId}/summary`
    )
    return response.data
  },

  async getStudentDisciplines(studentId: string) {
    const response = await httpClient.get<StudentDisciplineProgress[]>(
      `student/${studentId}/disciplines`
    )
    return response.data
  },

  async getStudentTasks(studentId: string) {
    const response = await httpClient.get<Task[]>(`student/${studentId}/tasks`)
    return response.data
  },

  async getStudentWellBeing(
    studentId: string,
    fromIso: string,
    toIso: string
  ): Promise<WeeklyMoodEntry[]> {
    return wellBeingService.getStudentHistory(studentId, fromIso, toIso)
  },

  async registerChild(
    data: RegisterChildRequest
  ): Promise<RegisterChildResult> {
    const guardianEmail = getCookie(COOKIE_KEYS.authEmail)

    try {
      const response = await httpClient.post<RegisterStudentApiResponse>(
        'student',
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          phone_number: data.phone_number || undefined,
          birth_date: data.birth_date,
          student_class: data.student_class,
          school_id: data.school_id || undefined,
        }
      )

      const studentId = response.data.user_id ?? response.data.id
      if (studentId) addLinkedChildId(guardianEmail, studentId)

      return { success: true, studentId }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status
      if (status === 409)
        return {
          success: false,
          error: 'conflict',
          message: 'Este e-mail já está cadastrado.',
        }
      if (status === 403)
        return {
          success: false,
          error: 'forbidden',
          message: 'Cadastro recebido. Aguardando aprovação do administrador.',
        }
      return {
        success: false,
        error: 'unknown',
        message: 'Erro ao cadastrar. Tente novamente.',
      }
    }
  },
}
