import { Box } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import Planner from '../../shared/components/Planner'
import AppCalendar from '../../shared/components/AppCalendar'
import dayjs from 'dayjs'
import { SUBJECTS } from '@/shared/utils/themes'
import { useState } from 'react'
import type { Task } from '@/modules/student/shared/components/Planner'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

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
    date: dayjs().day(1).toDate(),
    title: 'Exercícios de Brasil Colônia',
    status: 'adjust',
    subject: SUBJECTS.historia,
  },
  {
    id: '4',
    date: dayjs().day(2).toDate(),
    title: 'Leitura e interpretação',
    status: 'done',
    subject: SUBJECTS.portugues,
  },
  {
    id: '5',
    date: dayjs().day(3).toDate(),
    title: 'Resumo de ecossistemas',
    status: 'adjust',
    subject: SUBJECTS.ciencias,
  },
  {
    id: '6',
    date: dayjs().day(4).toDate(),
    title: 'Exercícios de Brasil Colônia',
    status: 'pending',
    subject: SUBJECTS.historia,
  },
]

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Rotina, Foco e Bem-estar"
        subtitle="Organize sua rotina e acompanhe sinais emocionais em uma única tela"
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            p: 3,
            backgroundColor: 'background.paper',
            overflowX: 'auto',
          }}
        >
          <AppCalendar tasks={tasks} onTasksChange={setTasks} />
        </Box>

        <Planner tasks={tasks} />
      </Box>
    </AppPageContainer>
  )
}
