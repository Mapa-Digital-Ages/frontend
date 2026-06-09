import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import ClassRoundedIcon from '@mui/icons-material/ClassRounded'
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import type { DashboardIndicator, ClassCard } from '../types/types'
import React from 'react'

function getTitle(): string {
  return 'Escola | Visão Geral'
}

function getSubtitle(): string {
  return 'Indicadores pedagógicos e operacionais do ambiente escolar.'
}

function getIndicators(): DashboardIndicator[] {
  return [
    {
      id: 'total-students',
      title: 'Total de Alunos',
      value: 125,
      icon: React.createElement(PeopleAltRoundedIcon, { fontSize: 'small' }),
      iconVariant: 'green',
    },
    {
      id: 'active-classes',
      title: 'Turmas Ativas',
      value: 4,
      icon: React.createElement(ClassRoundedIcon, { fontSize: 'small' }),
      iconVariant: 'blue',
    },
    {
      id: 'general-average',
      title: 'Média Geral',
      value: 7.5,
      helperText: '+0.2 vs mês anterior',
      icon: React.createElement(EqualizerRoundedIcon, { fontSize: 'small' }),
      iconVariant: 'green',
    },
    {
      id: 'reports-generated',
      title: 'Relatórios Gerados',
      value: 12,
      icon: React.createElement(DescriptionRoundedIcon, { fontSize: 'small' }),
      iconVariant: 'cyan',
    },
  ]
}

function getClasses(): ClassCard[] {
  return [
    {
      id: 'class-7',
      name: '7º',
      students: 32,
      tutor: 'Prof. Ana',
      progress: 65,
    },
    {
      id: 'class-5',
      name: '5º',
      students: 28,
      tutor: 'Prof. Diego',
      progress: 72,
    },
    {
      id: 'class-8',
      name: '8º',
      students: 30,
      tutor: 'Profa. Carla',
      progress: 58,
    },
    {
      id: 'class-9',
      name: '9º',
      students: 35,
      tutor: 'Prof. João',
      progress: 80,
    },
  ]
}

export const dashboardService = {
  getTitle,
  getSubtitle,
  getIndicators,
  getClasses,
}
