import { COOKIE_KEYS } from '@/shared/constants/storage'
import { httpClient } from '@/shared/lib/http/client'
import type {
  ParentChild,
  SummaryMetric,
  WeeklyMoodEntry,
} from '@/shared/types/common'
import { getCookie } from '@/shared/lib/storage/cookies'
import type { StudentDisciplineProgress } from '../types/types'
import type { Task } from '@/modules/student/shared/components/Planner'

export interface RegisterChildRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  birth_date: string
  student_class: string
}

export interface RegisterChildResult {
  success: boolean
  error?: 'forbidden' | 'conflict' | 'unknown'
  message?: string
}

export const parentService = {
  getName(): string | null {
    return getCookie(COOKIE_KEYS.authName)
  },

  getEmail(): string | null {
    return getCookie(COOKIE_KEYS.authEmail)
  },

  async getSummary() {
    const response = await httpClient.get<SummaryMetric[]>('parent/summary')
    return response.data
  },

  async getChildren() {
    const response = await httpClient.get<ParentChild[]>('parent/children')
    return response.data
  },

  async getStudentSummary(studentId: string) {
    const response = await httpClient.get<SummaryMetric[]>(
      `parent/student/${studentId}/summary`
    )
    return response.data
  },

  async getStudentDisciplines(studentId: string) {
    const response = await httpClient.get<StudentDisciplineProgress[]>(
      `parent/student/${studentId}/disciplines`
    )
    return response.data
  },

  async getStudentTasks(studentId: string) {
    const response = await httpClient.get<Task[]>(
      `parent/student/${studentId}/tasks`
    )
    return response.data
  },

  async getStudentWellBeing(studentId: string) {
    const response = await httpClient.get<WeeklyMoodEntry[]>(
      `parent/student/${studentId}/well-being`
    )
    return response.data
  },

  async registerChild(
    data: RegisterChildRequest
  ): Promise<RegisterChildResult> {
    try {
      await httpClient.post('student', {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        birth_date: data.birth_date,
        student_class: data.student_class,
      })
      return { success: true }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status
      if (status === 403)
        return {
          success: false,
          error: 'forbidden',
          message: 'Cadastro recebido. Aguardando aprovação do administrador.',
        }
      if (status === 409)
        return {
          success: false,
          error: 'conflict',
          message: 'Este e-mail já está cadastrado.',
        }
      return {
        success: false,
        error: 'unknown',
        message: 'Erro ao cadastrar. Tente novamente.',
      }
    }
  },
}
