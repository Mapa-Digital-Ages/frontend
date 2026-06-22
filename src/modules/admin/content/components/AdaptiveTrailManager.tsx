import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import {
  Box,
  IconButton,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import AppCard from '@/shared/ui/AppCard'
import AppTags, { AppTag } from '@/shared/ui/AppTags'
import EmptyState from '@/shared/ui/EmptyState'
import type {
  ApprovalResultsSummary,
  AdaptiveTrailAdminItem,
  ContentApprovalItem,
} from '@/modules/admin/shared/types/types'
import type { DropdownOption } from '@/shared/ui/AppDropdown'
import type { UserRole } from '@/shared/types/user'
import { getHoverStyle } from '@/app/theme/core/roles'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import Pagination from '@/shared/ui/Pagination'

interface AdaptiveTrailManagerProps {
  contentOptions: DropdownOption[]
  contents: ContentApprovalItem[]
  currentPage: number
  emptyStateDescription: string
  filterOptions: DropdownOption[]
  isLoading?: boolean
  onCreateTrail: () => void
  onDeleteTrail: (trail: AdaptiveTrailAdminItem) => void
  onEditTrail: (trail: AdaptiveTrailAdminItem) => void
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  onSubjectChange: (subjectId: string) => void
  query: string
  resultsSummary: ApprovalResultsSummary
  role: UserRole
  selectedSubjectId: string
  totalPages: number
  trails: AdaptiveTrailAdminItem[]
}

function AdaptiveTrailManager({
  contentOptions,
  contents,
  currentPage,
  emptyStateDescription,
  filterOptions,
  isLoading = false,
  onCreateTrail,
  onDeleteTrail,
  onEditTrail,
  onPageChange,
  onQueryChange,
  onSubjectChange,
  query,
  resultsSummary,
  role,
  selectedSubjectId,
  totalPages,
  trails,
}: AdaptiveTrailManagerProps) {
  const theme = useTheme()
  const hasContentSource = contentOptions.length > 0 || contents.length > 0
  const accent = theme.palette.error.main
  const errorColor = theme.palette.error.main
  const warningColor = theme.palette.warning.main
  const accentHover = getHoverStyle(theme, accent)
  const errorHover = getHoverStyle(theme, errorColor)
  const warningHover = getHoverStyle(theme, warningColor)

  return (
    <AppCard
      contentSx={{
        display: 'grid',
        gap: 2,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          gap: 1.5,
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 20, xs: 17 },
              fontWeight: 800,
            }}
          >
            Trilhas adaptativas
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { md: 14, xs: 13 },
              maxWidth: 300,
            }}
          >
            Crie e edite trilhas baseadas nos conteúdos cadastrados.
          </Typography>
        </Box>
        <IconButton
          aria-label="Nova trilha"
          disabled={!hasContentSource || isLoading}
          onClick={onCreateTrail}
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

      <Box sx={{ flexShrink: 0 }}>
        <SearchBarAndFilter
          filterOptions={filterOptions}
          onQueryChange={onQueryChange}
          onStatusChange={onSubjectChange}
          query={query}
          resultsSummary={resultsSummary}
          searchPlaceholder="Pesquisar trilhas..."
          selectedStatus={selectedSubjectId}
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
        {trails.length > 0 ? (
          <List
            disablePadding
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxHeight: { md: 360, xs: 'none' },
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pr: { md: 1, xs: 0.75 },
              pl: { md: 0.5, xs: 0.75 },
              pt: { md: 0.5, xs: 0.75 },
            }}
          >
            {trails.map(trail => (
              <ListItem
                disablePadding
                key={trail.id}
                sx={{
                  display: 'block',
                  flexShrink: 0,
                  minWidth: 0,
                  width: '100%',
                }}
              >
                <Box
                  key={trail.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'background.border',
                    borderRadius: { md: '18px', xs: '14px' },
                    display: 'grid',
                    gap: 1.25,
                    minWidth: 0,
                    p: { md: 2, xs: 1.5 },
                  }}
                >
                  <Box
                    sx={{
                      alignItems: { sm: 'flex-start', xs: 'stretch' },
                      display: 'flex',
                      flexDirection: { sm: 'row', xs: 'column' },
                      gap: 1,
                      justifyContent: 'space-between',
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ minWidth: 0, width: '100%' }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: alpha(accent, 0.12),
                          border: `1px solid ${alpha(accent, 0.28)}`,
                          borderRadius: '12px',
                          color: accent,
                          display: 'flex',
                          flexShrink: 0,
                          height: 36,
                          justifyContent: 'center',
                          width: 36,
                        }}
                      >
                        <RouteRoundedIcon fontSize="small" />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: 'text.primary',
                            fontSize: { md: 17, xs: 15 },
                            fontWeight: 800,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={trail.name}
                        >
                          {trail.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontSize: 12,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={trail.contentTitle}
                        >
                          Base: {trail.contentTitle}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignSelf: { sm: 'flex-start', xs: 'flex-end' } }}
                    >
                      <Tooltip title="Editar trilha">
                        <IconButton
                          aria-label={`Editar trilha ${trail.name}`}
                          onClick={() => onEditTrail(trail)}
                          size="small"
                          sx={{
                            border: '1px solid',
                            borderColor: 'background.border',
                            borderRadius: 'var(--app-radius-control)',
                            color: warningColor,
                            flexShrink: 0,
                            height: 32,
                            width: 32,
                            '&:hover': {
                              backgroundColor: warningHover.backgroundColor,
                              borderColor: warningHover.borderColor,
                            },
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir trilha">
                        <IconButton
                          aria-label={`Excluir trilha ${trail.name}`}
                          onClick={() => onDeleteTrail(trail)}
                          size="small"
                          sx={{
                            border: '1px solid',
                            borderColor: 'background.border',
                            borderRadius: 'var(--app-radius-control)',
                            color: errorColor,
                            flexShrink: 0,
                            height: 32,
                            width: 32,
                            '&:hover': {
                              backgroundColor: errorHover.backgroundColor,
                              borderColor: errorHover.borderColor,
                            },
                          }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  <Typography
                    sx={{
                      color: 'text.secondary',
                      display: '-webkit-box',
                      fontSize: 13,
                      lineHeight: 1.45,
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {trail.description || 'Sem descrição cadastrada.'}
                  </Typography>

                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {trail.subject ? (
                      <AppTags size="sm" tags={[trail.subject]} />
                    ) : null}
                    <AppTag
                      size="sm"
                      tag={{
                        color: accent,
                        id: `${trail.id}-questions`,
                        label: `${trail.questionCount} pergunta(s)`,
                      }}
                    />
                  </Box>
                </Box>
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
                title="Nenhuma trilha encontrada"
                description={
                  isLoading
                    ? 'Carregando trilhas adaptativas.'
                    : emptyStateDescription
                }
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

export default AdaptiveTrailManager
