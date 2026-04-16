import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/app/auth/context'
import { AppThemeProvider } from '@/app/theme/mode/context'
import { router } from '@/app/router'

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppThemeProvider>
  )
}

export default App
