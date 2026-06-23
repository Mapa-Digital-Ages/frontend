import { expect, jest, test, describe } from '@jest/globals'

jest.mock('@/shared/lib/http/client', () => ({
  httpClient: { get: jest.fn(), post: jest.fn() },
}))

import { groupTrailsBySubject } from '@/modules/student/adaptivetrail/services/service'
import type { Trail } from '@/modules/student/adaptivetrail/types/types'

function makeTrail(
  id: string,
  subjectId: string | undefined,
  progress: number
): Trail {
  return {
    id,
    name: `Trilha ${id}`,
    description: '',
    subject: subjectId ? { id: subjectId, label: subjectId } : undefined,
    steps: 2,
    completed: 0,
    progress,
    timeEstimate: null,
  }
}

describe('groupTrailsBySubject', () => {
  test('groups trails by subject and averages only started trails', () => {
    const groups = groupTrailsBySubject([
      makeTrail('a', 'mat', 100),
      makeTrail('b', 'por', 0),
      makeTrail('c', 'mat', 50),
      makeTrail('d', 'mat', 0),
    ])

    expect(groups).toHaveLength(2)
    const mat = groups.find(g => g.subjectId === 'mat')!
    expect(mat.trails.map(t => t.id)).toEqual(['a', 'c', 'd'])
    expect(mat.averageProgress).toBe(75)

    const por = groups.find(g => g.subjectId === 'por')!
    expect(por.trails).toHaveLength(1)
    expect(por.averageProgress).toBe(0)
    expect(groups[0].subjectId).toBe('mat')
  })

  test('preserves first-appearance order of subjects', () => {
    const groups = groupTrailsBySubject([
      makeTrail('a', 'por', 10),
      makeTrail('b', 'mat', 20),
      makeTrail('c', 'por', 30),
    ])
    expect(groups.map(g => g.subjectId)).toEqual(['por', 'mat'])
  })

  test('handles trails without a subject', () => {
    const groups = groupTrailsBySubject([makeTrail('a', undefined, 50)])
    expect(groups).toHaveLength(1)
    expect(groups[0].subject).toBeUndefined()
    expect(groups[0].averageProgress).toBe(50)
  })
})
