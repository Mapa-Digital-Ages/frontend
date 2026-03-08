import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AppThemeProvider } from '@/context/ThemeContext'
import { router } from '@/router'

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
