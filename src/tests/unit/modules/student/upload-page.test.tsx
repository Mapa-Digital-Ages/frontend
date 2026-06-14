import { afterEach, expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '@/app/auth/context'
import { authService } from '@/app/auth/core/service'
import type { AuthContextValue } from '@/app/auth/core/types'
import StudentUploadPage from '@/modules/student/upload/page/Page'
import { uploadService } from '@/modules/student/upload/services/uploadService'
import { readSource } from '@/tests/helpers/source'
import { renderWithProviders } from '@/tests/helpers/render'

const uploadFixtures = [
  {
    id: '1',
    student_id: 'student-1',
    subject_id: null,
    file_name: 'Lista de Exercícios - Equações',
    download_url: '/uploads/1',
    file_type: 'application/pdf',
    file_size_bytes: 1024,
    created_at: '2026-05-07T00:00:00.000Z',
  },
  {
    id: '2',
    student_id: 'student-1',
    subject_id: null,
    file_name: 'Mapa mental de biologia',
    download_url: '/uploads/2',
    file_type: 'image/png',
    file_size_bytes: 2048,
    created_at: '2026-05-07T00:00:00.000Z',
  },
  {
    id: '3',
    student_id: 'student-1',
    subject_id: null,
    file_name: 'Relatório de Experiência',
    download_url: '/uploads/3',
    file_type:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size_bytes: 4096,
    created_at: '2026-05-07T00:00:00.000Z',
  },
]

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  logout: jest.fn(),
  status: 'authenticated',
  token: 'token-123',
  user: {
    email: 'aluno@mapa.local',
    name: 'Aluno Local',
    role: 'aluno',
  },
}

const subjectFixtures = [
  {
    id: 1,
    slug: 'mathematics',
    name: 'Matemática',
    color: 'rgba(173, 68, 248, 1)',
  },
  { id: 2, slug: 'science', name: 'Ciências', color: 'rgba(0, 210, 237, 1)' },
  { id: 3, slug: 'biology', name: 'Biologia', color: 'rgba(20, 184, 166, 1)' },
]

function renderPage() {
  jest.spyOn(authService, 'getUserId').mockReturnValue('student-1')
  jest
    .spyOn(uploadService, 'listStudentUploads')
    .mockResolvedValue(uploadFixtures)
  jest.spyOn(uploadService, 'listSubjects').mockResolvedValue(subjectFixtures)

  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <StudentUploadPage />
    </AuthContext.Provider>
  )
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('StudentUploadPage filters loaded uploads by file type and search text together', async () => {
  const user = userEvent.setup()

  renderPage()

  expect(
    await screen.findByText('Lista de Exercícios - Equações')
  ).toBeInTheDocument()
  expect(screen.getByText('Mapa mental de biologia')).toBeInTheDocument()
  expect(screen.getByText('Relatório de Experiência')).toBeInTheDocument()

  const filter = screen.getByRole('combobox', {
    name: /filtrar tarefas/i,
  })

  await user.click(filter)
  await user.click(screen.getByRole('option', { name: 'PDF' }))

  expect(screen.getByText('Lista de Exercícios - Equações')).toBeInTheDocument()
  expect(screen.queryByText('Mapa mental de biologia')).not.toBeInTheDocument()
  expect(screen.queryByText('Relatório de Experiência')).not.toBeInTheDocument()

  await user.type(screen.getByPlaceholderText('Pesquisar tarefas...'), 'mapa')

  expect(screen.getByText('Sem resultados')).toBeInTheDocument()
  expect(
    screen.queryByText('Lista de Exercícios - Equações')
  ).not.toBeInTheDocument()

  await user.click(filter)
  await user.click(screen.getByRole('option', { name: 'Todos os tipos' }))

  expect(screen.getByText('Mapa mental de biologia')).toBeInTheDocument()
})

test('StudentUploadPage keeps subject and type filters independent', async () => {
  const user = userEvent.setup()

  renderPage()

  expect(
    await screen.findByText('Lista de Exercícios - Equações')
  ).toBeInTheDocument()

  const filter = screen.getByRole('combobox', {
    name: /filtrar tarefas/i,
  })

  await user.click(filter)
  await user.click(screen.getByRole('option', { name: 'PDF' }))
  await user.click(filter)
  await user.click(screen.getByRole('option', { name: 'Ciências' }))

  expect(
    screen.queryByText('Lista de Exercícios - Equações')
  ).not.toBeInTheDocument()
  expect(screen.getByText('Ciências • PDF')).toBeInTheDocument()
  expect(screen.getByText('Sem resultados')).toBeInTheDocument()

  await user.click(
    screen.getByRole('combobox', {
      name: /filtrar tarefas/i,
    })
  )
  await user.click(screen.getByRole('option', { name: 'Todas as disciplinas' }))

  expect(filter).toHaveTextContent('PDF')
  expect(screen.getByText('Lista de Exercícios - Equações')).toBeInTheDocument()
  expect(screen.queryByText('Mapa mental de biologia')).not.toBeInTheDocument()
})

test('StudentUploadPage filter toolbar uses a responsive grid and viewport-safe menu', () => {
  const pageSource = readSource('modules/student/upload/page/Page.tsx')
  const dropdownSource = readSource('shared/ui/AppDropdown.tsx')

  expect(pageSource).not.toMatch(/lg:grid-cols-\[1fr_180px_320px\]/)
  expect(pageSource).toMatch(/gridTemplateColumns/)
  expect(pageSource).toMatch(/minmax\(0, 1fr\)/)
  expect(pageSource).toMatch(/menuWidth="min\(320px, calc\(100vw - 32px\)\)"/)
  expect(dropdownSource).toMatch(
    /maxWidth:\s*\{\s*sm: 'unset',\s*xs: 'calc\(100vw - 32px\)'\s*\}/
  )
  expect(dropdownSource).toMatch(
    /maxHeight:\s*\{\s*sm: menuMaxHeight,\s*xs: 'min\(60vh, 360px\)'\s*\}/
  )
  expect(dropdownSource).toMatch(/MenuListProps/)
  expect(dropdownSource).toMatch(/boxSizing: 'border-box'/)
  expect(dropdownSource).toMatch(/mx: 1/)
  expect(dropdownSource).toMatch(
    /containerRef\.current\?\.clientWidth \?\? 'auto'/
  )
  expect(dropdownSource).toMatch(
    /sm: resolvedMenuWidth,\s*xs: 'min\(280px, 92vw\)'/
  )
  expect(dropdownSource).not.toMatch(/backgroundColor: isSelected/)
  expect(dropdownSource).not.toMatch(
    /maxWidth: '100%',\s+minWidth: resolvedMenuWidth/
  )
  expect(dropdownSource).toMatch(/minWidth: 0/)
})
