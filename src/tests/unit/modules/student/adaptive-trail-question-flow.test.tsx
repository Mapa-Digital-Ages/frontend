import { expect, jest, test, beforeEach, describe } from '@jest/globals'

await jest.unstable_mockModule('@/app/auth/core/service', () => ({
  authService: { getUserId: () => 'student-1' },
}))

const mockHttpGet = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const mockHttpPost = jest.fn<(...args: unknown[]) => Promise<unknown>>()

await jest.unstable_mockModule('@/shared/lib/http/client', () => ({
  httpClient: { get: mockHttpGet, post: mockHttpPost },
}))

const { adaptiveTrailDetailService } =
  await import('@/modules/student/adaptivetrail/detail/services/service')

function getHttp() {
  return {
    get: mockHttpGet,
    post: mockHttpPost,
  }
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
      'student/student-1/trails/3/steps/5/sub-steps/quiz-5/questions'
    )
    expect(flow.stepId).toBe('5')
    expect(flow.subStepId).toBe('quiz-5')
    expect(flow.questions).toHaveLength(1)
    expect(flow.questions[0].options).toHaveLength(2)
  })
})

describe('adaptiveTrailDetailService.getSubjectTrailSessions', () => {
  test('fetches all detailed trail sessions for one subject', async () => {
    getHttp().get.mockResolvedValue({
      data: [
        {
          id: '3',
          title: 'Álgebra',
          description: 'Equações.',
          subject: { id: '1', label: 'Mat', color: '#000' },
          progress: 50,
          completed_steps: 1,
          level_label: null,
          time_estimate: null,
          steps: [
            {
              id: '5',
              title: 'Etapa 1',
              order: 1,
              status: 'available',
              sub_steps: [
                {
                  id: 'r1',
                  kind: 'text',
                  title: 'Ler resumo',
                  order: 1,
                  status: 'available',
                  questions: [],
                },
              ],
            },
          ],
        },
      ],
    })

    const sessions =
      await adaptiveTrailDetailService.getSubjectTrailSessions('1')

    expect(getHttp().get).toHaveBeenCalledWith(
      'student/student-1/trails/subjects/1'
    )
    expect(sessions).toHaveLength(1)
    expect(sessions[0].steps[0].subSteps[0].kind).toBe('text')
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

describe('adaptiveTrailDetailService.completeSubStep', () => {
  test('completes only the selected quiz sub-step and returns the updated session', async () => {
    getHttp().post.mockResolvedValue({
      data: {
        id: '3',
        title: 'Álgebra',
        description: 'Equações.',
        subject: { id: '1', label: 'Mat', color: '#000' },
        progress: 0,
        completed_steps: 0,
        level_label: null,
        time_estimate: null,
        steps: [],
        current_sub_path: 5,
        path_status: 'on_going',
        last_completion: { correct: 1, total: 1, passed: true },
      },
    })

    const completion = await adaptiveTrailDetailService.completeSubStep(
      '3',
      '5',
      'quiz-5-group-2',
      [{ exerciseId: 'e1', optionId: 'o2' }]
    )

    expect(getHttp().post).toHaveBeenCalledWith(
      'student/student-1/trails/3/steps/5/sub-steps/quiz-5-group-2/complete',
      { answers: [{ exercise_id: 'e1', option_id: 'o2' }] }
    )
    expect(completion.result).toEqual({
      correct: 1,
      total: 1,
      passed: true,
      currentSubPath: 5,
      pathStatus: 'on_going',
    })
    expect(completion.session.id).toBe('3')
  })
})

describe('adaptiveTrailDetailService.validateAnswer', () => {
  test('posts one selected answer and returns correctness', async () => {
    getHttp().post.mockResolvedValue({
      data: { exercise_id: 1, option_id: 2, correct: false },
    })

    const result = await adaptiveTrailDetailService.validateAnswer('3', '5', {
      exerciseId: '1',
      optionId: '2',
    })

    expect(getHttp().post).toHaveBeenCalledWith(
      'student/student-1/trails/3/steps/5/answers/validate',
      { exercise_id: '1', option_id: '2' }
    )
    expect(result).toEqual({
      exerciseId: '1',
      optionId: '2',
      correct: false,
    })
  })
})
