import React from 'react'
import { Box, Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SubjectContext } from '../../types/common'
import {
  getSubjectChipTone,
  type SubjectChipSize,
} from '../../utils/subjectThemes'

type SubjectsTags = {
  color: string
  label: string
  size?: SubjectChipSize
}

type AppSubjectTagProps = {
  size?: SubjectChipSize
  subject: SubjectContext
}

type AppSubjectsTagsProps = {
  size?: SubjectChipSize
  subjects: SubjectContext[]
}

export function SubjectChip({ color, label, size = 'md' }: SubjectsTags) {
  const theme = useTheme()
  const chipClassName = `app-subject-chip app-subject-chip--${size}`
  const chipTone = getSubjectChipTone(color, { mode: theme.palette.mode })

  return (
    <Chip
      className={chipClassName}
      label={label}
      slotProps={{
        label: {
          className: 'app-subject-chip__label',
        },
      }}
      variant="outlined"
      sx={{
        backgroundColor: chipTone.backgroundColor,
        borderColor: chipTone.borderColor,
        color: chipTone.color,
      }}
    />
  )
}

export function AppSubjectTag({ size = 'md', subject }: AppSubjectTagProps) {
  return (
    <SubjectChip
      color={subject.color ?? 'rgba(100, 116, 139, 1)'}
      label={subject.label}
      size={size}
    />
  )
}

export default function AppSubjectsTags({
  size = 'md',
  subjects,
}: AppSubjectsTagsProps) {
  return (
    <Box className="flex flex-wrap gap-2.5">
      {subjects.map(subject => (
        <AppSubjectTag
          key={subject.id ?? subject.label}
          size={size}
          subject={subject}
        />
      ))}
    </Box>
  )
}
