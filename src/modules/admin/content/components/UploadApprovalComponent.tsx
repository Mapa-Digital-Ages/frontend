import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import EmptyState from '@/shared/ui/EmptyState'
import Pagination from '@/shared/ui/Pagination'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AppCard from '@/shared/ui/AppCard'
import {
  getRoleAccentColor,
  getSelectionOutlineStyle,
} from '@/app/theme/core/roles'
import type { ApprovalResultsSummary } from '@/modules/admin/shared/types/types'
import type { UserRole } from '@/shared/types/user'
import type {
  UploadApprovalFilter,
  UploadApprovalItem,
  UploadApprovalStatus,
} from '../types/upload'
import type { DropdownOption } from '@/shared/ui/AppDropdown'

export interface UploadStatusOption extends DropdownOption {
  value: UploadApprovalFilter
}

interface UploadApprovalComponentProps {
  currentPage: number
  description: string
  emptyStateDescription: string
  emptyStateTitle: string
  filterOptions: UploadStatusOption[]
  items: UploadApprovalItem[]
  onDelete?: () => void | Promise<void>
  onEdit?: () => void | Promise<void>
  onItemSelect?: (item: UploadApprovalItem) => void
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  onStatusChange: (status: UploadApprovalFilter) => void
  query: string
  renderItem: (item: UploadApprovalItem) => ReactNode
  resultsSummary: ApprovalResultsSummary
  role: UserRole
  searchPlaceholder: string
  selectedStatus: UploadApprovalFilter
  selectionMode?: 'edit' | 'delete' | null
  title: string
  totalPages: number
}

function UploadApprovalComponent({
  currentPage,
  description,
  emptyStateDescription,
  emptyStateTitle,
  filterOptions,
  items,
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
}: UploadApprovalComponentProps) {
  const theme = useTheme()
  const accentColor = getRoleAccentColor(theme, role)
  const errorColor = theme.palette.error.main
  const isSelecting = selectionMode != null
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
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <SearchBarAndFilter
          filterOptions={filterOptions}
          onQueryChange={onQueryChange}
          onStatusChange={status =>
            onStatusChange(status as UploadApprovalFilter)
          }
          query={query}
          resultsSummary={resultsSummary}
          searchPlaceholder={searchPlaceholder}
          selectedStatus={selectedStatus}
        />
      </Box>
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
          <List
            disablePadding
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: 2,
              maxHeight: { md: 360, xs: 'none' },
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pl: { md: 0.5, xs: 0.75 },
              pr: { md: 1, xs: 0.75 },
              pt: { md: 0.5, xs: 0.75 },
              width: '100%',
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
            <Box sx={{ maxWidth: 720, width: '100%' }}>
              <EmptyState
                description={emptyStateDescription}
                title={emptyStateTitle}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ flexShrink: 0, marginTop: 'auto', width: '100%' }}>
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

export default UploadApprovalComponent
