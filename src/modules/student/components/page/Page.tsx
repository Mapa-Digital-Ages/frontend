import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import PageHeader from '@/shared/ui/PageHeader'
import AppButton from '@/shared/ui/AppButton'
import AppCalendar from '@/modules/student/shared/components/AppCalendar'
import AppCard from '@/shared/ui/AppCard'
import AppDropdown, { DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import MetricsCard from '@/shared/ui/MetricsCard'
import SubjectBaseCard from '@/modules/student/shared/components/SubjectBaseCard'
import { ALL_SUBJECT_TAG_CONTEXTS, SUBJECTS } from '@/shared/utils/themes'
import AppLink from '@/shared/ui/AppLink'
import Planner, { Task } from '@/modules/student/shared/components/Planner'
import BarChart from '@/modules/student/shared/components/BarChart'
import dayjs from 'dayjs'
import OnboardingQuestionCard from '@/modules/student/shared/components/OnboardingQuestionCard'
import type { QuestionFlowPayload } from '@/modules/student/shared/types/types'
import EmotionalContainer from '@/shared/ui/EmotionalContainer'
import UploadActivityModal from '@/modules/student/shared/components/UploadActivityModal'
import TaskList from '../../shared/components/TaskList'

const mockChartData = [
  { label: 'Seg', value: 2 },
  { label: 'Ter', value: 4 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 6 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 1 },
  { label: 'Dom', value: 0 },
]

const initialTasks: Task[] = [
  {
    id: '1',
    date: dayjs().day(1).toDate(),
    title: 'Revisão de equações',
    status: 'done',
    subject: SUBJECTS.matematica,
  },
  {
    id: '2',
    date: dayjs().day(1).toDate(),
    title: 'Teste de Proficiência em Inglês - TOEFL',
    status: 'pending',
    subject: SUBJECTS.ingles,
  },
  {
    id: '3',
    date: dayjs().day(2).toDate(),
    title: 'Leitura e interpretação',
    status: 'done',
    subject: SUBJECTS.portugues,
  },
  {
    id: '4',
    date: dayjs().day(3).toDate(),
    title: 'Resumo de ecossistemas',
    status: 'adjust',
    subject: SUBJECTS.ciencias,
  },
  {
    id: '5',
    date: dayjs().day(4).toDate(),
    title: 'Exercícios de Brasil Colônia',
    status: 'pending',
    subject: SUBJECTS.historia,
  },
  {
    id: '6',
    date: dayjs().day(1).toDate(),
    title: 'Exercícios de Brasil Colônia',
    status: 'adjust',
    subject: SUBJECTS.historia,
  },
]

const questionFlow: QuestionFlowPayload[] = [
  {
    id: '1',
    options: [
      { id: 'question-1-option-1', label: '1' },
      { id: 'question-1-option-2', label: '4/8' },
      { id: 'question-1-option-3', label: '4/4' },
    ],
    question: 'Quanto é 3/4 + 1/4?',
    subject: SUBJECTS.matematica,
  },
  {
    id: '2',
    options: [
      { id: 'question-2-option-1', label: 'Lisboa' },
      { id: 'question-2-option-2', label: 'Brasília' },
      { id: 'question-2-option-3', label: 'Porto Alegre' },
    ],
    question: 'Qual é a capital do Brasil?',
    subject: SUBJECTS.geografia,
  },
  {
    id: '3',
    options: [
      { id: 'question-3-option-1', label: 'Substantivo' },
      { id: 'question-3-option-2', label: 'Verbo' },
      { id: 'question-3-option-3', label: 'Adjetivo' },
    ],
    question: 'A palavra “correr” é classificada como:',
    subject: SUBJECTS.portugues,
  },
]

const dropdownOptions: DropdownOption[] = [
  { label: '5º Ano', value: '5' },
  { label: '6º Ano', value: '6' },
  { label: '7º Ano', value: '7' },
  { label: '8º Ano', value: '8' },
  { label: '9º Ano', value: '9' },
]

const uploadTasks = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações',
    subject: SUBJECTS.matematica,
    type: 'Exercício',
  },
  {
    id: '2',
    title: 'Redação Dissertativa',
    subject: SUBJECTS.portugues,
    type: 'Revisão',
  },
  {
    id: '3',
    title: 'Relatório de Experiência',
    subject: SUBJECTS.ciencias,
    type: 'Trabalho',
  },
  {
    id: '4',
    title: 'Redação',
    subject: SUBJECTS.portugues,
    type: 'Pré-prova',
  },
]

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [singleValue, setSingleValue] = useState<string | number>('7')
  const [multiValue, setMultiValue] = useState<Array<string | number>>(['7'])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const theme = useTheme()

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="aluno"
        title="Continue sua jornada no Mapa"
        subtitle="Progresso até o próximo nível:"
        tag="7º Ano"
        progress={85}
      />

      <PageHeader
        variant="responsavel"
        eyebrow="Filho(a): Lucas Silva - 7º ano"
        title="Relatório Geral"
        subtitle="Resumo consolidado do progresso do aluno "
      />

      <PageHeader
        variant="admin"
        title="Painel Administrativo"
        subtitle="Visão consolidada da operação MAPA DIGITAL"
      />

      <Typography variant="h6">Atividades de upload</Typography>
      <TaskList tasks={uploadTasks} />

      <Box className="grid grid-cols-2 md:grid-cols-2 gap-5">
        <Box
          className="rounded-2xl p-8 space-y-6"
          sx={{
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <AppCalendar tasks={tasks} onTasksChange={setTasks} />

          <Stack spacing={3}>
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

          <Box className="space-y-4">
            <Typography variant="h6">Disciplinas</Typography>
            <Box className="grid grid-cols-1 gap-3">
              <SubjectBaseCard
                icon={<MenuBookRoundedIcon fontSize="medium" />}
                progress={78}
                subject={SUBJECTS.portugues}
                title="Português"
              />
              <SubjectBaseCard
                icon={<CalculateRoundedIcon fontSize="medium" />}
                progress={55}
                subject={SUBJECTS.matematica}
                title="Matemática"
              />
              <SubjectBaseCard
                icon={<PublicRoundedIcon fontSize="medium" />}
                progress={20}
                subject={SUBJECTS.geografia}
                title="Geografia"
              />
            </Box>
            <OnboardingQuestionCard questions={questionFlow} />
          </Box>
        </Box>

        <Box
          className="rounded-2xl p-8 space-y-4"
          sx={{
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <EmotionalContainer />
          <Planner tasks={tasks} />
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

          <AppButton
            size="small"
            backgroundColor="primary.main"
            label="Sou pequeno e padrao"
            borderRadius={0}
          />
          <AppButton
            size="medium"
            backgroundColor="background.default"
            label="Sou qual cor?"
            hasBorder={true}
            borderRadius="8px"
            iconPosition="left"
            textColor="text.primary"
          />
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
          <AppButton backgroundColor="info.main" label="Botao com cor info" />

          <Box>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: 14,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Catálogo completo de tags de disciplina
            </Typography>
            <AppSubjectsTags size="sm" subjects={ALL_SUBJECT_TAG_CONTEXTS} />
            <Box sx={{ mt: 2 }}>
              <AppSubjectsTags size="md" subjects={ALL_SUBJECT_TAG_CONTEXTS} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <AppSubjectsTags size="lg" subjects={ALL_SUBJECT_TAG_CONTEXTS} />
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Teste de Gráfico (AppBarChart)
          </Typography>
          <Box
            sx={{
              height: 250,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <BarChart data={mockChartData} />
          </Box>
        </Box>
      </Box>

      <AppButton
        label="Abrir Modal Upload"
        backgroundColor="primary.main"
        data-testid="upload-activity-button"
        onClick={() => setIsUploadModalOpen(true)}
      />

      <AppLink to="/student/dashboard">Ir para dashboard</AppLink>
      <AppLink href="https://google.com">Ir para o Google</AppLink>
      <UploadActivityModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddTask={() => Promise.resolve()}
      />
    </AppPageContainer>
  )
}
