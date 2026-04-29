import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { Box, Button, IconButton, Typography } from '@mui/material'
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
  getSelectedStyle,
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
  currentPage: number
  description: string
  emptyStateDescription: string
  emptyStateTitle: string
  filterOptions: ApprovalStatusOption[]
  items: TItem[]
  onCreate?: () => void | Promise<void>
  onDelete?: () => void | Promise<void>
  onEdit?: () => void | Promise<void>
  onItemSelect?: (item: TItem) => void
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  onStatusChange: (status: ApprovalStatus) => void
  query: string
  renderItem: (item: TItem) => ReactNode
  resultsSummary: ApprovalResultsSummary
  role: UserRole
  searchPlaceholder: string
  selectedStatus: ApprovalStatus
  selectionMode?: 'edit' | 'delete' | null
  title: string
  totalPages: number
}

function ApprovalComponent<TItem extends { id: string }>({
  currentPage,
  description,
  emptyStateDescription,
  emptyStateTitle,
  filterOptions,
  items,
  onCreate,
  onDelete,
  onEdit,
  onItemSelect,
  onPageChange,
  onQueryChange,
  onStatusChange,
  query,
  renderItem,
  resultsSummary,
  role,
  searchPlaceholder,
  selectedStatus,
  selectionMode,
  title,
  totalPages,
}: ApprovalComponentProps<TItem>) {
  const theme = useTheme()
  const accentColor = getRoleAccentColor(theme, role)
  const errorColor = theme.palette.error.main
  const isSelecting = selectionMode != null

  const accentHover = getHoverStyle(theme, accentColor)
  const errorHover = getHoverStyle(theme, errorColor)
  const editSelected = getSelectedStyle(theme, accentColor)
  const deleteSelected = getSelectedStyle(theme, errorColor)

  const selectionColor = selectionMode === 'delete' ? errorColor : accentColor
  const selectionOutline = isSelecting
    ? getSelectionOutlineStyle(theme, selectionColor)
    : null
  const selectionLabel =
    selectionMode === 'edit'
      ? 'Selecione um card para editar.'
      : selectionMode === 'delete'
        ? 'Selecione um card para excluir.'
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
            {onEdit ? (
              <IconButton
                aria-label="Editar"
                onClick={onEdit}
                sx={{
                  backgroundColor:
                    selectionMode === 'edit'
                      ? editSelected.backgroundColor
                      : 'background.paper',
                  border: '1px solid',
                  borderColor:
                    selectionMode === 'edit'
                      ? editSelected.borderColor
                      : 'background.border',
                  borderRadius: 'var(--app-radius-control)',
                  color:
                    selectionMode === 'edit' ? accentColor : 'text.primary',
                  flexShrink: 0,
                  height: 32,
                  width: 32,
                  '&:hover': {
                    backgroundColor: accentHover.backgroundColor,
                    borderColor: accentHover.borderColor,
                  },
                }}
              >
                <ModeEditOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            ) : null}
            {onDelete ? (
              <IconButton
                aria-label="Excluir"
                onClick={onDelete}
                sx={{
                  backgroundColor:
                    selectionMode === 'delete'
                      ? deleteSelected.backgroundColor
                      : 'background.paper',
                  border: '1px solid',
                  borderColor:
                    selectionMode === 'delete'
                      ? deleteSelected.borderColor
                      : 'background.border',
                  borderRadius: 'var(--app-radius-control)',
                  color:
                    selectionMode === 'delete' ? errorColor : 'text.primary',
                  flexShrink: 0,
                  height: 32,
                  width: 32,
                  '&:hover': {
                    backgroundColor: errorHover.backgroundColor,
                    borderColor: errorHover.borderColor,
                  },
                }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <SearchBarAndFilter
          filterOptions={filterOptions}
          onQueryChange={onQueryChange}
          onStatusChange={status => onStatusChange(status as ApprovalStatus)}
          query={query}
          resultsSummary={resultsSummary}
          searchPlaceholder={searchPlaceholder}
          selectedStatus={selectedStatus}
        />
      </Box>
      {selectionLabel ? (
        <Box
          sx={{
            alignItems: { sm: 'center', xs: 'flex-start' },
            backgroundColor:
              selectionMode === 'delete'
                ? errorHover.backgroundColor
                : accentHover.backgroundColor,
            border: '1px solid',
            borderColor:
              selectionMode === 'delete'
                ? errorHover.borderColor
                : accentHover.borderColor,
            borderRadius: 'var(--app-radius-control)',
            color: 'text.primary',
            display: 'flex',
            flexDirection: { sm: 'row', xs: 'column' },
            gap: 1,
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {selectionLabel}
          </Typography>
          <Button
            onClick={() => {
              if (selectionMode === 'edit') {
                void onEdit?.()
                return
              }

              void onDelete?.()
            }}
            size="small"
            sx={{
              borderRadius: 'var(--app-radius-control)',
              color: selectionMode === 'delete' ? errorColor : accentColor,
              fontSize: 12,
              fontWeight: 700,
              minHeight: 28,
              textTransform: 'none',
            }}
          >
            Cancelar seleção
          </Button>
        </Box>
      ) : null}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: 0,
          paddingTop: 2,
        }}
      >
        {items.length > 0 ? (
          <Box
            className="grid gap-4"
            sx={{
              flex: 1,
              maxHeight: { md: 360, xs: 'none' },
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pr: { md: 1, xs: 0.75 },
              pl: { md: 0.5, xs: 0.75 },
              pt: { md: 0.5, xs: 0.75 },
            }}
          >
            {items.map(item => (
              <Box
                key={item.id}
                onClick={
                  isSelecting && onItemSelect
                    ? () => onItemSelect(item)
                    : undefined
                }
                sx={{
                  flexShrink: 0,
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
              </Box>
            ))}
          </Box>
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

      <Box
        sx={{
          flexShrink: 0,
          marginTop: 'auto',
          width: '100%',
        }}
      >
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          role={role}
          totalPages={totalPages}
        />
      </Box>
    </AppCard>
  )
}

export default ApprovalComponent
