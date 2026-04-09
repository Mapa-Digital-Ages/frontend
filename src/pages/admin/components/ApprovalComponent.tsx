import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import { SearchBarAndFilter } from '@/components/common/SearchBarAndFilter'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import AppCard from '@/components/ui/AppCard'
import { useUserRole } from '@/hooks/useUserRole'
import { AppColors } from '@/styles/AppColors'
import type {
  ApprovalResultsSummary,
  ApprovalStatus,
} from '@/types/admin'
import type { UserRole } from '@/types/user'

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
  onCreate: () => void | Promise<void>
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  onStatusChange: (status: ApprovalStatus) => void
  query: string
  renderItem: (item: TItem) => ReactNode
  resultsSummary: ApprovalResultsSummary
  searchPlaceholder: string
  selectedStatus: ApprovalStatus
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
  onPageChange,
  onQueryChange,
  onStatusChange,
  query,
  renderItem,
  resultsSummary,
  searchPlaceholder,
  selectedStatus,
  title,
  totalPages,
}: ApprovalComponentProps<TItem>) {
  const theme = useTheme()
  const { role } = useUserRole()
  const accentColor = AppColors.role.admin.primary

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
      <Box
        sx={{
          alignItems: { sm: 'flex-start', xs: 'stretch' },
          display: 'flex',
          flexDirection: { sm: 'row', xs: 'column' },
          gap: 1.5,
          justifyContent: 'space-between',
        }}
      >
        <Box className="space-y-1">
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 20, xs: 18 },
              fontWeight: 700,
            }}
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

        <IconButton
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
              backgroundColor: alpha(
                accentColor,
                theme.palette.mode === 'dark' ? 0.08 : 0.12
              ),
              borderColor: alpha(
                accentColor,
                theme.palette.mode === 'dark' ? 0.24 : 0.16
              ),
            },
          }}
        >
          <AddRoundedIcon fontSize="small" />
        </IconButton>
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

      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
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
              pr: { md: 0.5, xs: 0 },
            }}
          >
            {items.map(item => (
              <Box key={item.id} sx={{ flexShrink: 0 }}>
                {renderItem(item)}
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              minHeight: 'fit-content',
            }}
          >
            <EmptyState
              description={emptyStateDescription}
              title={emptyStateTitle}
            />
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
          role={(role ?? 'admin') as UserRole}
          totalPages={totalPages}
        />
      </Box>
    </AppCard>
  )
}

export default ApprovalComponent
