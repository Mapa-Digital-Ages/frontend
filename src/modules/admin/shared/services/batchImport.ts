import { HttpRequestError } from '@/shared/lib/http/client'
import type { ApiResponse } from '@/shared/types/api'

export type BatchImportStatus = 'completed' | 'partial' | 'aborted'

export type BatchImportError = {
  row: number
  email: string
  reason: string
  first_name?: string | null
  last_name?: string | null
}

export type BatchImportResult = {
  status: BatchImportStatus
  total_processed: number
  created: number
  failed: number
  message: string
  errors: BatchImportError[]
}

export const BATCH_CSV_TEMPLATES = {
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
    headers: ['first_name', 'last_name', 'email', 'phone_number', 'is_private'],
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
} as const

export type BatchCsvTemplateName = keyof typeof BATCH_CSV_TEMPLATES

type BatchImportClient = {
  post<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
}

function escapeCsvCell(value: string): string {
  if (!/[",\r\n]/.test(value)) return value
  return `"${value.replaceAll('"', '""')}"`
}

export function buildCsvTemplate(
  headers: readonly string[],
  exampleRow: readonly string[]
): string {
  return `${[headers, exampleRow]
    .map(row => row.map(escapeCsvCell).join(','))
    .join('\r\n')}\r\n`
}

export function downloadCsvTemplate(templateName: BatchCsvTemplateName): void {
  const template = BATCH_CSV_TEMPLATES[templateName]
  const blob = new Blob(
    [buildCsvTemplate(template.headers, template.exampleRow)],
    {
      type: 'text/csv;charset=utf-8',
    }
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = template.fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function normalizeBatchImportResult(value: unknown): BatchImportResult | null {
  if (typeof value !== 'object' || value === null) return null

  const candidate = value as Partial<BatchImportResult>
  if (
    candidate.status !== 'completed' &&
    candidate.status !== 'partial' &&
    candidate.status !== 'aborted'
  ) {
    return null
  }
  if (
    typeof candidate.total_processed !== 'number' ||
    typeof candidate.created !== 'number' ||
    typeof candidate.failed !== 'number' ||
    typeof candidate.message !== 'string'
  ) {
    return null
  }

  return {
    status: candidate.status,
    total_processed: candidate.total_processed,
    created: candidate.created,
    failed: candidate.failed,
    message: candidate.message,
    errors: Array.isArray(candidate.errors) ? candidate.errors : [],
  }
}

async function readErrorPayload(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function importCsvBatch(
  client: BatchImportClient,
  path: string,
  file: File
): Promise<BatchImportResult> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await client.post<BatchImportResult>(path, formData)
    const result = normalizeBatchImportResult(response.data)
    if (!result) throw new Error('Resposta inválida do serviço de importação.')
    return result
  } catch (error) {
    if (error instanceof HttpRequestError && error.response) {
      const payload = await readErrorPayload(error.response)

      // Batch validation failures use HTTP 400 while still returning the
      // structured import summary needed by the modal.
      const result = normalizeBatchImportResult(payload)
      if (result) return result

      if (
        typeof payload === 'object' &&
        payload !== null &&
        'detail' in payload &&
        typeof payload.detail === 'string'
      ) {
        throw new Error(payload.detail)
      }
    }

    throw error
  }
}
