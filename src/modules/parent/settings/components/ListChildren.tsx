import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Box, IconButton, List, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getHoverStyle, getRoleAccentColor } from '@/app/theme/core/roles'
import { useParentRole } from '@/modules/parent/shared/hooks/useParentRole'
import EmptyState from '@/shared/ui/EmptyState'
import AppCard from '@/shared/ui/AppCard'
import Pagination from '@/shared/ui/Pagination'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import type {
  ParentDashboardChild,
  ResultsSummary,
} from '@/modules/parent/settings/types/types'
import ListChildrenCard from './ListChildrenCard'

interface ListChildrenProps {
  children: ParentDashboardChild[]
  currentPage: number
  description?: string
  emptyStateDescription: string
  emptyStateTitle: string
  onCreate?: () => void | Promise<void>
  onDelete?: (child: ParentDashboardChild) => void | Promise<void>
  onEdit?: (child: ParentDashboardChild) => void | Promise<void>
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  onSelect: (id: string) => void
  query: string
  resultsSummary: ResultsSummary
  searchPlaceholder: string
  selectedChildId: string | null
  title?: string
  totalPages: number
}

export default function ListChildren({
  children,
  currentPage,
  description = 'Gerencie os filhos vinculados ao responsável.',
  emptyStateDescription,
  emptyStateTitle,
  onCreate,
  onDelete,
  onEdit,
  onPageChange,
  onQueryChange,
  onSelect,
  query,
  resultsSummary,
  searchPlaceholder,
  selectedChildId,
  title = 'Filhos',
  totalPages,
}: ListChildrenProps) {
  const theme = useTheme()
  const role = useParentRole()
  const accentColor = getRoleAccentColor(theme, role)
  const accentHover = getHoverStyle(theme, accentColor)

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
                fontSize: { md: 20, xs: 18 },
                fontWeight: 700,
                minWidth: 0,
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
            aria-label="Adicionar filho"
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
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <SearchBarAndFilter
          onQueryChange={onQueryChange}
          query={query}
          resultsSummary={resultsSummary}
          searchPlaceholder={searchPlaceholder}
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
        {children.length > 0 ? (
          <List
            disablePadding
            className="grid gap-4"
            role="list"
            sx={{
              display: 'grid',
              maxHeight: { md: 360, xs: 'none' },
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pl: { md: 0.5, xs: 0.75 },
              pr: { md: 1, xs: 0.75 },
              pt: { md: 0.5, xs: 0.75 },
            }}
          >
            {children.map(child => (
              <ListChildrenCard
                child={child}
                key={child.id}
                onDelete={onDelete}
                onEdit={onEdit}
                onSelect={onSelect}
                selected={child.id === selectedChildId}
              />
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
