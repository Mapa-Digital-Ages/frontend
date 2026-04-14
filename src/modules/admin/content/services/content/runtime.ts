import { httpClient } from '@/shared/lib/http/client'
import { createContentApprovalRepository } from './repository'

const env = (
  import.meta as ImportMeta & {
    env?: Record<string, string | boolean | undefined>
  }
).env

const allowFallbackByDefault =
  env?.DEV === true || env?.VITE_ENABLE_API_FALLBACK === 'true'

export const contentApprovalService = createContentApprovalRepository({
  allowFallback: allowFallbackByDefault,
  client: httpClient,
})
