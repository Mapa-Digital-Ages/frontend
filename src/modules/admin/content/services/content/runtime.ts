import { httpClient } from '@/shared/lib/http/client'
import { createContentApprovalRepository } from './repository'

export const contentApprovalService = createContentApprovalRepository({
  client: httpClient,
})
