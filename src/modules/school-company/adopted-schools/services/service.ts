import type { AdoptedSchool } from '../types/types'

const adoptedSchools: AdoptedSchool[] = [
  {
    id: 'school-1',
    schoolName: 'Escola São Paulo',
    city: 'São Paulo',
    state: 'SP',
    coordinator: 'Ana Lima',
    students: 125,
    grades: [
      {
        year: '7º',
        responsible: 'Maria Silva',
        trails: 2,
        subject: 'Matemática',
      },
      {
        year: '8º',
        responsible: 'Roberta Nunes',
        trails: 1,
        subject: 'Geografia',
      },
    ],
  },
  {
    id: 'school-2',
    schoolName: 'Escola Horizonte',
    city: 'Belo Horizonte',
    state: 'MG',
    coordinator: 'Carla Souza',
    students: 156,
    grades: [
      {
        year: '6º',
        responsible: 'Paulo Henrique',
        trails: 3,
        subject: 'Ciências',
      },
      {
        year: '9º',
        responsible: 'Fernanda Costa',
        trails: 2,
        subject: 'Português',
      },
    ],
  },
  {
    id: 'school-3',
    schoolName: 'Escola Rio de Janeiro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    coordinator: 'Lucas Martins',
    students: 200,
    grades: [
      {
        year: '7º',
        responsible: 'Juliana Alves',
        trails: 4,
        subject: 'História',
      },
      {
        year: '8º',
        responsible: 'Ricardo Souza',
        trails: 2,
        subject: 'Matemática',
      },
      {
        year: '9º',
        responsible: 'Mariana Lima',
        trails: 1,
        subject: 'Inglês',
      },
    ],
  },
  {
    id: 'school-4',
    schoolName: 'Escola Recife',
    city: 'Recife',
    state: 'PE',
    coordinator: 'Beatriz Ferreira',
    students: 180,
    grades: [
      {
        year: '6º',
        responsible: 'André Santos',
        trails: 3,
        subject: 'Ciências',
      },
      {
        year: '7º',
        responsible: 'Cláudia Oliveira',
        trails: 2,
        subject: 'Português',
      },
    ],
  },
  {
    id: 'school-5',
    schoolName: 'Escola Curitiba',
    city: 'Curitiba',
    state: 'PR',
    coordinator: 'Rafael Mendes',
    students: 140,
    grades: [
      {
        year: '8º',
        responsible: 'Tatiana Rocha',
        trails: 2,
        subject: 'História',
      },
      {
        year: '9º',
        responsible: 'Diego Amaral',
        trails: 3,
        subject: 'Matemática',
      },
    ],
  },
]

export const adoptedSchoolsService = {
  getTitle(): string {
    return 'Gestão de Escolas Adotadas'
  },

  getSubtitle(): string {
    return 'Status operacional das escolas parceiras'
  },

  async getSchools(): Promise<AdoptedSchool[]> {
    return Promise.resolve(adoptedSchools)
  },

  async removeSchool(_schoolId: string): Promise<void> {
    return Promise.resolve()
  },
}
