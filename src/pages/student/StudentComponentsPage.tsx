import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppPageContainer from '@/components/ui/AppPageContainer'
import AppDropdown, { DropdownOption } from '@/components/ui/AppDropdown'
import { useState } from 'react'
import StudentComponentsShowcase from './components/StudentComponentsShowcase'
import AppCalendar from '@/components/ui/AppCalendar'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import AppInput from '@/components/ui/AppInput'
import MetricsCard from '@/components/ui/MetricsCard'
import PageHeader from '@/components/common/PageHeader'
import AppButton from '@/components/ui/AppButton'

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
      <PageHeader
        variant="student"
        eyebrow="Olá, Lucas!"
        title="Continue sua jornada no Mapa"
        subtitle="Progresso até o próximo nível:"
        tag="7º Ano"
        progress={85}
      />

      <PageHeader
        variant="parent"
        eyebrow="Filho(a): Lucas Silva - 7º ano"
        title="Relatório Geral"
        subtitle="Resumo consolidado do progresso do aluno "
      />

      <PageHeader
        variant="admin"
        title="Painel Administrativo"
        subtitle="Visão consolidada da operação MAPA DIGITAL"
      />

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

            <MetricsCard
              contentClassName="p-5"
              title="Métricas"
              value="123"
              icon={<WorkspacePremiumRoundedIcon />}
              iconVariant="blue"
              warningText="+25 este mês"
              warningColor="success.main"
            />
          </Stack>
          {}
          <AppButton
            size="small"
            backgroundColor="primary.main"
            label="Sou pequeno e padrao"
            borderRadius={0}
          />

          {}
          <AppButton
            size="medium"
            backgroundColor="background.default"
            label="Sou qual cor?"
            hasBorder={true}
            borderRadius="8px"
            iconPosition="left"
            textColor="text.primary"
          />

          {}
          <AppButton
            size="large"
            backgroundColor="error.main"
            label="Sou grande e laranja"
            borderRadius="50%"
            iconPosition="right"
          />
          <AppButton
            label="Voltar"
            iconPosition="left"
            hasBorder={true}
            borderRadius="50px"
            backgroundColor="background.paper"
            textColor="text.primary"
          />
          <AppButton label="Confirmar" backgroundColor="warning.main" />
          <AppButton label="Botao padrao conforme solicitado" />
          <AppButton
            backgroundColor="info.main"
            label="Botao com cor info"
          ></AppButton>
        </Box>
      </Box>
      <StudentComponentsShowcase />
    </AppPageContainer>
  )
}

export default StudentComponentsPage
