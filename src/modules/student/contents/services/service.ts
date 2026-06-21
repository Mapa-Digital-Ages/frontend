import { contentTrails } from '../data/contents'
import type { ContentTrail } from '../types/types'

export const contentsService = {
  async getContents(): Promise<ContentTrail[]> {
    return Promise.resolve(contentTrails)
  },
}
