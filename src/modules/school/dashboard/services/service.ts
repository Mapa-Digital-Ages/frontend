import type { SchoolDashboardData } from '../types/types'

const MOCK_DATA: SchoolDashboardData = {
  totalStudents: 125,
  activeClasses: 4,
  classes: [
    {
      id: '1',
      grade: '7º',
      studentCount: 32,
      tutorName: 'Prof. Ana',
      progress: 65,
    },
    {
      id: '2',
      grade: '6º',
      studentCount: 28,
      tutorName: 'Prof. Diego',
      progress: 72,
    },
    {
      id: '3',
      grade: '8º',
      studentCount: 30,
      tutorName: 'Profa. Carla',
      progress: 58,
    },
    {
      id: '4',
      grade: '5º',
      studentCount: 35,
      tutorName: 'Prof. João',
      progress: 80,
    },
  ],
}

export const schoolDashboardService = {
  getTitle(): string {
    return 'Painel da Escola'
  },

  async getDashboardData(): Promise<SchoolDashboardData> {
    return Promise.resolve(MOCK_DATA)
  },
}
