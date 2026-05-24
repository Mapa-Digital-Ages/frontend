import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import CompanyPage from './CompanyPage'
import SchoolPage from './SchoolPage'

export default function Page() {
  const theme = useTheme()
  const [view, setView] = useState<'escola' | 'empresa'>('escola')

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        data-testid="school-company-page-header"
        title="Gestão de Escolas e Empresas"
        subtitle="Cadastro, status e desempenho das escolas"
        variant="admin"
      />

      <Box
        data-testid="view-toggle-group"
        sx={{
          display: 'inline-flex',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '10px',
          overflow: 'hidden',
          alignSelf: 'flex-start',
          backgroundColor: 'background.paper',
          width: 'fit-content',
        }}
      >
        {(['escola', 'empresa'] as const).map(item => (
          <button
            key={item}
            data-testid={`toggle-${item}`}
            onClick={() => setView(item)}
            style={{
              background:
                view === item
                  ? theme.palette.background.default
                  : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color:
                view === item
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: view === item ? 700 : 500,
              margin: 4,
              padding: '6px 40px',
              transition: 'all 0.18s',
            }}
          >
            {item === 'escola' ? 'Escolas' : 'Empresas'}
          </button>
        ))}
      </Box>

      {view === 'escola' ? <SchoolPage /> : <CompanyPage />}
    </AppPageContainer>
  )
}
