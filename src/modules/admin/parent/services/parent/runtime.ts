import { httpClient } from '@/shared/lib/http/client'
import { createParentApprovalRepository } from './repository'

export const parentApprovalService = createParentApprovalRepository({
  client: httpClient,
})
