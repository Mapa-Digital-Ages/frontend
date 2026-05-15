import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import EmptyState from '@/shared/ui/EmptyState'
import Pagination from '@/shared/ui/Pagination'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import type { DropdownOption } from '@/shared/ui/AppDropdown'
import AppCard from '@/shared/ui/AppCard'
import {
  getRoleAccentColor,
  getHoverStyle,
  getSelectionOutlineStyle,
} from '@/app/theme/core/roles'
import type {
  ApprovalResultsSummary,
  ApprovalStatus,
} from '@/modules/admin/shared/types/types'
import type { UserRole } from '@/shared/types/user'

export interface ApprovalStatusOption extends DropdownOption {
  value: ApprovalStatus
}

interface ApprovalComponentProps<TItem extends { id: string }> {
  description: string
  emptyStateDescription: string
  emptyStateTitle: string
  items: TItem[]
  onCreate?: () => void | Promise<void>
  onDelete?: () => void | Promise<void>
  onEdit?: () => void | Promise<void>
  onItemSelect?: (item: TItem) => void
  renderItem: (item: TItem) => ReactNode
  role: UserRole
  selectionMode?: 'edit' | 'delete' | null
  title: string
}

function SubjectComponent<TItem extends { id: string }>({
  description,
  emptyStateDescription,
  emptyStateTitle,
  items,
  onCreate,
  onDelete,
  onEdit,
  onItemSelect,
  renderItem,
  role,
  selectionMode,
  title,
}: ApprovalComponentProps<TItem>) {
  const theme = useTheme()
  const accentColor = getRoleAccentColor(theme, role)
  const errorColor = theme.palette.error.main
  const isSelecting = selectionMode != null
  const accentHover = getHoverStyle(theme, accentColor)
  const selectionColor = selectionMode === 'delete' ? errorColor : accentColor
  const selectionOutline = isSelecting
    ? getSelectionOutlineStyle(theme, selectionColor)
    : null

  return (
    <AppCard
      className="flex h-full min-h-0 flex-col"
      contentSx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 2,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <Box className="flex min-w-0 flex-col gap-2">
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            gap: 1.5,
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Box className="space-y-1">
            <Typography
              sx={{
                color: 'text.primary',
                flex: '1 1 auto',
                fontSize: { md: 20, xs: 18 },
                fontWeight: 700,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={title}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { md: 15, xs: 14 },
                maxWidth: 720,
              }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              gap: 1.5,
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            {onCreate ? (
              <IconButton
                aria-label="Adicionar"
                onClick={onCreate}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: 'var(--app-radius-control)',
                  color: 'text.primary',
                  flexShrink: 0,
                  height: 32,
                  width: 32,
                  '&:hover': {
                    backgroundColor: accentHover.backgroundColor,
                    borderColor: accentHover.borderColor,
                  },
                }}
              >
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: 0,
        }}
      >
        {items.length > 0 ? (
          <List
            disablePadding
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: 'repeat(4, 1fr)', xs: '1fr' },
              gap: 2,
              maxHeight: { md: 160, xs: 'none' },
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pr: { md: 1, xs: 0.75 },
              pl: { md: 0.5, xs: 0.75 },
              pt: { md: 0.5, xs: 0.75 },
            }}
          >
            {items.map(item => (
              <ListItem
                disablePadding
                key={item.id}
                onClick={
                  isSelecting && onItemSelect
                    ? () => onItemSelect(item)
                    : undefined
                }
                sx={{
                  display: 'block',
                  flexShrink: 0,
                  minWidth: 0,
                  width: '100%',
                  ...(isSelecting && selectionOutline
                    ? {
                        borderRadius: 'var(--app-radius-card, 16px)',
                        cursor: 'pointer',
                        transition:
                          'box-shadow 180ms ease, outline-color 180ms ease, transform 180ms ease',
                        '&:hover': {
                          ...selectionOutline,
                          transform: 'translateY(-1px)',
                        },
                      }
                    : {}),
                }}
              >
                {renderItem(item)}
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: '1 1 auto',
              justifyContent: 'center',
              minHeight: 0,
              overflow: 'hidden',
              px: { md: 2, xs: 1 },
              py: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: 720,
                width: '100%',
              }}
            >
              <EmptyState
                description={emptyStateDescription}
                title={emptyStateTitle}
              />
            </Box>
          </Box>
        )}
      </Box>
    </AppCard>
  )
}

export default SubjectComponent
