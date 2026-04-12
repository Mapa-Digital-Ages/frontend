import type { ParentChild, SummaryMetric } from '@/types/common'

const parentSummary: SummaryMetric[] = [
  {
    id: 'attendance',
    title: 'Presença média',
    value: '97%',
    helperText: 'Acompanhamento semanal',
  },
  {
    id: 'alerts',
    title: 'Alertas pendentes',
    value: 2,
    helperText: 'Recados da coordenação',
  },
]

const children: ParentChild[] = [
  {
    id: 'child-1',
    name: 'Luiza Souza',
    grade: '7º ano',
    status: 'Participação consistente',
  },
  {
    id: 'child-2',
    name: 'Rafael Souza',
    grade: '4º ano',
    status: 'Precisa revisar tarefas',
  },
]

export const parentService = {
  async getSummary() {
    return Promise.resolve(parentSummary)
  },
  async getChildren() {
    return Promise.resolve(children)
  },
  async getStatus() {
    return Promise.resolve('AGUARDANDO')
  },
}
