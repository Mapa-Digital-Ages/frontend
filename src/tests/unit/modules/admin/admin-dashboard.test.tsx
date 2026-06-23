import { afterEach, expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import AdminDashboardPage from '@/modules/admin/dashboard/page/Page'
import { adminService } from '@/modules/admin/dashboard/services/service'
import { renderWithProviders } from '@/tests/helpers/render'

afterEach(() => {
  jest.restoreAllMocks()
})

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  logout: jest.fn(),
  status: 'authenticated',
  token: 'token-123',
  user: {
    email: 'admin@mapa.local',
    name: 'Admin Local',
    role: 'admin',
  },
}

test('AdminDashboardPage links creation shortcuts to their forms', async () => {
  jest.spyOn(adminService, 'getStats').mockResolvedValue([])

  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <AdminDashboardPage />
    </AuthContext.Provider>
  )

  expect(await screen.findByText('Atalhos administrativos')).toBeInTheDocument()
  expect(screen.getByTestId('create-student')).toHaveAttribute(
    'href',
    '/admin/students?create=student'
  )
  expect(screen.getByTestId('create-company')).toHaveAttribute(
    'href',
    '/admin/schools-companies?create=company'
  )
  expect(screen.getByTestId('create-school')).toHaveAttribute(
    'href',
    '/admin/schools-companies?create=school'
  )
  expect(screen.getByTestId('create-parent')).toHaveAttribute(
    'href',
    '/admin/parents?create=parent'
  )
  expect(screen.getByTestId('open-contents')).toHaveAttribute(
    'href',
    '/admin/contents'
  )
  expect(screen.getByTestId('open-contents').parentElement).toHaveClass(
    'md:grid-cols-5'
  )
})
