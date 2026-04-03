import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppDropdown, { DropdownOption } from '@/components/ui/AppDropdown'
import { useState } from 'react'
import StudentComponentsShowcase from './components/StudentComponentsShowcase'
import AppCalendar from '@/components/ui/AppCalendar'
import AppInput from '@/components/ui/AppInput'

const dropdownOptions: DropdownOption[] = [
  { label: '5º Ano', value: '5' },
  { label: '6º Ano', value: '6' },
  { label: '7º Ano', value: '7' },
  { label: '8º Ano', value: '8' },
  { label: '9º Ano', value: '9' },
]

function StudentComponentsPage() {
  const [singleValue, setSingleValue] = useState<string | number>('7')
  const [multiValue, setMultiValue] = useState<Array<string | number>>(['7'])
  const theme = useTheme()

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: { md: 24, xs: 20 },
          fontWeight: 700,
        }}
      >
        Componentes
      </Typography>

      <Box
        className="flex min-h-[80vh] rounded-2xl bg-white p-8 space-x-8"
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={3}>
          <Box className="flex-1">
            <AppCalendar />
          </Box>

          <AppDropdown
            options={dropdownOptions}
            value={singleValue}
            onChange={e =>
              setSingleValue(
                Array.isArray(e.target.value)
                  ? e.target.value[0]
                  : e.target.value
              )
            }
            placeholder="Selecione o ano"
            width="auto"
            dropdownPlacement="bottom"
          />
          <AppDropdown
            options={dropdownOptions}
            multiple
            value={multiValue}
            onChange={e => {
              const v = e.target.value
              setMultiValue(Array.isArray(v) ? v : [v])
            }}
            placeholder="Selecione os anos"
            dropdownPlacement="bottom"
          />
          <AppDropdown
            options={dropdownOptions}
            value={singleValue}
            onChange={() => {}}
            placeholder="Desabilitado"
            disabled
            width={120}
          />
        </Stack>

        <Box className="flex-1">
          <Typography variant="h6">Testes de Input</Typography>

          <Stack spacing={3}>
            <AppInput label="Texto normal" placeholder="Digite algo" />

            <AppInput
              label="Email"
              type="email"
              placeholder="voce@exemplo.com"
            />

            <AppInput
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />

            <AppInput label="Busca" type="search" placeholder="Pesquisar..." />

            <AppInput
              label="Grande"
              inputSize="large"
              placeholder="Input grande"
            />

            <AppInput
              label="Customizado"
              placeholder="Input customizado"
              customSize={{
                height: 70,
                fontSize: '18px',
                padding: '0 20px',
              }}
            />
          </Stack>
        </Box>
      </Box>
      <StudentComponentsShowcase />
    </AppPageContainer>
  )
}

export default StudentComponentsPage
