import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import AppCard from '@/shared/ui/AppCard'
import { getHoverStyle } from '@/app/theme/core/roles'
import type { SubjectItem } from '@/modules/admin/shared/types/types'

export interface SubjectCardProps {
  item: SubjectItem
  activitiesCount?: number
  onDelete: (item: SubjectItem) => void
  onEdit: (item: SubjectItem) => void
}

function SubjectCard({
  item,
  activitiesCount,
  onDelete,
  onEdit,
}: SubjectCardProps) {
  const theme = useTheme()
  const errorColor = theme.palette.error.main
  const errorHover = getHoverStyle(theme, errorColor)
  const subjectColor = item.color ?? theme.palette.primary.main
  const resolvedActivitiesCount = activitiesCount ?? item.uploadsCount

  const tags = [
    {
      id: 'contents',
      label: `${item.contentCount} conteúdo(s)`,
      accent: true,
    },
    {
      id: 'activities',
      label: `${resolvedActivitiesCount} atividade(s)`,
      accent: false,
    },
  ]

  return (
    <AppCard>
      <Box
        sx={{
          alignItems: 'flex-start',
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          rowGap: 0.5,
        }}
      >
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { md: 18, xs: 16 },
            fontWeight: 700,
            gridColumn: 1,
            gridRow: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={item.name}
        >
          {item.name}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 32px)',
            justifyContent: 'end',
            columnGap: 1,
          }}
        >
          <Tooltip title="Editar disciplina">
            <span>
              <IconButton
                aria-label="Editar disciplina"
                onClick={() => onEdit(item)}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: 'var(--app-radius-control)',
                  color: 'text.secondary',
                  gridColumn: 2,
                  gridRow: 1,
                  height: 32,
                  width: 32,
                  '& .MuiSvgIcon-root': { fontSize: 16 },
                  '&:hover': {
                    backgroundColor: errorHover.backgroundColor,
                    borderColor: errorHover.borderColor,
                    color: errorColor,
                  },
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Excluir disciplina">
            <span>
              <IconButton
                aria-label="Excluir disciplina"
                onClick={() => onDelete(item)}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: 'var(--app-radius-control)',
                  color: 'text.secondary',
                  gridColumn: 2,
                  gridRow: 1,
                  height: 32,
                  width: 32,
                  '& .MuiSvgIcon-root': { fontSize: 16 },
                  '&:hover': {
                    backgroundColor: errorHover.backgroundColor,
                    borderColor: errorHover.borderColor,
                    color: errorColor,
                  },
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
        {tags.map(tag => (
          <Chip
            key={tag.id}
            label={tag.label}
            size="small"
            sx={
              tag.accent
                ? {
                    backgroundColor: alpha(subjectColor, 0.12),
                    borderColor: alpha(subjectColor, 0.25),
                    borderStyle: 'solid',
                    borderWidth: 1,
                    color: subjectColor,
                    fontSize: 12,
                    fontWeight: 600,
                    height: 26,
                    '& .MuiChip-label': { px: 1.25 },
                  }
                : {
                    backgroundColor: alpha(
                      theme.palette.text.primary,
                      theme.palette.mode === 'dark' ? 0.06 : 0.04
                    ),
                    borderColor: alpha(theme.palette.text.primary, 0.12),
                    borderStyle: 'solid',
                    borderWidth: 1,
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 400,
                    height: 26,
                    '& .MuiChip-label': { px: 1.25 },
                  }
            }
            variant="outlined"
          />
        ))}
      </Box>
    </AppCard>
  )
}

export default SubjectCard
