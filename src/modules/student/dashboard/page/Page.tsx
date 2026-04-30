import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import Planner from '@/modules/student/shared/components/Planner'
import type { Task } from '@/modules/student/shared/components/Planner'
import SubjectBaseCard from '@/modules/student/shared/components/SubjectBaseCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import EmotionalContainer from '@/shared/ui/EmotionalContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SUBJECTS } from '@/shared/utils/themes'

export default function Page() {
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

  const [tasks] = useState<Task[]>(initialTasks)

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="aluno"
        title="Continue sua jornada no Mapa Digital"
        subtitle="Progresso até o próximo nível:"
        tag="7º Ano"
        progress={85}
      />

      <Box className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      <Box className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1fr]">
        <Planner tasks={tasks} />

        <Box className="max-w-[600px]">
          <EmotionalContainer />
        </Box>
      </Box>
    </AppPageContainer>
  )
}
