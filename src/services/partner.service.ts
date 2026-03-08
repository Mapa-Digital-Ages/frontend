import type { PartnerProject, SummaryMetric } from '@/types/common'

const partnerSummary: SummaryMetric[] = [
  {
    id: 'projects',
    title: 'Projetos em andamento',
    value: 6,
    helperText: '2 entregas previstas este mês',
  },
  {
    id: 'schools',
    title: 'Escolas impactadas',
    value: 18,
    helperText: 'Rede em expansão',
  },
]

const projects: PartnerProject[] = [
  {
    id: 'project-1',
    name: 'Trilha de leitura',
    status: 'Em implantação',
    schools: 8,
  },
  {
    id: 'project-2',
    name: 'Laboratório móvel',
    status: 'Planejamento',
    schools: 5,
  },
]

export const partnerService = {
  async getSummary() {
    return Promise.resolve(partnerSummary)
  },
  async getProjects() {
    return Promise.resolve(projects)
  },
}
