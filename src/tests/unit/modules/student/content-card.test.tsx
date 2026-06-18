import { test, expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import { SUBJECTS } from '@/shared/utils/themes'
import ContentCard from '@/modules/student/contents/components/ContentCard'
import { renderWithProviders } from '@/tests/helpers/render'
import type { ContentTrail } from '@/modules/student/contents/types/types'

const mockContent: ContentTrail = {
  articleCount: 2,
  completedSteps: 1,
  description: 'Trilha de reforço com foco em equações.',
  id: 'math-fundamentos-algebra',
  name: 'Fundamentos de Algebra',
  progress: 33,
  steps: 3,
  subject: SUBJECTS.matematica,
  timeEstimate: '25 min',
  videoCount: 1,
}

test('ContentCard renders the content name, subject and description', () => {
  renderWithProviders(<ContentCard content={mockContent} />)

  expect(
    screen.getByTestId('content-card-math-fundamentos-algebra')
  ).toBeInTheDocument()
  expect(screen.getByText('Fundamentos de Algebra')).toBeInTheDocument()
  expect(screen.getByText('Matemática')).toBeInTheDocument()
  expect(
    screen.getByText('Trilha de reforço com foco em equações.')
  ).toBeInTheDocument()
})

test('ContentCard renders the info chips with video, article, steps and time', () => {
  renderWithProviders(<ContentCard content={mockContent} />)

  const card = screen.getByTestId('content-card-math-fundamentos-algebra')
  expect(card).toHaveTextContent('1')
  expect(card).toHaveTextContent('2')
  expect(card).toHaveTextContent('3 etapas')
  expect(card).toHaveTextContent('25 min')
})

test('ContentCard renders the completed steps label and progress percentage', () => {
  renderWithProviders(<ContentCard content={mockContent} />)

  const card = screen.getByTestId('content-card-math-fundamentos-algebra')
  expect(card).toHaveTextContent('1/3 etapas')
  expect(card).toHaveTextContent('33%')
})
