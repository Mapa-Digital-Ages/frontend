import { test, expect } from '@jest/globals'
import { ThemeProvider } from '@mui/material/styles'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createAppTheme } from '@/app/theme/core/theme'
import { APP_ROUTES, buildStudentTrailRoute } from '@/app/router/paths'
import StudentAdaptiveTrailDetailPage from '@/modules/student/adaptivetrail/detail/page/Page'

function renderPage(trailId = 'math') {
  render(
    <ThemeProvider theme={createAppTheme('light')}>
      <MemoryRouter initialEntries={[buildStudentTrailRoute(trailId)]}>
        <Routes>
          <Route
            element={<StudentAdaptiveTrailDetailPage />}
            path={APP_ROUTES.student.adaptiveTrailDetail}
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

test('StudentAdaptiveTrailDetailPage shows the trail title and all steps', async () => {
  renderPage()

  expect(
    await screen.findByRole('heading', { name: /fundamentos de algebra/i })
  ).toBeInTheDocument()

  expect(screen.getByText('Equações do 1º Grau')).toBeInTheDocument()
  expect(screen.getByText('Frações e Decimais')).toBeInTheDocument()
  expect(screen.getByText('Problemas Aplicados')).toBeInTheDocument()
  expect(screen.getByText('Libera ao concluir o vídeo')).toBeInTheDocument()
})

test('StudentAdaptiveTrailDetailPage shows sub-steps when active step is expanded', async () => {
  renderPage()

  await screen.findByRole('heading', { name: /fundamentos de algebra/i })

  expect(
    screen.getByText('Assistir: Introdução às Equações do 1º Grau')
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailDetailPage unlocks quiz sub-step after completing video', async () => {
  const user = userEvent.setup()

  renderPage()

  const videoButton = await screen.findByRole('button', {
    name: /responder etapa assistir: introdução às equações do 1º grau/i,
  })

  await user.click(videoButton)

  await waitFor(() => {
    expect(
      screen.getByRole('button', {
        name: /responder etapa questões de equações do 1º grau/i,
      })
    ).toBeInTheDocument()
  })
})
