import type {
  RequestInterceptor,
  ResponseInterceptor,
} from '@/shared/types/api'

const requestInterceptors: RequestInterceptor[] = []
const responseInterceptors: ResponseInterceptor[] = []

export function registerRequestInterceptor(interceptor: RequestInterceptor) {
  requestInterceptors.push(interceptor)

  return () => {
    const index = requestInterceptors.indexOf(interceptor)

    if (index >= 0) {
      requestInterceptors.splice(index, 1)
    }
  }
}

export function registerResponseInterceptor(interceptor: ResponseInterceptor) {
  responseInterceptors.push(interceptor)

  return () => {
    const index = responseInterceptors.indexOf(interceptor)

    if (index >= 0) {
      responseInterceptors.splice(index, 1)
    }
  }
}

export async function runRequestInterceptors(request: Request) {
  let nextRequest = request

  for (const interceptor of requestInterceptors) {
    nextRequest = await interceptor(nextRequest)
  }

  return nextRequest
}

export async function runResponseInterceptors(response: Response) {
  let nextResponse = response

  for (const interceptor of responseInterceptors) {
    nextResponse = await interceptor(nextResponse)
  }

  return nextResponse
}
