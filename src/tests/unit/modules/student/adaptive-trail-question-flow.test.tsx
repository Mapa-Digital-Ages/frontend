import { expect, jest, test, beforeEach, describe } from '@jest/globals'

jest.mock('@/app/auth/core/service', () => ({
  authService: { getUserId: jest.fn(() => 'student-1') },
}))

jest.mock('@/shared/lib/http/client', () => ({
  httpClient: { get: jest.fn(), post: jest.fn() },
}))

import { adaptiveTrailDetailService } from '@/modules/student/adaptivetrail/services/trailDetailService'

function getHttp() {
  return jest.requireMock<{
    httpClient: {
      get: ReturnType<typeof jest.fn>
      post: ReturnType<typeof jest.fn>
    }
  }>('@/shared/lib/http/client').httpClient
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('adaptiveTrailDetailService.getSubStepQuestionFlow', () => {
  test('fetches the question flow for a sub-path', async () => {
    getHttp().get.mockResolvedValue({
      data: {
        assessmentId: '5',
        trailId: '3',
        stepId: '5',
        subStepId: 'quiz-5',
        stepTitle: 'Questões',
        questions: [
          {
            id: 'e1',
            question: 'Quanto é 2x+4=10?',
            options: [
              { id: 'o1', label: 'x=2' },
              { id: 'o2', label: 'x=3' },
            ],
            subject: { id: '1', label: 'Mat', color: '#000' },
          },
        ],
      },
    })

    const flow = await adaptiveTrailDetailService.getSubStepQuestionFlow(
      '3',
      '5',
      'quiz-5'
    )

    expect(getHttp().get).toHaveBeenCalledWith(
      'student/student-1/trails/3/steps/5/questions'
    )
    expect(flow.stepId).toBe('5')
    expect(flow.subStepId).toBe('quiz-5')
    expect(flow.questions).toHaveLength(1)
    expect(flow.questions[0].options).toHaveLength(2)
  })
})

describe('adaptiveTrailDetailService.completeStep', () => {
  test('posts answers and returns the grading result', async () => {
    getHttp().post.mockResolvedValue({
      data: {
        correct: 1,
        total: 1,
        passed: true,
        current_sub_path: 8,
        path_status: 'on_going',
      },
    })

    const result = await adaptiveTrailDetailService.completeStep('3', '5', [
      { exerciseId: 'e1', optionId: 'o2' },
    ])

    expect(getHttp().post).toHaveBeenCalledWith(
      'student/student-1/trails/3/steps/5/complete',
      { answers: [{ exercise_id: 'e1', option_id: 'o2' }] }
    )
    expect(result.correct).toBe(1)
    expect(result.passed).toBe(true)
    expect(result.currentSubPath).toBe(8)
    expect(result.pathStatus).toBe('on_going')
  })
})
