import { httpClient } from '../http/client'
import { createAdminApprovalRepository } from './admin-approval.service'

const env = (
  import.meta as ImportMeta & {
    env?: Record<string, string | boolean | undefined>
  }
).env

const allowFallbackByDefault =
  env?.DEV === true || env?.VITE_ENABLE_API_FALLBACK === 'true'

export const adminApprovalService = createAdminApprovalRepository({
  allowFallback: allowFallbackByDefault,
  client: httpClient,
})
