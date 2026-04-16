export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequestOptions extends Omit<
  RequestInit,
  'body' | 'method'
> {
  body?: unknown
  method?: HttpMethod
  query?: Record<string, string | number | boolean | undefined>
  skipAuth?: boolean
}

export type RequestInterceptor = (
  request: Request
) => Promise<Request> | Request

export type ResponseInterceptor = (
  response: Response
) => Promise<Response> | Response
