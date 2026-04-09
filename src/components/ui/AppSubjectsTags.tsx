import React from 'react'
import type { TagContext } from '../../types/common'
import AppTags, { AppTag } from './AppTags'
import { SUBJECTS, type SubjectChipSize } from '../../utils/themes'

type SubjectChipProps = {
  color: string
  label: string
  size?: SubjectChipSize
}

type AppSubjectTagProps = {
  size?: SubjectChipSize
  subject: TagContext
}

type AppSubjectsTagsProps = {
  size?: SubjectChipSize
  subjects: TagContext[]
}

export function SubjectChip({
  color,
  label,
  size = 'sm',
}: SubjectChipProps) {
  return <AppTag size={size} tag={{ color, id: label, label }} />
}

export { SUBJECTS }

export function AppSubjectTag({ size = 'md', subject }: AppSubjectTagProps) {
  return <AppTag size={size} tag={subject} />
}

export default function AppSubjectsTags({
  size = 'md',
  subjects,
}: AppSubjectsTagsProps) {
  return <AppTags size={size} tags={subjects} />
}
