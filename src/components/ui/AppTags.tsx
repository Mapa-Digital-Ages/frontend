import React from 'react'
import { Box, Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { TagContext } from '../../types/common'
import { getTagChipTone, type TagSize } from '../../utils/themes'

type AppTagsProps = {
  size?: TagSize
  tags: TagContext[]
}

type TagChipProps = {
  size?: TagSize
  tag: TagContext
}

function getSizeSx(size: TagSize) {
  return size === 'sm'
    ? {
        height: 28,
        '& .MuiChip-label': {
          fontSize: '0.75rem',
          lineHeight: '1rem',
          paddingInline: '0.75rem',
        },
      }
    : size === 'lg'
      ? {
          height: 46,
          '& .MuiChip-label': {
            fontSize: '1.125rem',
            lineHeight: '1.5rem',
            paddingInline: '1.25rem',
          },
        }
      : {
          height: 36,
          '& .MuiChip-label': {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            paddingInline: '1rem',
          },
        }
}

export function AppTag({ size = 'md', tag }: TagChipProps) {
  const theme = useTheme()
  const tone = getTagChipTone(tag.color, { mode: theme.palette.mode })
  const className = `app-tag app-tag--${size}`

  return (
    <Chip
      className={className}
      label={tag.label}
      slotProps={{
        label: {
          className: 'app-tag__label',
        },
      }}
      variant="outlined"
      sx={{
        backgroundColor: tone.backgroundColor,
        borderColor: tone.borderColor,
        color: tone.color,
        ...getSizeSx(size),
      }}
    />
  )
}

export default function AppTags({ size = 'md', tags }: AppTagsProps) {
  return (
    <Box className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <AppTag key={tag.id} size={size} tag={tag} />
      ))}
    </Box>
  )
}
