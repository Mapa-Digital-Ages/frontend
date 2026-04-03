import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import ProgressBar from '../ui/ProgressBar'

type HeaderVariant = 'student' | 'guardians' | 'school' | 'company' | 'admin' | 'enterpriseSchool'

interface PageHeaderProps {
  title: string
  subtitle: string
  eyebrow?: string
  greeting?: string
  tag?: string
  progress?: number
  actions?: ReactNode
  variant?: HeaderVariant
}