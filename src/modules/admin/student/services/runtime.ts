import { httpClient } from '@/shared/lib/http/client'
import { createStudentRepository } from './repository'

export const studentService = createStudentRepository({
  client: httpClient,
})
