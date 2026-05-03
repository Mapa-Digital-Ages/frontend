import { HttpClient, HttpRequestError } from './client-core'

const baseUrl =
  (
    import.meta as ImportMeta & {
      env?: Record<string, string | boolean | undefined>
    }
  ).env?.VITE_API_BASE_URL ?? 'http://localhost:8000/'

export { HttpRequestError }

export const httpClient = new HttpClient(String(baseUrl))
