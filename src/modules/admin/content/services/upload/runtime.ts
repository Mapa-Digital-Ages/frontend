import { httpClient } from '@/shared/lib/http/client'
import { createUploadApprovalRepository } from './repository'

export const uploadApprovalService = createUploadApprovalRepository({
  client: httpClient,
})
