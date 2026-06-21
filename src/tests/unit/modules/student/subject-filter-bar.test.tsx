import { test, expect, jest } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SUBJECTS } from '@/shared/utils/themes'
import SubjectFilterBar from '@/modules/student/shared/components/SubjectFilterBar'
import { renderWithProviders } from '@/tests/helpers/render'
import type { FilterOption } from '@/modules/student/shared/types/types'

const options: FilterOption[] = [
  { label: 'Todos', subject: null, value: 'all' },
  { label: 'Matemática', subject: SUBJECTS.matematica, value: 'mathematics' },
  { label: 'Português', subject: SUBJECTS.portugues, value: 'portuguese' },
]

test('SubjectFilterBar renders one pill per option with the expected testid', () => {
  renderWithProviders(
    <SubjectFilterBar
      onSelect={() => {}}
      options={options}
      selectedValue="all"
      testIdPrefix="content-filter"
    />
  )

  expect(screen.getByTestId('content-filter-all')).toBeInTheDocument()
  expect(screen.getByTestId('content-filter-mathematics')).toBeInTheDocument()
  expect(screen.getByTestId('content-filter-portuguese')).toBeInTheDocument()
})

test('SubjectFilterBar marks the selected option as pressed', () => {
  renderWithProviders(
    <SubjectFilterBar
      onSelect={() => {}}
      options={options}
      selectedValue="mathematics"
      testIdPrefix="content-filter"
    />
  )

  expect(screen.getByTestId('content-filter-mathematics')).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  expect(screen.getByTestId('content-filter-all')).toHaveAttribute(
    'aria-pressed',
    'false'
  )
})

test('SubjectFilterBar calls onSelect with the clicked option value', async () => {
  const user = userEvent.setup()
  const onSelect = jest.fn()

  renderWithProviders(
    <SubjectFilterBar
      onSelect={onSelect}
      options={options}
      selectedValue="all"
      testIdPrefix="content-filter"
    />
  )

  await user.click(screen.getByTestId('content-filter-portuguese'))

  expect(onSelect).toHaveBeenCalledWith('portuguese')
})
