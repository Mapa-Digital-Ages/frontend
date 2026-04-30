import { expect, jest, test } from '@jest/globals'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import { createAppTheme } from '@/app/theme/core/theme'
import ListChildren from '@/modules/parent/settings/components/ListChildren'
import type { ParentDashboardChild } from '@/modules/parent/settings/types/types'

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: async () => {},
  logout: () => {},
  status: 'authenticated',
  token: 'test-token',
  user: { email: 'parent@test.com', name: 'Parent', role: 'responsavel' },
}

function renderListChildren(
  props: Partial<React.ComponentProps<typeof ListChildren>> = {}
) {
  const defaultProps: React.ComponentProps<typeof ListChildren> = {
    children: [],
    currentPage: 1,
    emptyStateDescription: 'Nenhum filho cadastrado.',
    emptyStateTitle: 'Sem filhos',
    onPageChange: jest.fn(),
    onQueryChange: jest.fn(),
    onSelect: jest.fn(),
    query: '',
    resultsSummary: { count: 0, pluralLabel: 'filhos', singularLabel: 'filho' },
    searchPlaceholder: 'Buscar filho',
    selectedChildId: null,
    totalPages: 1,
    ...props,
  }

  return render(
    <ThemeProvider theme={createAppTheme('light')}>
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <ListChildren {...defaultProps} />
        </AuthContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  )
}

const MOCK_CHILDREN: ParentDashboardChild[] = [
  { id: 'child-1', name: 'Lucas Silva', grade: '7º Ano' },
  { id: 'child-2', name: 'Ana Costa', grade: '5º Ano' },
]

test('ListChildren shows empty state when children list is empty', () => {
  renderListChildren({ children: [] })

  expect(screen.getByText('Sem filhos')).toBeInTheDocument()
  expect(screen.getByText('Nenhum filho cadastrado.')).toBeInTheDocument()
})

test('ListChildren renders a card for each child', () => {
  renderListChildren({ children: MOCK_CHILDREN })

  assert.match(source, /role="listitem"/)
  assert.match(source, /ListItemButton/)
  assert.match(source, /Avatar/)
  assert.match(source, /aria-pressed/)
  assert.match(source, /getInitials/)
  assert.match(source, /child\.grade/)
  assert.match(source, /handleMenuOpen/)
  assert.match(source, /Editar/)
  assert.match(source, /Excluir/)
  assert.match(source, /getRoleSelectedStyle/)
})

test('ListChildren calls onSelect with child id when card is clicked', async () => {
  const user = userEvent.setup()
  const onSelect = jest.fn()

  renderListChildren({ children: MOCK_CHILDREN, onSelect })

  await user.click(
    screen.getByRole('button', { name: /Selecionar Lucas Silva/i })
  )

  expect(onSelect).toHaveBeenCalledWith('child-1')
})

test('ListChildren calls onCreate when add button is clicked', async () => {
  const user = userEvent.setup()
  const onCreate = jest.fn<() => void>()

  renderListChildren({ children: MOCK_CHILDREN, onCreate })

  await user.click(screen.getByRole('button', { name: /adicionar filho/i }))

  expect(onCreate).toHaveBeenCalledTimes(1)
})
