import { afterEach, expect, jest, test } from '@jest/globals'
import { HttpRequestError } from '@/shared/lib/http/client-core'
import { httpClient } from '@/shared/lib/http/client'
import {
  BATCH_CSV_TEMPLATES,
  buildCsvTemplate,
  downloadCsvTemplate,
  importCsvBatch,
} from '@/modules/admin/shared/services/batchImport'
import { createStudentRepository } from '@/modules/admin/student/services/repository'
import { createParentApprovalRepository } from '@/modules/admin/parent/services/parent/repository'
import {
  adminCompanyService,
  adminSchoolService,
} from '@/modules/admin/school-company/services/service'

const completedResult = {
  status: 'completed' as const,
  total_processed: 2,
  created: 2,
  failed: 0,
  message: 'OK',
  errors: [],
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('importCsvBatch posts the CSV in the multipart file field', async () => {
  let receivedPath = ''
  let receivedBody: unknown
  const client = {
    async post<T>(path: string, body?: unknown) {
      receivedPath = path
      receivedBody = body
      return {
        data: completedResult as T,
        message: 'OK',
        success: true,
      }
    },
  }
  const file = new File(['email'], 'dados.csv', { type: 'text/csv' })

  await expect(importCsvBatch(client, 'student/batch', file)).resolves.toEqual(
    completedResult
  )
  expect(receivedPath).toBe('student/batch')
  expect(receivedBody).toBeInstanceOf(FormData)
  expect((receivedBody as FormData).get('file')).not.toBeNull()
})

test('importCsvBatch returns a structured validation result sent with HTTP 400', async () => {
  const abortedResult = {
    ...completedResult,
    status: 'aborted' as const,
    created: 0,
    failed: 1,
    errors: [{ row: 2, email: 'invalido', reason: 'Invalid email' }],
  }
  const response = new Response(JSON.stringify(abortedResult), {
    headers: { 'Content-Type': 'application/json' },
    status: 400,
    statusText: 'Bad Request',
  })
  const post = jest.fn(async () => {
    throw new HttpRequestError(400, 'Bad Request', response)
  })

  await expect(
    importCsvBatch({ post }, 'guardian/batch', new File(['x'], 'dados.csv'))
  ).resolves.toEqual(abortedResult)
})

test('importCsvBatch normalizes a successful response without errors', async () => {
  const schoolResponse = {
    status: 'completed' as const,
    total_processed: 2,
    created: 2,
    failed: 0,
    message: 'OK',
  }
  const client = {
    async post<T>() {
      return {
        data: schoolResponse as T,
        message: 'OK',
        success: true,
      }
    },
  }

  await expect(
    importCsvBatch(client, 'school/batch', new File(['x'], 'escolas.csv'))
  ).resolves.toEqual(completedResult)
})

test('admin batch services target all four backend routes', async () => {
  const post = jest.spyOn(httpClient, 'post').mockResolvedValue({
    data: completedResult,
    message: 'OK',
    success: true,
  })
  const studentRepository = createStudentRepository({ client: httpClient })
  const parentRepository = createParentApprovalRepository({
    client: httpClient,
  })
  const file = new File(['email'], 'dados.csv')

  await studentRepository.importStudents(file)
  await parentRepository.importParentRegistrations(file)
  await adminSchoolService.importSchools(file)
  await adminCompanyService.importCompanies(file)

  expect(post.mock.calls.map(([path]) => path)).toEqual([
    'student/batch',
    'guardian/batch',
    'school/batch',
    'company/batch',
  ])
  post.mock.calls.forEach(([, body]) => expect(body).toBeInstanceOf(FormData))
})

test('batch CSV templates match the backend headers', () => {
  expect(BATCH_CSV_TEMPLATES).toEqual({
    companies: {
      exampleRow: ['Empresa', 'Exemplo', 'empresa.exemplo@exemplo.com'],
      fileName: 'template-empresas.csv',
      headers: ['first_name', 'last_name', 'email'],
    },
    guardians: {
      exampleRow: ['Maria', 'Silva', 'maria.silva@exemplo.com', '11999999999'],
      fileName: 'template-responsaveis.csv',
      headers: ['first_name', 'last_name', 'email', 'phone_number'],
    },
    schools: {
      exampleRow: [
        'Escola',
        'Modelo',
        'escola.modelo@exemplo.com',
        '1133334444',
        'false',
      ],
      fileName: 'template-escolas.csv',
      headers: [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'is_private',
      ],
    },
    students: {
      exampleRow: [
        'Joao',
        'Silva',
        'joao.silva@exemplo.com',
        '11988887777',
        '2013-05-20',
        '7',
        'escola.modelo@exemplo.com',
        'maria.silva@exemplo.com',
      ],
      fileName: 'template-alunos.csv',
      headers: [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'birth_date',
        'student_class',
        'school_email',
        'guardian_email',
      ],
    },
  })
  expect(
    buildCsvTemplate(
      BATCH_CSV_TEMPLATES.students.headers,
      BATCH_CSV_TEMPLATES.students.exampleRow
    )
  ).toBe(
    'first_name,last_name,email,phone_number,birth_date,student_class,school_email,guardian_email\r\n' +
      'Joao,Silva,joao.silva@exemplo.com,11988887777,2013-05-20,7,escola.modelo@exemplo.com,maria.silva@exemplo.com\r\n'
  )
})

test('downloadCsvTemplate creates and revokes a browser download URL', () => {
  const createObjectURL = jest.fn<(blob: Blob) => string>(
    () => 'blob:csv-template'
  )
  const revokeObjectURL = jest.fn<(url: string) => void>()
  Object.defineProperties(URL, {
    createObjectURL: { configurable: true, value: createObjectURL },
    revokeObjectURL: { configurable: true, value: revokeObjectURL },
  })
  const click = jest
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(() => {})

  downloadCsvTemplate('students')

  const link = click.mock.contexts[0] as unknown as HTMLAnchorElement
  expect(link.download).toBe('template-alunos.csv')
  expect(link.href).toBe('blob:csv-template')
  expect(link.isConnected).toBe(false)
  expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:csv-template')
})
