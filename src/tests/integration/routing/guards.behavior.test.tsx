import { expect, test } from '@jest/globals'
import { ThemeProvider } from '@mui/material/styles'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import { ProtectedRoute, RoleRoute } from '@/app/access/guard'
import { APP_ROUTES } from '@/app/router/paths'
import { createAppTheme } from '@/app/theme/core/theme'

function LocationProbe() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

function createAuthValue(
  overrides: Partial<AuthContextValue> = {}
): AuthContextValue {
  return {
    isAuthenticated: false,
    login: async () => {},
    logout: () => {},
    status: 'unauthenticated',
    token: null,
    user: null,
    ...overrides,
  }
}

function renderGuardScenario(
  ui: React.ReactElement,
  authValue: AuthContextValue,
  initialEntry = '/private'
) {
  return render(
    <ThemeProvider theme={createAppTheme('light')}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/login" element={<span>Login</span>} />
            <Route path="/unauthorized" element={<span>Unauthorized</span>} />
            <Route
              path="/private"
              element={
                <>
                  {ui}
                  <LocationProbe />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

test('ProtectedRoute redirects unauthenticated users to login', () => {
  renderGuardScenario(
    <ProtectedRoute>
      <span>Private content</span>
    </ProtectedRoute>,
    createAuthValue()
  )

  expect(screen.getByText('Login')).toBeInTheDocument()
  expect(screen.queryByText('Private content')).not.toBeInTheDocument()
})

test('ProtectedRoute renders private content for authenticated users', () => {
  renderGuardScenario(
    <ProtectedRoute>
      <span>Private content</span>
    </ProtectedRoute>,
    createAuthValue({
      isAuthenticated: true,
      status: 'authenticated',
      token: 'token-123',
      user: {
        email: 'admin@test.com',
        name: 'Admin',
        role: 'admin',
      },
    })
  )

  expect(screen.getByText('Private content')).toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('/private')
})

test('RoleRoute redirects authenticated users without the required role', () => {
  renderGuardScenario(
    <RoleRoute allowedRoles={['admin']}>
      <span>Admin content</span>
    </RoleRoute>,
    createAuthValue({
      isAuthenticated: true,
      status: 'authenticated',
      token: 'token-123',
      user: {
        email: 'responsavel@test.com',
        name: 'Responsável',
        role: 'responsavel',
      },
    })
  )

  expect(screen.getByText('Unauthorized')).toBeInTheDocument()
  expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
  expect(APP_ROUTES.common.unauthorized).toBe('/unauthorized')
})
