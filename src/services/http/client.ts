import type { ApiResponse, HttpMethod, HttpRequestOptions } from '@/types/api'
import { authService } from '@/services/auth.service'
import { runRequestInterceptors, runResponseInterceptors } from './interceptors'

export class HttpRequestError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
    public readonly response?: Response
  ) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpRequestError'
  }
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: HttpRequestOptions['query']
) {
  const url = new URL(path, baseUrl)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

class HttpClient {
  private readonly baseUrl =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/'

  async request<T>(path: string, options: HttpRequestOptions = {}) {
    const { body, method = 'GET', query, skipAuth = false, ...rest } = options
    const headers = new Headers(rest.headers)

    if (!skipAuth) {
      const token = authService.getToken()

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }

    if (body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    let request = new Request(buildUrl(this.baseUrl, path, query), {
      ...rest,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers,
      method,
    })

    request = await runRequestInterceptors(request)

    let response = await fetch(request)
    response = await runResponseInterceptors(response)

    if (!response.ok) {
      throw new HttpRequestError(response.status, response.statusText, response)
    }

    if (response.status === 204) {
      return {
        data: null as T,
        message: 'No content',
        success: true,
      } satisfies ApiResponse<T>
    }

    const payload = (await response.json()) as ApiResponse<T> | T

    if (
      typeof payload === 'object' &&
      payload !== null &&
      'data' in payload &&
      'success' in payload
    ) {
      return payload as ApiResponse<T>
    }

    return {
      data: payload as T,
      message: 'OK',
      success: true,
    } satisfies ApiResponse<T>
  }

  get<T>(path: string, options?: Omit<HttpRequestOptions, 'method'>) {
    return this.request<T>(path, {
      ...options,
      method: 'GET',
    })
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
  ) {
    return this.request<T>(path, {
      ...options,
      body,
      method: 'POST' satisfies HttpMethod,
    })
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
  ) {
    return this.request<T>(path, {
      ...options,
      body,
      method: 'PUT' satisfies HttpMethod,
    })
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
  ) {
    return this.request<T>(path, {
      ...options,
      body,
      method: 'PATCH' satisfies HttpMethod,
    })
  }
}

export const httpClient = new HttpClient()
