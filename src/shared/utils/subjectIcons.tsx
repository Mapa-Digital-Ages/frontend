import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded'
import NatureRoundedIcon from '@mui/icons-material/NatureRounded'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import type { SvgIconProps } from '@mui/material'
import type { ReactElement } from 'react'

const SUBJECT_ICONS: Record<string, ReactElement<SvgIconProps>> = {
  portuguese: <MenuBookRoundedIcon />,
  mathematics: <CalculateRoundedIcon />,
  geography: <PublicRoundedIcon />,
  science: <ScienceRoundedIcon />,
  history: <HistoryEduRoundedIcon />,
  biology: <NatureRoundedIcon />,
  english: <TranslateRoundedIcon />,
}

const DEFAULT_ICON = <LayersOutlinedIcon />

export function getSubjectIcon(subjectId?: string): ReactElement<SvgIconProps> {
  return (subjectId && SUBJECT_ICONS[subjectId]) || DEFAULT_ICON
}
