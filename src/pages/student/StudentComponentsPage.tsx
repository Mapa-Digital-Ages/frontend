import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppDropdown, { DropdownOption } from '@/components/ui/AppDropdown'
import { useState } from 'react'

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

      <Box className="flex min-h-[80vh] flex-col items-center justify-center rounded-2xl bg-white p-8 gap-8 w-full max-w-xl">
        <Typography className="text-lg text-slate-400 mb-4">
          Área para testar componentes
        </Typography>

        <div className="w-full flex flex-col gap-6">
          <div>
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
            />
          </div>
          <div>
            <AppDropdown
              options={dropdownOptions}
              multiple
              value={multiValue}
              onChange={e => {
                const v = e.target.value
                setMultiValue(Array.isArray(v) ? v : [v])
              }}
              placeholder="Selecione os anos"
            />
          </div>
        </div>
      </Box>
    </AppPageContainer>
  )
}

export default StudentComponentsPage
