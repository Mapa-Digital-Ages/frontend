import { COOKIE_KEYS } from '@/shared/constants/storage'
import { httpClient } from '@/shared/lib/http/client'
import type { ParentChild, SummaryMetric } from '@/shared/types/common'
import { getCookie, setCookie } from '@/shared/lib/storage/cookies'
import {
  addLinkedChildId,
  getLinkedChildIds,
  removeLinkedChildId,
} from '@/modules/parent/shared/storage/linkedChildren'
import type { ApiResponse } from '@/shared/types/api'
import type {
  ParentDashboardChild,
  StudentDisciplineProgress,
} from '../types/types'
import type { Task } from '@/modules/student/shared/components/Planner'

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

export interface ParentAccountSettings {
  email: string
  name: string
  phone?: string
}

export interface UpdateChildRequest {
  birth_date?: string
  first_name: string
  last_name: string
  phone_number?: string
  student_class: string
  school_id?: string
}

interface StudentApiResponse {
  id?: string
  user_id?: string
  first_name: string
  last_name: string
  student_class: string
  phone_number?: string | null
  birth_date?: string | null
  school_id?: string | null
  email?: string
}

export interface StudentDetail {
  id: string
  first_name: string
  last_name: string
  student_class: string
  phone_number?: string | null
  birth_date?: string | null
  school_id?: string | null
  email?: string
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

export const parentSettingsService = {
  getTitle(): string {
    return 'Painel de Configuração'
  },
}

function persistAccountSettings(settings: ParentAccountSettings) {
  setCookie(COOKIE_KEYS.authName, settings.name)
  setCookie(COOKIE_KEYS.authEmail, settings.email)
}

function mapGuardianMeToAccountSettings(
  guardian: GuardianMeResponse
): ParentAccountSettings {
  return {
    email: guardian.email,
    name: `${guardian.first_name} ${guardian.last_name}`.trim(),
    phone: guardian.phone_number ?? '',
  }
}

function formatClassLabel(studentClass: string) {
  if (!studentClass) return 'Ano não informado'
  const match = studentClass.match(/(\d+)/)
  return match ? `${match[1]}º Ano` : `${studentClass}º Ano`
}

const CLASS_NUM_TO_API: Record<string, string> = {
  '1': '1st class',
  '2': '2nd class',
  '3': '3rd class',
  '4': '4th class',
  '5': '5th class',
  '6': '6th class',
  '7': '7th class',
  '8': '8th class',
  '9': '9th class',
  '10': '10th class',
  '11': '11th class',
  '12': '12th class',
}

function toApiClass(value: string): string {
  return CLASS_NUM_TO_API[value] ?? value
}

function mapStudentResponseToChild(
  student: StudentApiResponse
): ParentDashboardChild {
  return {
    id: student.id ?? student.user_id ?? '',
    name: `${student.first_name} ${student.last_name}`.trim(),
    grade: formatClassLabel(student.student_class),
  }
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

async function fetchChildrenFromGuardianMe(): Promise<ParentChild[]> {
  try {
    const response = await httpClient.get<GuardianMeResponse>('guardian/me')
    const students = response.data.students ?? []
    return students.map(s =>
      mapGuardianStudentToChild(s, response.data.guardian_status)
    )
  } catch {
    return []
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

  getAccountSettings(): ParentAccountSettings {
    return {
      email: getCookie(COOKIE_KEYS.authEmail) ?? '',
      name: getCookie(COOKIE_KEYS.authName) ?? '',
      phone: '',
    }
  },

  async updateAccountSettings(
    settings: ParentAccountSettings
  ): Promise<ParentAccountSettings> {
    const [first_name, ...lastNameParts] = settings.name.trim().split(/\s+/)
    const response = await httpClient.patch<GuardianMeResponse>('guardian/me', {
      email: settings.email,
      first_name,
      last_name: lastNameParts.join(' '),
      phone_number: settings.phone || undefined,
    })
    const nextSettings = mapGuardianMeToAccountSettings(response.data)
    persistAccountSettings(nextSettings)
    return nextSettings
  },

  async deleteAccount(): Promise<void> {
    await httpClient.delete('guardian/me')
  },

  async getSummary() {
    return []
  },

  async getChildren(): Promise<ParentChild[]> {
    const fromGuardianMe = await fetchChildrenFromGuardianMe()
    if (fromGuardianMe.length > 0) return fromGuardianMe

    const guardianEmail = getCookie(COOKIE_KEYS.authEmail)
    return fetchChildrenFromLinkedIds(guardianEmail)
  },

  async createChild(data: RegisterChildRequest): Promise<ParentDashboardChild> {
    const guardianEmail = getCookie(COOKIE_KEYS.authEmail)
    const response = await httpClient.post<RegisterStudentApiResponse>(
      'student',
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number || undefined,
        birth_date: data.birth_date,
        student_class: toApiClass(data.student_class),
        school_id: data.school_id || undefined,
      }
    )

    const studentId = response.data.user_id ?? response.data.id
    if (!studentId) {
      throw new Error('Student creation response did not include an id.')
    }

    addLinkedChildId(guardianEmail, studentId)

    return {
      id: studentId,
      name: `${data.first_name} ${data.last_name}`.trim(),
      grade: formatClassLabel(data.student_class),
    }
  },

  async updateChild(
    childId: string,
    data: UpdateChildRequest
  ): Promise<ParentDashboardChild> {
    const response = await httpClient.put<StudentApiResponse>(
      `student/${childId}`,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number || undefined,
        birth_date: data.birth_date || undefined,
        student_class: toApiClass(data.student_class),
        school_id: data.school_id || undefined,
      }
    )
    return mapStudentResponseToChild(response.data)
  },

  async deleteChild(childId: string): Promise<void> {
    const guardianEmail = getCookie(COOKIE_KEYS.authEmail)
    await httpClient.delete(`student/${childId}`)
    removeLinkedChildId(guardianEmail, childId)
  },

  async getStudentById(studentId: string): Promise<StudentDetail> {
    const response = await httpClient.get<StudentApiResponse>(
      `student/${studentId}`
    )
    const data = response.data
    return {
      id: data.id ?? data.user_id ?? '',
      first_name: data.first_name,
      last_name: data.last_name,
      student_class: data.student_class,
      phone_number: data.phone_number,
      birth_date: data.birth_date,
      school_id: data.school_id,
      email: data.email,
    }
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
          student_class: toApiClass(data.student_class),
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
