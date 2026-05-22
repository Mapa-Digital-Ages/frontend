import { test, expect } from '@jest/globals'
import { ThemeProvider } from '@mui/material/styles'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createAppTheme } from '@/app/theme/core/theme'
import { APP_ROUTES, buildStudentTrailRoute } from '@/app/router/paths'
import StudentAdaptiveTrailDetailPage from '@/modules/student/adaptivetrail-detail/page/Page'

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

test('StudentAdaptiveTrailDetailPage shows the trail flow with a locked step', async () => {
  renderPage()

  expect(
    await screen.findByRole('heading', {
      name: /trilha adaptativa de matemática/i,
    })
  ).toBeInTheDocument()
  expect(
    screen.getAllByText('Equações do 1º Grau - Introdução').length
  ).toBeGreaterThan(0)
  expect(screen.getByText('Conteúdo bloqueado')).toBeInTheDocument()
  expect(
    screen.getByText('Libera ao concluir a etapa anterior')
  ).toBeInTheDocument()
})

test('StudentAdaptiveTrailDetailPage opens the onboarding question flow from an unlocked step', async () => {
  const user = userEvent.setup()

  renderPage()

  const answerStepButton = await screen.findByRole('button', {
    name: /responder etapa equações do 1º grau - introdução/i,
  })

  await user.click(answerStepButton)

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /questionário da trilha/i })
    ).toBeInTheDocument()
  })
  expect(screen.getByText('Quanto vale x em 2x + 4 = 10?')).toBeInTheDocument()
})
